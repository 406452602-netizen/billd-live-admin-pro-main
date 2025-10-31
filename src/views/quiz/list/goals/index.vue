<template>
  <NModal v-model:show="showGoalsModal">
    <n-card
      style="width: 600px"
      :title="goalsTitle"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <HForm
        ref="hFormRef"
        v-bind="formGoalsConfigRes"
        v-model="formGoalsData"
        :show-action="true"
        :confirm-loading="confirmLoading"
        @click:confirm="handleGoalsConfirm"
      ></HForm>
    </n-card>
  </NModal>

  <NModal
    v-model:show="showModal"
    title="得分记录"
    style="width: 800px"
    preset="dialog"
  >
    <n-data-table
      remote
      :scroll-x="scrollX"
      :columns="columns"
      :loading="tableListLoading"
      :data="tableListData"
      :bordered="false"
    />
    <template #action>
      <n-button
        type="primary"
        @click="
          openGoalsModal(
            formGoalsData.team_id,
            goalsTitle,
            formGoalsData.match_id,
            formGoalsData.bureau_index
          )
        "
      >
        添加得分
      </n-button>
    </template>
  </NModal>
</template>

<script setup lang="ts">
import { NButton, NSpace } from 'naive-ui';
import { TableColumns } from 'naive-ui/es/data-table/src/interface';
import { h, ref } from 'vue';

const emits = defineEmits(['refresh']);
import {
  addQuizMatchGoals,
  deleteQuizMatchGoals,
  updateQuizMatchGoals,
} from '@/api/quiz.ts';
import HForm from '@/components/Base/Form';
import { IQuizMatchGoals } from '@/interface.ts';
import { useUserStore } from '@/store/user';
import { formGoalsConfig } from '@/views/quiz/list/config/formGoals.config.ts';
import { columnsConfig } from '@/views/quiz/list/config/goalsColumns.config.ts';

const showGoalsModal = ref(false);
const confirmLoading = ref(false);
const showModal = ref(false);
const tableListLoading = ref(false);
const userStore = useUserStore();
const scrollX = ref(0);
const goalsTitle = ref();
const formGoalsData = ref<any>();

const formGoalsConfigRes = ref(formGoalsConfig());

const tableListData = ref([]);

const createColumns = (): TableColumns<IQuizMatchGoals> => {
  const action: TableColumns<IQuizMatchGoals> = [
    {
      title: '操作',
      key: 'actions',
      width: 200,
      align: 'center',
      fixed: 'right',
      render(row) {
        if (userStore.userInfo?.id == 1) {
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
                    find(row);
                  },
                },
                () => '编辑' // 用箭头函数返回性能更好。
              ),
              h(
                NButton,
                {
                  size: 'small',
                  type: 'error',
                  onClick: () => {
                    console.log('触发编辑', row);
                    deleteGoals(row.goal_id);
                  },
                },
                () => '删除' // 用箭头函数返回性能更好。
              ),
            ]
          );
        } else {
          return null;
        }
      },
    },
  ];
  return [...columnsConfig(), ...action];
};

const columns = createColumns();
const openGoalsModal = (teamId, teamName, matchId, bureauIndex) => {
  showGoalsModal.value = true;
  formGoalsData.value = {
    goals_num: 1,
    team_id: teamId,
    match_id: matchId,
    bureau_index: bureauIndex,
  };
  goalsTitle.value = teamName;
};

const openGoalsListModal = (team, goals, matchId, bureauIndex) => {
  formGoalsData.value = {
    goals_num: 1,
    team_id: team.team_id,
    match_id: matchId,
    bureau_index: bureauIndex,
  };
  console.log('openGoalsListModal', formGoalsData.value);
  tableListData.value = goals.goals;
  goalsTitle.value = team.team_name;
  showModal.value = true;
};

const refreshGoalsList = (goals) => {
  tableListData.value = goals.goals;
  tableListLoading.value = false;
};

const handleGoalsConfirm = (v) => {
  console.log('v', v);
  if (v.goal_id) {
    updateQuizMatchGoals(v).then((res: any) => {
      if (res.code === 200) {
        showGoalsModal.value = false;
        window.$message.success('更新成功');
        emits('refresh', formGoalsData.value.team_id);
      }
    });
  } else {
    addQuizMatchGoals(v).then((res: any) => {
      if (res.code === 200) {
        showGoalsModal.value = false;
        window.$message.success('添加成功');
        tableListLoading.value = true;
        emits('refresh', formGoalsData.value.team_id);
      }
    });
  }
};
const deleteGoals = (goalId) => {
  deleteQuizMatchGoals(goalId).then((res: any) => {
    if (res.code === 200) {
      window.$message.success('删除成功');
      tableListLoading.value = true;
      emits('refresh', formGoalsData.value.team_id);
    }
  });
};

const find = (row) => {
  formGoalsData.value = row;
  showGoalsModal.value = true;
};

defineExpose({
  openGoalsModal,
  openGoalsListModal,
  refreshGoalsList,
});
</script>
<style scoped lang="scss"></style>
