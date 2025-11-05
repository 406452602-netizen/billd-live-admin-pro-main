<template>
  <div>
    <HSearch
      :search-form-config="searchForm"
      :init-value="params"
      :hide-add-btn="true"
      @click-add="handleAdd"
      @click-search="handleSearch"
    >
      <template #left>
        <n-breadcrumb>
          <n-breadcrumb-item @click="handleBreadcrumbClick(getRootUserId, -1)"
            >旗下账号
          </n-breadcrumb-item>
          <n-breadcrumb-item
            v-for="(item, index) in breadcrumbList"
            :key="index"
            @click="handleBreadcrumbClick(item, index)"
            >{{ item }}
          </n-breadcrumb-item>
        </n-breadcrumb>
      </template>
    </HSearch>
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
    >
      <n-card>
        <n-grid
          :x-gap="12"
          :y-gap="4"
          :cols="3"
        >
          <n-grid-item>
            <n-flex
              vertical
              align="center"
            >
              <img
                width="60"
                height="60"
                :src="url + formData.match.team1.team_logo"
              />
              <div>
                {{ formData.match.team1.team_name }}
                得分：{{ formData.match.team1_goals || 0 }}
              </div>
            </n-flex>
          </n-grid-item>

          <n-grid-item>
            <n-flex
              vertical
              align="center"
            >
              <div style="align-items: center; line-height: 90px">V S</div>
            </n-flex>
          </n-grid-item>
          <n-grid-item>
            <n-flex
              vertical
              align="center"
            >
              <img
                width="60"
                height="60"
                :src="url + formData.match.team2.team_logo"
              />
              <div>
                {{ formData.match.team2.team_name }}
                得分：
                {{ formData.match.team2_goals || 0 }}
              </div>
            </n-flex>
          </n-grid-item>
        </n-grid>
        <n-descriptions
          bordered
          :column="4"
        >
          <n-descriptions-item label="投票用户id">
            {{ formData.user.id }}
          </n-descriptions-item>
          <n-descriptions-item label="投票用户名">
            {{ formData.user.username }}
          </n-descriptions-item>
          <n-descriptions-item label="投票编号">
            {{ formData.vote_id }}
          </n-descriptions-item>
          <n-descriptions-item label="赔率">
            {{ formData.odds }}
          </n-descriptions-item>
          <n-descriptions-item label="下注类型">
            {{ QuizVoteTypeMap[formData.votes_type!] }}
          </n-descriptions-item>
          <n-descriptions-item label="下注时间">
            {{ formData.created_at }}
          </n-descriptions-item>
          <n-descriptions-item label="下注金额">
            {{ formData.vote_amount }}
          </n-descriptions-item>
          <n-descriptions-item label="阈值">
            {{ formData.handicap }}
          </n-descriptions-item>
          <n-descriptions-item label="选择">
            {{ getChoseLabel() }}
          </n-descriptions-item>
          <n-descriptions-item label="结果">
            {{ formData.result_amount }}
          </n-descriptions-item>

          <n-descriptions-item label="投票结果">
            {{ VoteResultMap[formData.prize_winner] }}
          </n-descriptions-item>
        </n-descriptions>
        <!--        {{ formData.payouts ? formData.payouts : '' }}
          :data="formData.payouts"-->
        <n-data-table
          remote
          :data="formData.payouts"
          :loading="tableListLoading"
          :columns="payoutColumns"
        />
      </n-card>
    </NModal>
  </div>
</template>

<script lang="ts" setup>
import { NButton, NSpace } from 'naive-ui';
import { TableColumns } from 'naive-ui/es/data-table/src/interface';
import { computed, h, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

import { getQuizVotesList, fetchQuizVotesById } from '@/api/quiz'; // 假设的 API 函数
import HSearch from '@/components/Base/Search';
import { QuizVoteTypeMap, VoteResultMap } from '@/constant.ts';
import { usePage } from '@/hooks/use-page';
import {
  IQuizMatchTypes,
  IList,
  IQuizVotes,
  IQuizPayouts,
  QuizVoteType,
} from '@/interface';
import router from '@/router';
import { useUserStore } from '@/store/user';
import { getBaseUrl } from '@/utils/request.ts';

import { columnsConfig } from './config/columns.config'; // 需创建对应配置文件
import { formConfig } from './config/form.config';
import { payoutColumnsConfig } from './config/payoutColumns.config';
import { searchFormConfig } from './config/search.config';

const route = useRoute(); // 获取当前路由实例

const { t } = useI18n();

const url = getBaseUrl();

interface ISearch extends IQuizMatchTypes, IList<any> {}

const edit = ref(false);

// 定义组件的响应式数据
const formData = ref();
const pagination = usePage();
const userStore = useUserStore();

const tableListData = ref([]);
const total = ref(0);
const tableListLoading = ref(false);
const formConfigRes = ref();
const breadcrumbList = ref<any>([]);

const params = ref<ISearch>({
  orderName: 'created_at',
  orderBy: 'desc',
  user_id: '',
});

const showModal = ref(false);
const getRootUserId = computed(() => {
  return userStore.userInfo?.is_admin ? 1 : userStore.userInfo?.id;
});

const getChoseLabel = () => {
  switch (formData.value.votes_type) {
    case QuizVoteType.winLoss:
      return formData.value.vote_index === 1 ? '主场胜利' : '客场胜利';
    case QuizVoteType.letBall:
      return formData.value.vote_index === 1 ? '主场胜利' : '客场胜利';
    case QuizVoteType.gameNumber:
      return formData.value.vote_index === 1 ? '大' : '小';
    default:
      return '错误';
  }
};
const createColumns = (): TableColumns<IQuizVotes> => {
  const action: TableColumns<IQuizVotes> = [
    {
      title: '操作',
      key: 'actions',
      width: 200,
      align: 'center',
      fixed: 'right',
      render(row) {
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
                  find(row.vote_id);
                },
              },
              () => '查看' // 用箭头函数返回性能更好。
            ),
          ]
        );
      },
    },
  ];
  return [...columnsConfig(t), ...action];
};
const createPayoutsColumns = (): TableColumns<IQuizPayouts> => {
  return payoutColumnsConfig(t);
};

const columns = createColumns();
const payoutColumns = createPayoutsColumns();
const searchForm = ref(searchFormConfig(t));

const scrollX = ref(0);

const handleBreadcrumbClick = (item, index: number) => {
  // 截取数组，保留点击元素及其之前的部分
  breadcrumbList.value = breadcrumbList.value.slice(0, index + 1);
  router.push({
    path: '/accountRecord/payouts',
    query: {
      userId: item,
      isRoot: index === -1 ? 1 : 0,
      breadcrumbList: breadcrumbList.value,
    },
  });
};

columns.forEach((item) => {
  if (item.width) {
    scrollX.value += Number(item.width);
  }
});
onMounted(async () => {
  const routeParams = route.query;
  console.log('route', route);
  if (routeParams.userId) {
    params.value.user_id = Number(routeParams.userId);
    breadcrumbList.value = routeParams.breadcrumbList;
    breadcrumbList.value.push(routeParams.userId);
  }
  handlePageChange(1);
  formConfigRes.value = await formConfig();
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
    const res: any = await getQuizVotesList(args);
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
    const res = await fetchQuizVotesById(id);
    if (res.code !== 200) return;
    const row = res.data;
    showModal.value = true;
    edit.value = true;
    formData.value = {
      ...row,
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
  console.log('添加');
  showModal.value = true;
}
</script>

<style lang="scss" scoped></style>
