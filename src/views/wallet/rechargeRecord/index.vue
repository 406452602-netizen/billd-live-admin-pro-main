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
      v-model:show="showModel"
      style="width: 600px"
      title="充值审核"
      preset="dialog"
    >
      <n-form
        ref="auditFormRef"
        :model="auditForm"
        :rules="formRules"
      >
        <n-descriptions
          label-placement="left"
          title="描述"
          :column="2"
          size="small"
        >
          <n-descriptions-item label="充值金额"
            >{{ formData?.amount }}
          </n-descriptions-item>
          <n-descriptions-item label="提交时间"
            >{{ formData?.created_at }}
          </n-descriptions-item>
          <n-descriptions-item label="收款人">
            {{ userTargetBank.holder_name }}
          </n-descriptions-item>
          <n-descriptions-item label="收款人银行">
            {{ userTargetBank.card_number }}({{
              userTargetBank.bank.bank_name
            }})
          </n-descriptions-item>
          <n-descriptions-item
            v-if="formData.voucher"
            label="凭证"
          >
            <n-image
              v-for="(item, index) in formData.voucher"
              :key="index"
              object-fit="fill"
              width="100"
              :src="url + item"
            ></n-image>
          </n-descriptions-item>
          <n-descriptions-item
            v-if="formData.voucher"
            label="凭证提交时间"
            >{{ formData.voucher_at }}
          </n-descriptions-item>
          <n-descriptions-item label="是否为管理员调整"
            >{{ formData?.is_admin_change ? '是' : '否' }}
          </n-descriptions-item>
          <n-descriptions-item
            v-if="auditStatusEnum.PENDING != formData.status"
            label="审核用户账号"
            >{{ formData?.user.username }}
          </n-descriptions-item>
          <n-descriptions-item
            v-if="auditStatusEnum.PENDING != formData.status"
            label="审核时间"
            >{{ formData?.reviewed_at }}
          </n-descriptions-item>
          <n-descriptions-item
            v-if="auditStatusEnum.PENDING != formData.status"
            label="备注"
            >{{ formData?.remark }}
          </n-descriptions-item>
        </n-descriptions>

        <n-form-item
          label="审核状态"
          path="status"
        >
          <n-radio-group
            v-model:value="auditForm.status"
            :default-value="true"
            :disabled="auditStatusEnum.PENDING != formData.status"
          >
            <n-radio :value="auditStatusEnum.APPROVED">通过</n-radio>
            <n-radio :value="auditStatusEnum.REJECTED">拒绝</n-radio>
          </n-radio-group>
        </n-form-item>
        <!--        <n-form-item label="审核备注">-->
        <!--          <n-input-->
        <!--            v-model:value="auditForm.remark"-->
        <!--            type="textarea"-->
        <!--          />-->
        <!--        </n-form-item>-->
      </n-form>
      <template #action>
        <n-button
          v-if="formData.status == auditStatusEnum.PENDING"
          @click="handleAuditSubmit"
          >提交
        </n-button>
        <n-button
          v-else
          @click="showModel = false"
          >取消
        </n-button>
      </template>
    </NModal>
  </div>
</template>

<script lang="ts" setup>
import { NButton, NForm, NRadio, NRadioGroup, NSpace } from 'naive-ui'; // 需创建对应配置文件
import { TableColumns } from 'naive-ui/es/data-table/src/interface';
import { onMounted, ref, watch, h } from 'vue';
import { useI18n } from 'vue-i18n';

import {
  auditRecharge,
  fetchRechargeRecordsDetails,
  fetchRechargeRecordsList,
  getUseRechargeTarget,
} from '@/api/wallet.ts';
import HSearch from '@/components/Base/Search';
import { usePage } from '@/hooks/use-page';
import { auditStatusEnum, IRechargeRecord } from '@/interface.ts';
import { useUserStore } from '@/store/user';
import { getBaseUrl } from '@/utils/request.ts';

import { columnsConfig } from './config/columns.config'; // 需创建对应配置文件
import { searchFormConfig } from './config/search.config';

const url = getBaseUrl();

const { t } = useI18n();
const auditForm = ref<any>({
  status: null,
  remark: '',
});

interface ISearch {
  orderName: string;
  orderBy: string;
}

const userStore = useUserStore();
// 定义组件的响应式数据
const tableListData = ref([]);
const total = ref(0);
const pagination = usePage();
const userTargetBank = ref();
const tableListLoading = ref(false);
const params = ref<ISearch>({
  orderName: 'id',
  orderBy: 'desc',
});
const formData = ref<any>();
const showModel = ref(false);
const auditFormRef = ref<InstanceType<typeof NForm>>();
const searchForm = ref(searchFormConfig(t));

const formRules: any = {
  status: {
    required: true,
    message: '请选择审核状态',
  },
};

const createColumns = (): TableColumns<IRechargeRecord> => {
  const action: TableColumns<IRechargeRecord> = [
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
                  type:
                    row.status == auditStatusEnum.PENDING ? 'error' : 'success',
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
  getUseRechargeTarget().then((response) => {
    if (response.code === 200) {
      userTargetBank.value = response.data;
    }
  });
});

watch(
  () => pagination.pageSize,
  () => {
    handlePageChange(1);
  }
);

async function find(id) {
  if (id) {
    const res = await fetchRechargeRecordsDetails(id);
    if (res.code === 200) {
      formData.value = {
        ...res.data,
      };
      // 重置审核表单
      auditForm.value = {
        status: null,
        remark: '',
      };
      if (formData.value.voucher) {
        formData.value.voucher = formData.value.voucher.split(',');
      }
      if (formData.value.status != auditStatusEnum.PENDING) {
        auditForm.value.status = formData.value.status;
      }
      showModel.value = true;
    }
  }
}

async function ajaxFetchList(args) {
  try {
    tableListLoading.value = true;
    const res = await fetchRechargeRecordsList(args);
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

async function handleAuditSubmit() {
  if (!auditFormRef.value) return;
  await auditFormRef.value.validate();
  try {
    const res = await auditRecharge({
      id: formData.value.id,
      user_id: formData.value.user_id,
      status: auditForm.value.status,
      remark: auditForm.value.remark,
    });
    if (res.code === 200) {
      showModel.value = false;
      window.$message.success('审核提交成功');
      await handlePageChange(pagination.page);
    }
  } catch (err) {
    window.$message.error('审核提交失败');
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
</script>

<style lang="scss" scoped>
.text-center {
  text-align: center;
}
</style>
