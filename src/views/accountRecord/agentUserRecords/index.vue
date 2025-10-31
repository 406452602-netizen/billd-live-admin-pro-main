<template>
  <div>
    <HSearch
      :search-form-config="searchForm"
      :init-value="params"
      @click-search="handleSearch"
    >
      <template #left>
        <n-breadcrumb>
          <n-breadcrumb-item
            @click="handleBreadcrumbClick(userStore.userInfo?.id, -1)"
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
  </div>
</template>

<script lang="ts" setup>
import { TableColumns } from 'naive-ui/es/data-table/src/interface';
import { onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

import { fetchGameConsumptionRecordList } from '@/api/gameConsumptionRecord';
import HSearch from '@/components/Base/Search';
import { usePage } from '@/hooks/use-page';
import { IList } from '@/interface';
import router from '@/router';
import { useUserStore } from '@/store/user';

import { columnsConfig } from './config/columns.config';
import { searchFormConfig } from './config/search.config';

const { t } = useI18n();
const route = useRoute();
const userStore = useUserStore();

interface ISearch extends IList<any> {
  userId?: number;
  userName?: string;
  startTime?: string;
  endTime?: string;
}

const tableListData = ref([]);
const total = ref(0);
const pagination = usePage();
const tableListLoading = ref(false);
const params = ref<ISearch>({
  orderName: 'created_at',
  orderBy: 'desc',
});
const breadcrumbList = ref<any>([]);

const columns = ref<TableColumns<any>>(columnsConfig(t));
const searchForm = ref(searchFormConfig(t));

const scrollX = ref(0);
columns.value.forEach((item) => {
  if (item.width) {
    scrollX.value += Number(item.width);
  }
});

/**
 * 处理面包屑点击事件
 * @param item 点击的面包屑项（用户ID）
 * @param index 点击的面包屑索引
 */
const handleBreadcrumbClick = (item, index: number) => {
  // 如果点击的是最后一个面包屑，不执行任何操作
  if (index === breadcrumbList.value.length - 1) {
    return;
  }

  // 截取数组，保留点击元素及其之前的部分
  breadcrumbList.value = breadcrumbList.value.slice(0, index + 1);

  // 跳转回上一级页面，携带面包屑信息
  router.push({
    path: '/accountRecord/payouts',
    query: {
      userId: item,
      isRoot: index === -1 ? 1 : 0,
      breadcrumbList: breadcrumbList.value,
    },
  });
};

onMounted(() => {
  // 处理路由参数中的面包屑信息
  const routeParams = route.query;
  if (routeParams.userId) {
    params.value.userId = Number(routeParams.userId);
    breadcrumbList.value = routeParams.breadcrumbList || [];
    breadcrumbList.value.push(routeParams.userId);
  }
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
    const res: any = await fetchGameConsumptionRecordList(args);
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
</script>

<style lang="scss" scoped></style>
