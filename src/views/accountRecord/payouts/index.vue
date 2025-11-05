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
    <NModal v-model:show="showModal">
      <n-card
        style="width: 600px"
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
import { useRoute } from 'vue-router';

import { fetchQuizPayoutsStatistics } from '@/api/quiz';
import HForm from '@/components/Base/Form';
import HSearch from '@/components/Base/Search';
import { usePage } from '@/hooks/use-page';
import { IList, IQuizMatchTypes, IQuizPayoutsStatistics } from '@/interface';
import router from '@/router';
import { useUserStore } from '@/store/user';

import UserStatisticsModal from './components/statistics.vue';
import { columnsConfig } from './config/columns.config';
import { formConfig } from './config/form.config';
import { searchFormConfig } from './config/search.config';

const { t } = useI18n();

const breadcrumbList = ref<any>([]);

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
const route = useRoute();

// 处理面包屑项点击事件
const handleBreadcrumbClick = (item, index: number) => {
  if (index === -1) {
    params.value.parent_user_id = undefined;
    params.value.user_id = item;
  } else {
    params.value.parent_user_id = item;
    params.value.user_id = undefined;
  }

  handlePageChange(1);
  // 截取数组，保留点击元素及其之前的部分
  breadcrumbList.value = breadcrumbList.value.slice(0, index + 1);
};

// 定义组件的响应式数据
const formData = ref({ ...props.modelValue });
// 定义新增/编辑的表单引用
const confirmLoading = ref(false);
const hFormRef = ref();

const tableListData = ref([]);
const total = ref(0);
const pagination = usePage();
const tableListLoading = ref(false);
const formConfigRes = ref();
const userStore = useUserStore();

const params = ref<ISearch>({
  orderName: 'created_at',
  orderBy: 'desc',
  user_id: userStore.userInfo?.id,
});

// 保存原始参数，用于在没有数据时恢复
const originalParams = ref({ ...params.value });
const originalBreadcrumbList = ref([...breadcrumbList.value]);

const showModal = ref(false);
// 用户统计信息弹框相关
const showUserStatsModal = ref(false);
const selectedUserId = ref(null);

const getRootUserId = computed(() => {
  return userStore.userInfo?.is_admin ? 1 : userStore.userInfo?.id;
});
const userIdClick = (info) => {
  if (info.is_agent) {
    // 保存原始参数，用于在没有数据时恢复
    originalParams.value = { ...params.value };
    originalBreadcrumbList.value = [...breadcrumbList.value];

    // 先修改参数，但不立即更新面包屑
    params.value.parent_user_id = info.user_id;
    params.value.user_id = undefined;

    // 调用特别的方法来处理这种情况
    handleUserIdClick(info.user_id);
  } else {
    // 对于会员用户，显示统计信息弹框
    // 先重置弹框状态，确保每次点击都能正确打开
    showUserStatsModal.value = false;
    // 使用nextTick确保DOM更新后再打开弹框
    setTimeout(() => {
      selectedUserId.value = info.user_id;
      showUserStatsModal.value = true;
    }, 0);
  }
};

// 特别处理用户ID点击的方法
async function handleUserIdClick(userId) {
  try {
    tableListLoading.value = true;
    const res: any = await fetchQuizPayoutsStatistics({
      ...params.value,
      pageSize: pagination.pageSize,
      nowPage: 1,
    });

    tableListLoading.value = false;

    if (res.code === 200) {
      // 检查是否有数据
      if (res.data.rows.length === 0) {
        // 没有找到下级用户，显示提示，恢复原始参数
        window.$message.warning('没有找到该用户的下级信息');
        params.value = { ...originalParams.value };
        return;
      }

      // 有数据时才更新面包屑和表格数据
      breadcrumbList.value.push(userId);
      tableListData.value = res.data.rows;
      total.value = res.data.total;
      pagination.page = 1;
      pagination.itemCount = res.data.total;
    } else {
      // 请求失败时恢复参数
      params.value = { ...originalParams.value };
      Promise.reject(res);
    }
  } catch (err) {
    // 异常时恢复参数
    params.value = { ...originalParams.value };
    Promise.reject(err);
  }
}

const memberIdClick = (info) => {
  // 跳转到会员数据页面
  router.push({
    path: '/accountRecord/memberRecords',
    query: {
      agentId: info.user_id,
      breadcrumbList: JSON.stringify(breadcrumbList.value),
    },
  });
};

const createColumns = (): TableColumns<IQuizPayoutsStatistics> => {
  return [...columnsConfig(t, userIdClick, memberIdClick)];
};

const columns = createColumns();
const searchForm = ref(searchFormConfig(t, userIdClick, memberIdClick));

const scrollX = ref(0);
columns.forEach((item) => {
  if (item.width) {
    scrollX.value += Number(item.width);
  }
});

onMounted(async () => {
  if (route.query.breadcrumbList) {
    // 处理面包屑列表
    breadcrumbList.value =
      typeof route.query.breadcrumbList === 'string'
        ? JSON.parse(route.query.breadcrumbList)
        : route.query.breadcrumbList;

    // 处理用户ID参数
    if (route.query.isRoot === '1') {
      params.value.user_id = route.query.userId;
      params.value.parent_user_id = null;
    } else {
      params.value.parent_user_id = route.query.userId;
      params.value.user_id = null;
    }

    // 处理时间范围参数：如果存在rangTimeStart和rangTimeEnd，则转换为rangTimeType数组
    if (route.query.rangTimeStart && route.query.rangTimeEnd) {
      params.value.rangTimeType = [
        route.query.rangTimeStart,
        route.query.rangTimeEnd,
      ];
      // 删除不再需要的单独时间参数
      delete route.query.rangTimeStart;
      delete route.query.rangTimeEnd;
    }
  } else {
    // 没有面包屑参数时，设置默认时间范围：当前时间和一周前
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7); // 一周前

    // 格式化日期为YYYY-MM-DD格式
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    // 直接设置rangTimeType为时间范围数组，与HSearch组件期望格式一致
    params.value.rangTimeType = [formatDate(startDate), formatDate(endDate)];
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
    // 准备请求参数，处理时间范围格式
    const requestParams = {
      ...args,
    };

    // 如果存在rangTimeType数组，将其转换为后端API期望的格式
    // if (Array.isArray(requestParams.rangTimeType)) {
    //   requestParams.rangTimeStart = requestParams.rangTimeType[0];
    //   requestParams.rangTimeEnd = requestParams.rangTimeType[1];
    //   requestParams.rangTimeType = 'created_at'; // 设置为created_at表示按创建时间筛选
    // }

    if (route.query.rangTimeStart && route.query.rangTimeEnd) {
      params.value.rangTimeType = [
        route.query.rangTimeStart,
        route.query.rangTimeEnd,
      ];
      // 删除不再需要的单独时间参数
      delete route.query.rangTimeStart;
      delete route.query.rangTimeEnd;
    }

    const res: any = await fetchQuizPayoutsStatistics(requestParams);
    if (res.code === 200) {
      tableListLoading.value = false;

      // 对于普通的分页请求，直接更新数据
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

function handleAdd() {
  console.log('添加');
  showModal.value = true;
}

const handleConfirm = (v: IQuizMatchTypes) => {
  console.log('提交', v);
};
</script>

<style lang="scss" scoped></style>
