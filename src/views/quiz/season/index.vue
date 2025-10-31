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
          v-model.sync="formData"
          :show-action="showAction"
          :confirm-loading="confirmLoading"
          @update:filed="handleUpdateFiled"
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
  addQuizSeasons,
  editQuizSeasons,
  fetchQuizSeasonsList,
  fetchQuizSeasonsById,
  fetchQuizTeamsList,
} from '@/api/quiz'; // 假设的 API 函数
import HForm from '@/components/Base/Form';
import HSearch from '@/components/Base/Search';
import { usePage } from '@/hooks/use-page';
import { IList, IQuizTeams, IQuizSeasons } from '@/interface';
import { useUserStore } from '@/store/user';

import { columnsConfig } from './config/columns.config'; // 需创建对应配置文件
import { formConfig } from './config/form.config';
import { searchFormConfig } from './config/search.config';

const { t } = useI18n();
const userStore = useUserStore();

interface ISearch extends IQuizSeasons, IList<any> {}

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
  orderName: 'season_id',
  orderBy: 'desc',
});

const edit = ref(false);

const typeOption = ref([]);

const showModal = ref(false);

const searchForm = ref(searchFormConfig(t));
const createColumns = (): TableColumns<IQuizSeasons> => {
  const action: TableColumns<IQuizSeasons> = [
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
                    find(row.season_id);
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
    typeOption.value = res.data.rows.map((v) => {
      return { label: v.type_name, value: v.id };
    });
    if (typeOption.value.length > 0) {
      formData.value.quiz_match_type = res.data.rows[0].id;
    }
    switchType();
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
    const res: any = await fetchQuizSeasonsList(args);
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
    const res = await fetchQuizSeasonsById(id);
    if (res.code !== 200) return;
    const row = res.data;
    let teamLogo: UploadFileInfo[] = [];
    if (row.season_logo) {
      teamLogo = [
        {
          id: row.season_logo as string,
          name: row.season_logo as string,
          url: row.season_logo as string,
          status: 'finished',
          percentage: 100,
        },
      ];
    }
    row.contest_teams = row.contest_teams.split(',').map((v) => {
      return Number(v);
    });
    row.rangTime = [row.start_date, row.end_date];
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
  console.log('添加');
  showModal.value = true;
  edit.value = false;
}

function handleUpdateFiled(v) {
  console.log('更新', v);
  console.log('formData', formData);
  if (v == 'quiz_match_type') {
    switchType();
    formData.value.contest_teams = [];
  }
}

function switchType() {
  fetchQuizTeamsList({ type_id: formData.value.quiz_match_type }).then(
    (res: any) => {
      if (res.code === 200) {
        formConfigRes.value = formConfig({
          quizTypeOption: typeOption.value,
          quizTeamsOption: res.data.rows.map((v) => {
            return { label: v.team_name, value: v.team_id };
          }),
        });
      }
    }
  );
}

function handleCreate(v: IQuizTeams) {
  confirmLoading.value = false;
  addQuizSeasons(v).then((res: any) => {
    showModal.value = false;
    confirmLoading.value = false;
    handlePageChange(1);
    window.$message.success(res);
  });
}

function handleUpdate(v: IQuizTeams) {
  confirmLoading.value = false;
  editQuizSeasons(v).then((res: any) => {
    showModal.value = false;
    confirmLoading.value = false;
    handlePageChange(1);
    edit.value = false;
    window.$message.success(res);
  });
}

const handleConfirm = (vv: IQuizSeasons) => {
  const v = { ...vv };
  let avatar = '';
  // @ts-ignore
  if (v.season_logo?.[0] && v.season_logo[0].flag) {
    // @ts-ignore
    avatar = v.season_logo[0].resultUrl;
  }
  v.season_logo = avatar;
  v.contest_teams = v.contest_teams.join(',');
  if (v.rangTime) {
    v.start_date = v.rangTime[0];
    v.end_date = v.rangTime[1];
  }
  if (edit.value) {
    handleUpdate(v);
  } else {
    handleCreate(v);
  }
};
</script>

<style lang="scss" scoped></style>
