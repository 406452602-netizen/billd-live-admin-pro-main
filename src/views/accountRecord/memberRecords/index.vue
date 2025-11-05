<template>
  <div>
    <HSearch
      :search-form-config="searchForm"
      :init-value="params"
      :hide-add-btn="true"
      @click-search="handleSearch"
    >
      <template #left>
        <n-breadcrumb>
          <n-breadcrumb-item
            @click="handleBreadcrumbClick(getRootUserId, -1)"
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
      :key="tableKey"
      remote
      :scroll-x="scrollX"
      :loading="tableListLoading"
      :columns="columns"
      :data="tableListData"
      :pagination="pagination"
      :bordered="false"
      @update:page="handlePageChange"
    />

    <!-- 用户统计信息弹框 -->
    <UserStatisticsModal
      v-model:show="showUserStatsModal"
      :user-id="selectedUserId"
      :breadcrumb-list="breadcrumbList"
    />
  </div>
</template>

<script lang="ts" setup>
import { TableColumns } from 'naive-ui/es/data-table/src/interface';
import { computed, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

import { fetchUserStatisticsBatch } from '@/api/user';
import HSearch from '@/components/Base/Search';
import { usePage } from '@/hooks/use-page';
import { IList } from '@/interface';
import { useUserStore } from '@/store/user';

import UserStatisticsModal from '../payouts/components/statistics.vue';

import { columnsConfig } from './config/columns.config';
import { searchFormConfig } from './config/search.config';

const { t } = useI18n();

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

// 定义面包屑导航数据
const breadcrumbList = ref<any>([]);
const agentId = ref<any>(null);

interface ISearch extends IList<any> {
  user_id?: number;
  parent_user_id?: number;
  start_time?: string;
  end_time?: string;
}

// 定义组件的响应式数据
const tableListData = ref([]);
const total = ref(0);
const pagination = usePage();
const tableListLoading = ref(false);

const params = ref<ISearch>({
  orderName: 'created_at',
  orderBy: 'desc',
});

const getRootUserId = computed(() => {
  return userStore.userInfo?.is_admin ? 1 : userStore.userInfo?.id;
});

// 用户统计信息弹框相关
const showUserStatsModal = ref(false);
const selectedUserId = ref(null);

// 处理面包屑项点击事件
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

// 用户ID点击处理
const userIdClick = (info) => {
  // 显示统计信息弹框
  showUserStatsModal.value = false;
  setTimeout(() => {
    selectedUserId.value = info.id;
    showUserStatsModal.value = true;
  }, 0);
};

// 直接定义和初始化columns，不使用createColumns函数，避免引用问题
const columns = ref<TableColumns<any>>([...columnsConfig(t, userIdClick)]);
const searchForm = ref(searchFormConfig(t));

// 初始化滚动宽度
const scrollX = ref(0);
columns.value.forEach((item) => {
  if (item.width) {
    scrollX.value += Number(item.width);
  }
});

// 初始打印，确认列数
console.log('Initial columns.length:', columns.value.length);

onMounted(() => {
  // 从路由参数中获取代理商ID和面包屑信息
  const routeParams = route.query;
  if (routeParams.agentId) {
    agentId.value = routeParams.agentId;
    params.value.parent_user_id = Number(routeParams.agentId);
  }
  if (routeParams.breadcrumbList) {
    // 解析JSON字符串为数组
    breadcrumbList.value = JSON.parse(routeParams.breadcrumbList as string);
    breadcrumbList.value.push(agentId.value);
  }
  handlePageChange(1);
});

watch(
  () => pagination.pageSize,
  () => {
    handlePageChange(1);
  }
);

// 定义动态列相关数据
const dynamicCols = ref<string[]>([]);

// 获取数据列表
async function ajaxFetchList(args) {
  try {
    tableListLoading.value = true;
    const res: any = await fetchUserStatisticsBatch(args);
    if (res.code === 200) {
      tableListLoading.value = false;
      tableListData.value = res.data.rows;
      total.value = res.data.total;
      pagination.page = args.nowPage;
      pagination.itemCount = res.data.total;
      pagination.pageSize = args.pageSize;

      // 处理动态列 - 确保正确获取cols数据
      console.log('res.data.cols:', res.data.cols);
      // 确保正确解析cols数据
      dynamicCols.value = res.data && res.data.cols ? res.data.cols : [];
      console.log('dynamicCols.value after assignment:', dynamicCols.value);

      // 强制触发更新
      updateColumns();
    } else {
      Promise.reject(res);
    }
  } catch (err) {
    Promise.reject(err);
  }
}

// 用于触发强制重新渲染的key
const tableKey = ref(0);

// 更新表格列配置
function updateColumns() {
  console.log('updateColumns called, dynamicCols.value:', dynamicCols.value);

  // 重新创建基础列配置，避免引用问题
  const baseColumns: any = [...columnsConfig(t, userIdClick)];
  console.log('baseColumns initial length:', baseColumns.length);

  // 为每个动态列添加总流水和总盈亏两列
  if (dynamicCols.value && dynamicCols.value.length > 0) {
    console.log('Processing', dynamicCols.value.length, 'dynamic columns');
    dynamicCols.value.forEach((colName) => {
      console.log('Adding dynamic column:', colName);
      // 创建新的列对象，避免引用问题
      const totalFlowColumn = {
        title: `${colName}总流水`,
        key: `${colName}_total_flow`,
        align: 'center',
        width: 120,
        render(row) {
          return row.game?.[colName]?.total_flow || 0;
        },
      };

      const totalProfitColumn = {
        title: `${colName}总盈亏`,
        key: `${colName}_total_profit`,
        align: 'center',
        width: 120,
        render(row) {
          return row.game?.[colName]?.total_profit == null
            ? 0
            : Number(row.game?.[colName]?.total_profit) -
                Number(row.game?.[colName]?.total_flow);
        },
      };

      // 使用push方法添加列
      baseColumns.push(totalFlowColumn);
      baseColumns.push(totalProfitColumn);
    });
  } else {
    console.log('No dynamic columns to add');
  }

  // 计算滚动宽度
  scrollX.value = 0;
  baseColumns.forEach((item) => {
    if (item.width) {
      scrollX.value += Number(item.width);
    }
  });

  // 先更新列配置
  console.log(
    'baseColumns final length after adding dynamic cols:',
    baseColumns.length
  );

  // 使用全新的数组对象替换columns.value
  columns.value = [...baseColumns];
  console.log(
    'columns.value assigned, columns.value.length:',
    columns.value.length
  );

  // 强制触发表格重新渲染
  tableKey.value += 1;
  console.log('tableKey updated to:', tableKey.value);
  console.log('Final columns.value:', columns.value);
}

// 处理分页变化
async function handlePageChange(currentPage) {
  await ajaxFetchList({
    ...params.value,
    pageSize: pagination.pageSize,
    nowPage: currentPage,
  });
}

// 处理搜索
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
</script>

<style lang="scss" scoped></style>
