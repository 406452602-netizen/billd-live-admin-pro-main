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
  </div>
</template>

<script lang="ts" setup>
import { NButton, NSpace } from 'naive-ui';
import { TableColumns } from 'naive-ui/es/data-table/src/interface';
import { h, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import { fetchBlacklistList } from '@/api/blacklist';
import HSearch from '@/components/Base/Search';
import { usePage } from '@/hooks/use-page';
import { IBlacklist, IList } from '@/interface';
import router from '@/router';

import { columnsConfig } from './config/columns.config';
import { searchFormConfig } from './config/search.config';

const { t } = useI18n();

interface ISearch extends IBlacklist, IList<any> {}

const tableListData = ref([]);
const total = ref(0);
const pagination = usePage();
const tableListLoading = ref(false);
const params = ref<ISearch>({
  orderName: 'id',
  orderBy: 'desc',
});

const createColumns = (): TableColumns<IBlacklist> => {
  const action: TableColumns<IBlacklist> = [
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
                  router.push({
                    name: 'blacklistUpdate',
                    query: { id: row.id },
                  });
                },
              },
              () => '编辑' // 用箭头函数返回性能更好。
            ),
          ]
        );
      },
    },
  ];
  return [...columnsConfig(t), ...action];
};

const columns = createColumns();
const searchForm = ref(searchFormConfig(t));

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
    const res: any = await fetchBlacklistList(args);
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
