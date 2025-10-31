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
    <HModal
      v-model:show="modalVisiable"
      :show-config="false"
      @cancel="modalVisiable = false"
    >
      <div class="obs-item">
        <div class="obs-ipt-wrap">
          <div>邀请码地址：</div>
          <n-space class="ipt">
            <n-input
              :value="urlPath"
              class="val disabled"
              type="text"
              disabled
            />
            <n-button @click="handleCopy(urlPath)">
              <n-icon
                :component="Copy"
                class="copy"
              >
              </n-icon>
              复制
            </n-button>
          </n-space>
          <n-descriptions
            bordered
            :column="2"
            label-placement="left"
            title="邀请码信息"
          >
            <n-descriptions-item label="邀请用户名">
              {{ describeInDetail.source_user.username }}
            </n-descriptions-item>
            <n-descriptions-item label="邀请用户id">
              {{ describeInDetail.source_user.id }}
            </n-descriptions-item>
            <n-descriptions-item label="受邀用户名">
              {{
                describeInDetail.to_user
                  ? describeInDetail.to_user.username
                  : '未受邀'
              }}
            </n-descriptions-item>
            <n-descriptions-item label="受邀用户id">
              {{
                describeInDetail.to_user
                  ? describeInDetail.to_user.id
                  : '未受邀'
              }}
            </n-descriptions-item>
            <n-descriptions-item label="邀请码类型">
              {{ describeInDetail.invite_class }}
            </n-descriptions-item>
            <n-descriptions-item label="邀请码">
              {{ describeInDetail.invite_code }}
            </n-descriptions-item>
          </n-descriptions>
        </div>
      </div>
    </HModal>
    <createInvite
      ref="createInviteRef"
      @refresh="handlePageChange(1)"
    ></createInvite>
  </div>
</template>

<script lang="ts" setup>
import { Copy } from '@vicons/ionicons5';
import { copyToClipBoard } from 'billd-utils';
import { NButton, NSpace } from 'naive-ui';
import { TableColumns } from 'naive-ui/es/data-table/src/interface';
import { h, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import {
  fetchInviteAgentById,
  fetchInviteAgentList,
} from '@/api/inviteAgent.ts';
import HModal from '@/components/Base/Modal';
import HSearch from '@/components/Base/Search';
import { InviteAgentMap } from '@/constant.ts';
import { usePage } from '@/hooks/use-page';
import { IInviteAgent, IList, InviteAgent, IUser } from '@/interface';
import { INVITE_CODE_URL } from '@/spec-config.ts';

import { columnsConfig } from './config/columns.config';
import { searchFormConfig } from './config/search.config';
import createInvite from './createInvite/index.vue';

const urlPath = ref('');
const describeInDetail = ref({
  source_user: {
    username: '',
    id: '',
  },
  to_user: {
    username: '',
    id: '',
  },
  invite_class: '',
  invite_code: '',
});
const createInviteRef = ref<InstanceType<typeof createInvite>>();

const { t } = useI18n();

interface ISearch extends IUser, IList<any> {}

const tableListData = ref([]);
const total = ref(0);
const pagination = usePage();

const modalVisiable = ref(false);
const tableListLoading = ref(false);
const params = ref<ISearch>({
  orderName: 'created_at',
  orderBy: 'desc',
  is_valid: true,
});

function handleCopy(url: string | number | any) {
  copyToClipBoard(`${url}`);
  window.$message.success('复制成功！');
}

const createColumns = (): TableColumns<IInviteAgent> => {
  const action: TableColumns<IInviteAgent> = [
    {
      title: '操作',
      key: 'actions',
      width: 200,
      fixed: 'right',
      align: 'center',
      render(row) {
        return h(NSpace, { justify: 'center' }, () => [
          h(
            NButton,
            {
              size: 'small',
              onClick: () => {
                modalVisiable.value = true;
                fetchInviteAgentById(row.invite_code).then((res) => {
                  if (res.code == 200) {
                    if (res.data.invite_class == InviteAgent.member) {
                      // TODO:INVITE_CODE_URL需要手动修改跳转会员的路由
                      urlPath.value = `${INVITE_CODE_URL}/login?invite_code=${row.invite_code}`;
                    } else {
                      urlPath.value = `${window.location.origin}/login?invite_code=${row.invite_code}`;
                    }
                    res.data.invite_class =
                      InviteAgentMap[res.data.invite_class];
                    describeInDetail.value = res.data;

                    console.log('describeInDetail', describeInDetail.value);
                  }
                });
              },
            },
            () => '详细信息' // 用箭头函数返回性能更好。
          ),
        ]);
      },
    },
  ];
  return [...columnsConfig(t), ...action];
};
const searchForm = ref(searchFormConfig(t));

const columns = createColumns();
const scrollX = ref(0);
columns.forEach((item) => {
  if (item.width) {
    scrollX.value += Number(item.width);
  }
});

onMounted(() => {
  handlePageChange(1);
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
    const res: any = await fetchInviteAgentList(args);
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
    rangTimeType: v.rangTimeType ? 'created_at' : undefined,
    rangTimeStart: v.rangTimeType ? v.rangTimeType[0] : undefined,
    rangTimeEnd: v.rangTimeType ? v.rangTimeType[1] : undefined,
  };
  handlePageChange(1);
};

const handleAdd = () => {
  createInviteRef.value?.initFormData();
};
</script>

<style lang="scss" scoped></style>
