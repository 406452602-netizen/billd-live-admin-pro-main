<template>
  <div>
    <HSearch
      :search-form-config="searchForm"
      :init-value="params"
      :hide-add-btn="false"
      @click-search="handleSearch"
      @click-add="handleAdd"
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
      title="提现审核"
      preset="dialog"
    >
      <HForm
        ref="hFormRef"
        v-bind="formConfigRes"
        v-model="formData"
        :show-action="true"
        :confirm-loading="confirmLoading"
        @update:filed="handleUpdateFiled"
        @click:confirm="handleConfirm"
      ></HForm>
    </NModal>
  </div>
</template>

<script lang="ts" setup>
import { NButton, NSpace, NForm } from 'naive-ui';
import { TableColumns } from 'naive-ui/es/data-table/src/interface';
import { onMounted, ref, watch, h } from 'vue';
import { useI18n } from 'vue-i18n';

import {
  getBankCards,
  getBankCardDetails,
  createUserBankCard,
  updateUserBankCard,
  deleteUserBankCard,
  getBanks,
  getUseRechargeTarget,
  setUseRechargeTarget,
} from '@/api/wallet.ts'; // 假设存在审核接口
import HForm from '@/components/Base/Form';
import HSearch from '@/components/Base/Search';
import { usePage } from '@/hooks/use-page';
import { bankTypeEnum, IList, IUserBankCard } from '@/interface.ts';
import { useUserStore } from '@/store/user';

import { columnsConfig } from './config/columns.config';
import { formConfig } from './config/form.config';
import { searchFormConfig } from './config/search.config';

interface ISearch extends IUserBankCard, IList<any> {}

const { t } = useI18n();

const showModal = ref(false);
const hFormRef = ref<InstanceType<typeof NForm>>();

const userStore = useUserStore();
const userTargetBank = ref<any>();

const tableListData = ref([]);
const total = ref(0);
const pagination = usePage();
const tableListLoading = ref(false);
const formData = ref<any>();

const searchForm = ref(searchFormConfig(t));
const params = ref<ISearch>({
  orderName: 'id',
  orderBy: 'desc',
});

const confirmLoading = ref(false);
const formConfigRes = ref();

const createColumns = (): TableColumns<IUserBankCard> => {
  const action: TableColumns<IUserBankCard> = [
    {
      title: '程序充值银行卡',
      key: 'isProgramRecharge',
      width: 150,
      align: 'center',
      render(row) {
        return userTargetBank.value && userTargetBank.value.id === row.id
          ? '是'
          : '否';
      },
    },
    {
      title: '操作',
      key: 'actions',
      width: 200,
      align: 'center',
      fixed: 'right',
      render(row) {
        if (userStore.userInfo?.id === 1) {
          if (userTargetBank.value && userTargetBank.value.id === row.id) {
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
                  () => '修改'
                ),
                h(
                  NButton,
                  {
                    size: 'small',
                    type: 'primary',
                    onClick: () => {
                      deleteCard(row.id);
                    },
                  },
                  () => '删除'
                ),
              ]
            );
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
                    type: 'error',
                    onClick: () => {
                      userCard(row.id);
                    },
                  },
                  () => '设置程序充值银行卡'
                ),
                h(
                  NButton,
                  {
                    size: 'small',
                    type: 'primary',
                    onClick: () => {
                      find(row.id);
                    },
                  },
                  () => '修改'
                ),
                h(
                  NButton,
                  {
                    size: 'small',
                    type: 'primary',
                    onClick: () => {
                      deleteCard(row.id);
                    },
                  },
                  () => '删除'
                ),
              ]
            );
          }
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
const bankList = ref<any>();
const virtualList = ref<any>();
columns.forEach((item) => {
  if (item.width) {
    scrollX.value += Number(item.width);
  }
});
onMounted(async () => {
  getBanks({
    nowPage: 1,
    type: bankTypeEnum.BANK,
    pageSize: 1000,
    orderBy: 'desc',
    orderName: 'id',
  }).then((response) => {
    if (response.code === 200) {
      const info = response.data.rows;
      for (let i = 0; i < info.length; i += 1) {
        info[i].label = info[i].bank_name;
        info[i].value = info[i].id;
      }
      bankList.value = info;
    }
  });
  getBanks({
    nowPage: 1,
    type: bankTypeEnum.VIRTUAL,
    pageSize: 1000,
    orderBy: 'desc',
    orderName: 'id',
  }).then((response) => {
    if (response.code === 200) {
      const info = response.data.rows;
      for (let i = 0; i < info.length; i += 1) {
        info[i].label = info[i].bank_name;
        info[i].value = info[i].id;
      }
      virtualList.value = info;
    }
  });
  getUseRechargeTarget().then((response) => {
    if (response.code === 200) {
      userTargetBank.value = response.data;
    }
  });
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
    const res = await getBankCards({
      ...args,
      user_id: userStore.userInfo?.id,
    });
    if (res.code === 200) {
      tableListLoading.value = false;
      tableListData.value = res.data.rows;
      total.value = res.data.total;
      pagination.page = args.nowPage;
      pagination.itemCount = res.data.total;
      pagination.pageSize = args.pageSize;
    }
  } catch (err) {
    console.error(err);
  }
}

function userCard(id) {
  setUseRechargeTarget(id).then((response) => {
    if (response.code === 200) {
      window.$message.success('设置软件充值银行卡成功');
      getUseRechargeTarget().then((response) => {
        if (response.code === 200) {
          userTargetBank.value = response.data;
        }
      });
      handlePageChange(1);
    }
  });
}

function handleAdd() {
  showModal.value = true;
  formData.value = {
    bank_type: bankTypeEnum.BANK,
  };
  formConfigRes.value = formConfig(bankList.value, []);
}

async function deleteCard(id) {
  try {
    const res = await deleteUserBankCard(id);
    if (res.code === 200) {
      window.$message.success('删除成功');
      handlePageChange(1);
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
    const res = await getBankCardDetails(id);
    if (res.code === 200) {
      formData.value = res.data;
      console.log(res.data);

      formData.value.bank_type = formData.value.bank.type;
      switchBankType(formData.value.bank_type);
      showModal.value = true;
      // formConfigRes.value = formConfig(bankList.value, []);
    }
  }
}

function handleConfirm(v: IUserBankCard) {
  confirmLoading.value = true;
  if (v.id) {
    updateUserBankCard(v).then((res) => {
      if (res.code === 200) {
        showModal.value = false;
        confirmLoading.value = false;
        handlePageChange(1);
        window.$message.success('修改成功');
      }
    });
  } else {
    createUserBankCard(v).then((res) => {
      if (res.code === 200) {
        showModal.value = false;
        confirmLoading.value = false;
        handlePageChange(1);
        window.$message.success('添加成功');
      }
    });
  }
}

// 提交审核结果
function handleUpdateFiled(key, value) {
  if (key === 'bank_type') {
    switchBankType(value);
  }
  if (key === 'bank_id') {
    const protocolType: { label: any; value: any }[] = [];
    if (formData.value.bank_type === bankTypeEnum.BANK) {
      for (let i = 0; i < bankList.value.length; i += 1) {
        if (bankList.value[i].id === value) {
          protocolType.push({
            label: bankList.value[i].label,
            value: bankList.value[i].value,
          });
          break;
        }
      }
      formConfigRes.value = formConfig(bankList.value, protocolType);
    } else {
      for (let i = 0; i < virtualList.value.length; i += 1) {
        if (virtualList.value[i].id === value) {
          protocolType.push({
            label: virtualList.value[i].label,
            value: virtualList.value[i].value,
          });
          break;
        }
      }
      formConfigRes.value = formConfig(virtualList, protocolType);
      formData.value.card_number = null;
    }
  }
  confirmLoading.value = true;
}

function switchBankType(value) {
  formData.value.protocol_type = null;
  if (value === bankTypeEnum.BANK) {
    formConfigRes.value = formConfig(bankList.value, []);
  } else if (value === bankTypeEnum.VIRTUAL) {
    formConfigRes.value = formConfig(virtualList.value, []);
  }
}
</script>

<style lang="scss" scoped>
.text-center {
  text-align: center;
}
</style>
