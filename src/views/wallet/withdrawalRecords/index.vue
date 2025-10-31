<template>
  <div>
    <HSearch
      :search-form-config="searchForm"
      :init-value="params"
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
      v-model:show="showWithdrawal"
      style="width: 600px"
      title="提现审核"
      preset="dialog"
    >
      <n-descriptions
        label-placement="left"
        title="描述"
        :column="2"
        size="small"
      >
        <n-descriptions-item label="提现金额"
          >{{ formData?.amount }}
        </n-descriptions-item>
        <n-descriptions-item label="提现银行/虚拟币账号"
          >{{ formData?.bankCard.bank.bank_name }}
        </n-descriptions-item>
        <n-descriptions-item label="提现类型"
          >{{
            formData?.bankCard.bank.type == bankTypeEnum.BANK
              ? '银行卡'
              : '虚拟币'
          }}
        </n-descriptions-item>
        <n-descriptions-item label="银行卡类型/虚拟币协议"
          >{{ formData?.bankCard.protocol_type }}
        </n-descriptions-item>
        <n-descriptions-item label="提现账号"
          >{{ formData?.bankCard.card_number }}
        </n-descriptions-item>
        <n-descriptions-item label="提交时间"
          >{{ formData?.created_at }}
        </n-descriptions-item>
      </n-descriptions>
      <n-form
        ref="auditFormRef"
        :model="auditForm"
        :rules="formRules"
      >
        <n-form-item
          label="审核状态"
          path="status"
        >
          <n-radio-group
            v-model:value="auditForm.status"
            :disabled="auditStatusEnum.PENDING != formData.status"
          >
            <n-radio :value="auditStatusEnum.APPROVED">通过</n-radio>
            <n-radio :value="auditStatusEnum.REJECTED">拒绝</n-radio>
          </n-radio-group>
        </n-form-item>
      </n-form>
      <!--        <n-form-item label="审核备注">-->
      <!--          <n-input-->
      <!--            v-model:value="auditForm.remark"-->
      <!--            type="textarea"-->
      <!--          />-->
      <!--        </n-form-item>-->
      <template #action>
        <n-button @click="showWithdrawal = false">取消</n-button>
        <n-button
          v-if="formData.status == auditStatusEnum.PENDING"
          type="primary"
          @click="handleAuditSubmit"
          >提交
        </n-button>
      </template>
    </NModal>
  </div>
</template>

<script lang="ts" setup>
import { NButton, NForm, NRadio, NRadioGroup, NSpace } from 'naive-ui';
import { TableColumns } from 'naive-ui/es/data-table/src/interface';
import { h, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import {
  auditWithdrawal,
  fetchWithdrawalRecordsDetails,
  fetchWithdrawalRecordsList,
} from '@/api/wallet.ts'; // 假设存在审核接口
import HSearch from '@/components/Base/Search';
import { usePage } from '@/hooks/use-page';
import {
  auditStatusEnum,
  bankTypeEnum,
  IWithdrawalRecord,
} from '@/interface.ts';
import { useUserStore } from '@/store/user';

import { columnsConfig } from './config/columns.config';
import { searchFormConfig } from './config/search.config';

const { t } = useI18n();

const showWithdrawal = ref(false);
const auditFormRef = ref<InstanceType<typeof NForm>>();
const auditForm = ref<any>({
  status: null,
  remark: '',
});

// 表单验证规则
const formRules: any = {
  status: {
    required: true,
    message: '请选择审核状态',
  },
};

// 提交审核结果
async function handleAuditSubmit() {
  if (!auditFormRef.value) return;

  try {
    await auditFormRef.value.validate();

    const res = await auditWithdrawal({
      id: formData.value.id,
      user_id: formData.value.bankCard.user_id,
      status: auditForm.value.status,
      remark: auditForm.value.remark,
    });

    if (res.code === 200) {
      showWithdrawal.value = false;
      window.$message.success('审核提交成功');
      await handlePageChange(pagination.page);
    }
  } catch (err) {
    // 表单验证失败时，错误信息会自动显示，这里可以添加额外的错误处理
    console.log('表单验证失败', err);
  }
}

interface ISearch {
  orderName: string;
  orderBy: string;
}

const userStore = useUserStore();

const tableListData = ref([]);
const total = ref(0);
const pagination = usePage();
const tableListLoading = ref(false);
const formData = ref<any>();
const params = ref<ISearch>({
  orderName: 'id',
  orderBy: 'desc',
});
const searchForm = ref(searchFormConfig(t));

const createColumns = (): TableColumns<IWithdrawalRecord> => {
  const action: TableColumns<IWithdrawalRecord> = [
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
                () => (row.status == auditStatusEnum.PENDING ? '审核' : '查看')
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
    const res = await fetchWithdrawalRecordsList(args);
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

const handleSearch = (v) => {
  params.value = {
    ...params.value,
    ...v,
    nowPage: 1,
    pageSize: pagination.pageSize,
  };
  handlePageChange(1);
};

async function find(id) {
  if (id) {
    const res = await fetchWithdrawalRecordsDetails(id);
    if (res.code === 200) {
      formData.value = {
        ...res.data,
      };
      // 重置审核表单
      auditForm.value = {
        status: null,
        remark: '',
      };
      if (formData.value.status != auditStatusEnum.PENDING) {
        auditForm.value.status = formData.value.status;
      }
      showWithdrawal.value = true;
    }
  }
}
</script>

<style lang="scss" scoped>
.text-center {
  text-align: center;
}
</style>
