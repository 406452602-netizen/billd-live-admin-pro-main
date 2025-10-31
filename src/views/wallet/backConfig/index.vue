<template>
  <div>
    <HSearch
      :search-form-config="searchForm"
      :init-value="params"
      :hide-add-btn="userStore.userInfo?.id != 1"
      @click-add="handleAdd"
      @click-search="handleSearch"
    ></HSearch>
    <n-data-table
      remote
      :scroll-x="scrollX"
      :loading="tableListLoading"
      :columns="columns"
      :data="tableListData"
      :pagination="pagination"
      :bordered="false"
      @update:page="handlePageChange"
    />
    <NModal
      v-model:show="showModal"
      style="width: 600px"
      :title="t('common.add')"
      preset="dialog"
    >
      <n-card
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <HForm
          ref="hFormRef"
          v-bind="formConfigRes"
          v-model="formData"
          :show-action="showAction"
          :confirm-loading="confirmLoading"
          @update:filed="handleUpdateFiled"
          @click:confirm="handleConfirm"
        ></HForm>
      </n-card>
    </NModal>
  </div>
</template>

<script lang="ts" setup>
import { NButton, NSpace, UploadFileInfo } from 'naive-ui';
import { TableColumns } from 'naive-ui/es/data-table/src/interface';
import { h, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import { fetchBankList, addBank, editBank, deleteBank } from '@/api/wallet.ts';
import HForm from '@/components/Base/Form';
import HSearch from '@/components/Base/Search';
import { usePage } from '@/hooks/use-page';
import { bankTypeEnum, IBank, LiveRoomIsShowEnum } from '@/interface.ts';
import { useUserStore } from '@/store/user';

import { columnsConfig } from './config/columns.config'; // 需创建对应配置文件
import { formConfig } from './config/form.config';
import { searchFormConfig } from './config/search.config'; // 需创建对应配置文件

// 假设的 API 函数

const userStore = useUserStore();
const { t } = useI18n();

interface ISearch {
  orderName: string;
  orderBy: string;
}

const props = withDefaults(
  defineProps<{
    modelValue?: any;
    showAction?: boolean;
  }>(),
  {
    modelValue: {},
    showAction: true,
  }
);

// 定义组件的响应式数据
const formData = ref({ ...props.modelValue });
const confirmLoading = ref(false);
const tableListData = ref([]);
const total = ref(0);
const pagination = usePage();
const tableListLoading = ref(false);
const formConfigRes = ref();
const params = ref<ISearch>({
  orderName: 'id',
  orderBy: 'desc',
});
const edit = ref(false);
const showModal = ref(false);
const searchForm = ref(searchFormConfig(t));

const virtualTypeOption = [
  {
    label: 'TRC20',
    value: 'TRC20',
  },
  {
    label: 'ERC20',
    value: 'ERC20',
  },
];

const bankTypeOption = [
  {
    label: '银行卡',
    value: 'BANK_CARD',
  },
  {
    label: '储蓄卡',
    value: 'SAVINGS_CARD',
  },
];

const createColumns = (): TableColumns<IBank> => {
  const action: TableColumns<IBank> = [
    {
      title: '操作',
      key: 'actions',
      width: 200,
      align: 'center',
      fixed: 'right',
      render(row) {
        if (userStore.userInfo?.id === 1) {
          return h(
            NSpace,
            {
              justify: 'center',
            },
            () => [
              h(
                NButton,
                {
                  size: 'small',
                  type: 'primary',
                  onClick: () => {
                    find(row.id);
                  },
                },
                () => '编辑'
              ),
              h(
                NButton,
                {
                  size: 'small',
                  type: 'error',
                  onClick: () => {
                    deleteBank(row.id).then(() => {
                      handlePageChange(1);
                    });
                  },
                },
                () => '删除'
              ),
            ]
          );
        } else {
          return null;
        }
      },
    },
  ];
  return [...columnsConfig(t), ...action];
};

const columns = createColumns();
const scrollX = ref(0);
columns.forEach((item) => {
  if (item.width) {
    scrollX.value += Number(item.width);
  }
});

onMounted(async () => {
  await handlePageChange(1);
  formConfigRes.value = formConfig(bankTypeOption);
});

watch(
  () => pagination.pageSize,
  () => {
    handlePageChange(1);
  }
);

async function ajaxFetchList(args) {
  try {
    tableListLoading.value = true;
    const res = await fetchBankList(args);
    if (res.code === 200) {
      tableListLoading.value = false;
      tableListData.value = res.data.rows;
      total.value = res.data.total;
      pagination.page = args.nowPage;
      pagination.itemCount = res.data.total;
      pagination.pageSize = args.pageSize;
    } else {
      Promise.reject(res);
    }
  } catch (err) {
    Promise.reject(err);
  }
}

function handleUpdateFiled(v, value) {
  console.log('更新', v, value);
  console.log('formData', formData);
  if (v == 'type') {
    if (value == bankTypeEnum.VIRTUAL) {
      formConfigRes.value = formConfig(virtualTypeOption);
    } else {
      formConfigRes.value = formConfig(bankTypeOption);
    }
  }
}

async function handlePageChange(currentPage) {
  await ajaxFetchList({
    ...params.value,
    pageSize: pagination.pageSize,
    nowPage: currentPage,
  });
}

async function find(id) {
  if (id) {
    const res = await fetchBankList({ id });
    if (res.code === 200 && res.data.rows.length > 0) {
      const row = res.data.rows[0];

      let logo: UploadFileInfo[] = [];
      if (row.logo) {
        logo = [
          {
            id: row.logo as string,
            name: row.logo as string,
            url: row.logo as string,
            status: 'finished',
            percentage: 100,
          },
        ];
      }

      edit.value = true;
      formData.value = {
        ...row,
        logo,
      };
      if (formData.value.type == LiveRoomIsShowEnum.yes) {
        formConfigRes.value = formConfig(virtualTypeOption);
      } else {
        formConfigRes.value = formConfig(bankTypeOption);
      }
      showModal.value = true;
    }
  }
}

const handleSearch = (v) => {
  params.value = {
    ...params.value,
    ...v,
    nowPage: 1,
    pageSize: pagination.pageSize,
  };
  handlePageChange(1);
};

function handleAdd() {
  showModal.value = true;
  edit.value = false;
  formData.value = {};

  formConfigRes.value = formConfig(bankTypeOption);
}

function handleCreate(v: IBank) {
  confirmLoading.value = true;
  addBank(v)
    .then((res) => {
      if (res.code === 200) {
        showModal.value = false;
        confirmLoading.value = false;
        handlePageChange(1);
        window.$message.success('添加成功');
      }
    })
    .finally(() => {
      confirmLoading.value = false;
    });
}

function handleUpdate(v: IBank) {
  confirmLoading.value = true;
  editBank(v)
    .then((res) => {
      if (res.code === 200) {
        showModal.value = false;
        confirmLoading.value = false;
        handlePageChange(1);
        window.$message.success('修改成功');
      }
    })
    .finally(() => {
      confirmLoading.value = false;
    });
}

const handleConfirm = (vv: IBank) => {
  const v = { ...vv };

  let avatar = '';
  // @ts-ignore
  if (v.team_logo?.[0] && v.team_logo[0].flag) {
    // @ts-ignore
    avatar = v.team_logo[0].resultUrl;
  }
  v.logo = avatar;
  if (edit.value) {
    handleUpdate(v);
  } else {
    handleCreate(v);
  }
};
</script>

<style lang="scss" scoped>
.text-center {
  text-align: center;
}
</style>
