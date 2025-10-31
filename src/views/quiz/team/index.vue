<template>
  <div>
    <HSearch
      :search-form-config="searchForm"
      :init-value="params"
      :hide-add-btn="userStore.userInfo?.id !== 1"
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
    <NModal v-model:show="showModal">
      <n-card
        style="width: 600px"
        :title="t('common.add')"
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

import {
  fetchQuizMatchTypesList,
  addQuizTeams,
  editQuizTeams,
  fetchQuizTeamsList,
  findQuizTeamsById,
} from '@/api/quiz'; // 假设的 API 函数
import HForm from '@/components/Base/Form';
import HSearch from '@/components/Base/Search';
import { usePage } from '@/hooks/use-page';
import { IQuizMatchTypes, IList, IQuizTeams } from '@/interface';
import { useUserStore } from '@/store/user';

import { columnsConfig } from './config/columns.config'; // 需创建对应配置文件
import { formConfig } from './config/form.config';
import { searchFormConfig } from './config/search.config';

const { t } = useI18n();

const userStore = useUserStore();

interface ISearch extends IQuizMatchTypes, IList<any> {}

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

const hFormRef = ref<InstanceType<typeof HForm> | null>(null);
// 定义组件的响应式数据
const formData = ref({ ...props.modelValue });
// 定义新增/编辑的表单引用
const confirmLoading = ref(false);

const tableListData = ref([]);
const total = ref(0);
const pagination = usePage();
const tableListLoading = ref(false);
const formConfigRes = ref();

const params = ref<ISearch>({
  orderName: 'team_id',
  orderBy: 'desc',
});

const edit = ref(false);

const showModal = ref(false);

const searchForm = ref(searchFormConfig(t));
const createColumns = (): TableColumns<IQuizTeams> => {
  const action: TableColumns<IQuizTeams> = [
    {
      title: '操作',
      key: 'actions',
      width: 200,
      align: 'center',
      fixed: 'right',
      render(row) {
        if (userStore.userInfo?.id !== 1) {
          return null;
        } else {
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
                    console.log('触发编辑', row);
                    find(row.team_id);
                  },
                },
                () => '编辑' // 用箭头函数返回性能更好。
              ),
            ]
          );
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
  const res = await fetchQuizMatchTypesList({});
  if (res.code === 200) {
    formConfigRes.value = formConfig({
      quizTypeOption: res.data.rows.map((v) => {
        return { label: v.type_name, value: v.id };
      }),
    });
  }
  await handlePageChange(1);
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
    const res: any = await fetchQuizTeamsList(args);
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

async function handlePageChange(currentPage) {
  await ajaxFetchList({
    ...params.value,
    pageSize: pagination.pageSize,
    nowPage: currentPage,
  });
}

async function find(id) {
  if (id) {
    const res = await findQuizTeamsById(id);
    if (res.code !== 200) return;
    const row = res.data[0];
    let teamLogo: UploadFileInfo[] = [];
    if (row.team_logo) {
      teamLogo = [
        {
          id: row.team_logo as string,
          name: row.team_logo as string,
          url: row.team_logo as string,
          status: 'finished',
          percentage: 100,
        },
      ];
    }
    showModal.value = true;
    edit.value = true;
    formData.value = {
      ...row,
      // @ts-ignore
      team_logo: teamLogo,
    };
  }
}

const handleSearch = (v) => {
  params.value = {
    ...params.value,
    ...v,
    nowPage: 1,
    pageSize: pagination.pageSize,
    rangTimeType: v.rangTimeType ? 'created_at' : undefined,
    rangTimeStart: v.rangTimeType ? v.rangTimeType[0] : undefined,
    rangTimeEnd: v.rangTimeType ? v.rangTimeType[1] : undefined,
  };
  handlePageChange(1);
};

function handleAdd() {
  formData.value = {};
  showModal.value = true;
  edit.value = false;
}

function handleCreate(v: IQuizTeams) {
  confirmLoading.value = false;
  addQuizTeams(v).then((res: any) => {
    showModal.value = false;
    confirmLoading.value = false;
    handlePageChange(1);
    window.$message.success(res);
  });
}

function handleUpdate(v: IQuizTeams) {
  confirmLoading.value = false;
  editQuizTeams(v).then((res: any) => {
    showModal.value = false;
    confirmLoading.value = false;
    handlePageChange(1);
    edit.value = false;
    window.$message.success(res);
  });
}

const handleConfirm = (vv: IQuizTeams) => {
  const v = { ...vv };
  let avatar = '';
  // @ts-ignore
  if (v.team_logo?.[0] && v.team_logo[0].flag) {
    // @ts-ignore
    avatar = v.team_logo[0].resultUrl;
  }
  v.team_logo = avatar;
  if (edit.value) {
    handleUpdate(v);
  } else {
    handleCreate(v);
  }
};
</script>

<style lang="scss" scoped></style>
