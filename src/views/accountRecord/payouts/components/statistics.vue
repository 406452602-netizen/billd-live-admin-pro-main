<template>
  <n-modal
    v-model:show="visible"
    :title="`用户统计信息 - ${userInfo?.username || userInfo?.id}`"
    :mask-closable="true"
    :close-on-esc="true"
    preset="dialog"
    @close="handleClose"
  >
    <div>
      <n-grid
        v-if="statisticsData"
        :cols="2"
        :x-gap="12"
        :y-gap="12"
      >
        <n-grid-item>
          <n-card>
            <n-descriptions
              label-align="left"
              :column="1"
            >
              <n-descriptions-item label="用户流水">
                <span
                  :class="{
                    'text-red': statisticsData.user_flow < 0,
                    'clickable-text': true,
                  }"
                  @click="handleFlowClick('user')"
                >
                  {{ statisticsData.user_flow || 0 }}
                </span>
              </n-descriptions-item>
              <n-descriptions-item label="用户总输赢">
                <span
                  :class="{
                    'text-red': statisticsData.user_total_win_loss < 0,
                    'clickable-text': true,
                  }"
                  @click="handleFlowClick('user')"
                >
                  {{ statisticsData.user_total_win_loss || 0 }}
                </span>
              </n-descriptions-item>
            </n-descriptions>
          </n-card>
        </n-grid-item>
        <n-grid-item>
          <n-card>
            <n-descriptions
              label-align="left"
              :column="1"
            >
              <n-descriptions-item label="第三方流水">
                <span
                  :class="{
                    'text-red': statisticsData.third_party_flow < 0,
                    'clickable-text': true,
                  }"
                  @click="handleFlowClick('third_party')"
                >
                  {{ statisticsData.third_party_flow || 0 }}
                </span>
              </n-descriptions-item>
              <n-descriptions-item label="第三方总输赢">
                <span
                  :class="{
                    'text-red': statisticsData.third_party_total_win_loss < 0,
                    'clickable-text': true,
                  }"
                  @click="handleFlowClick('third_party')"
                >
                  {{ statisticsData.third_party_total_win_loss || 0 }}
                </span>
              </n-descriptions-item>
            </n-descriptions>
          </n-card>
        </n-grid-item>
        <n-grid-item :span="2">
          <n-card>
            <n-descriptions
              label-align="left"
              :column="1"
            >
              <n-descriptions-item label="总流水">
                <span :class="{ 'text-red': statisticsData.total_flow < 0 }">
                  {{ statisticsData.total_flow || 0 }}
                </span>
              </n-descriptions-item>
            </n-descriptions>
          </n-card>
        </n-grid-item>
      </n-grid>

      <div
        v-else
        class="text-center py-8"
      >
        <n-spin size="large" />
        <p class="mt-4">加载中...</p>
      </div>
    </div>

    <template #footer>
      <div style="display: flex; gap: 12px; justify-content: flex-end">
        <n-button @click="handleClose">关闭</n-button>
        <n-button
          type="primary"
          @click="handleThirdPartyDetail"
          >第三方明细
        </n-button>
        <n-button
          type="primary"
          @click="handleBetDetail"
          >投注明细
        </n-button>
      </div>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';

import { fetchUserDetail, fetchUserStatistics } from '@/api/user';
import router from '@/router';

interface IProps {
  show: boolean;
  userId: string | number | null;
  breadcrumbList: any[];
}

const props = defineProps<IProps>();
const emit = defineEmits<{
  'update:show': [value: boolean];
}>();

const visible = ref(false);
const userInfo = ref<any>(null);
const statisticsData = ref<any>(null);
const loading = ref(false);

// 监听show属性变化
watch(
  () => props.show,
  (newVal) => {
    visible.value = newVal;
    if (newVal && props.userId) {
      loadData();
    }
  }
);

// 加载用户信息和统计数据
const loadData = async () => {
  if (!props.userId) return;

  loading.value = true;
  try {
    // 获取用户详情
    const userRes = await fetchUserDetail(Number(props.userId));
    if (userRes.code === 200) {
      userInfo.value = userRes.data;
    }

    // 获取用户统计信息
    const statsRes = await fetchUserStatistics(props.userId);

    if (statsRes.code === 200 && statsRes.data) {
      // 使用新的数据结构处理统计信息
      const { quiz, game } = statsRes.data;

      // 映射到现有的界面数据结构
      statisticsData.value = {
        // 用户流水和总输赢使用quiz数据
        user_flow: quiz?.total_flow || 0,
        user_total_win_loss: quiz?.total_profit || 0,

        // 第三方流水和总输赢使用game数据
        third_party_flow: game?.total_flow || 0,
        third_party_total_win_loss: game?.total_profit || 0,

        // 计算总流水
        total_flow: (quiz?.total_flow || 0) + (game?.total_flow || 0),
      };
    } else {
      // 设置默认值
      statisticsData.value = {
        user_flow: 0,
        user_total_win_loss: 0,
        third_party_flow: 0,
        third_party_total_win_loss: 0,
        total_flow: 0,
      };
    }
  } catch (error) {
    console.error('加载用户统计信息失败:', error);
    // 设置默认值
    statisticsData.value = {
      user_flow: 0,
      user_total_win_loss: 0,
      third_party_flow: 0,
      third_party_total_win_loss: 0,
      total_flow: 0,
    };
  } finally {
    loading.value = false;
  }
};

// 处理流水点击事件
const handleFlowClick = (type: 'user' | 'third_party') => {
  if (type === 'user') {
    // 跳转到用户流水页面
    router.push({
      path: '/quiz/votes/list',
      query: {
        userId: props.userId,
        breadcrumbList: props.breadcrumbList,
      },
    });
  } else {
    // 跳转到第三方流水页面
    router.push({
      path: '/gameConsumptionRecord/agentUserRecords',
      query: {
        userId: props.userId,
        isRoot: 0,
        breadcrumbList: props.breadcrumbList,
      },
    });
  }
  handleClose();
};

// 关闭弹窗
// 修改handleClose方法
const handleClose = () => {
  visible.value = false;
  emit('update:show', false);
  // 清空统计数据，确保下次打开时重新加载
  statisticsData.value = null;
};

// 查看第三方明细
const handleThirdPartyDetail = () => {
  router.push({
    path: '/gameConsumptionRecord/agentUserRecords',
    query: {
      userId: props.userId,
      isRoot: 0,
      breadcrumbList: props.breadcrumbList,
    },
  });
  handleClose();
};

// 查看投注明细
const handleBetDetail = () => {
  router.push({
    path: '/quiz/votes/list',
    query: {
      userId: props.userId,
      breadcrumbList: props.breadcrumbList,
    },
  });
  handleClose();
};

// 监听userId变化
watch(
  () => props.userId,
  () => {
    if (props.show && props.userId) {
      loadData();
    }
  }
);
</script>

<style lang="scss" scoped>
.text-red {
  color: #f56c6c;
}

.text-green {
  color: #67c23a;
}

.card-content {
  padding: 16px;
}

.stat-item {
  margin-bottom: 12px;
}

.stat-label {
  font-size: 14px;
  color: #606266;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 16px;
  font-weight: 500;
}

.clickable-text {
  color: #409eff;
  cursor: pointer;
  text-decoration: underline;

  &:hover {
    color: #66b1ff;
    text-decoration: underline;
  }

  &.text-red {
    color: #f56c6c !important;

    &:hover {
      color: #f78989 !important;
    }
  }
}
</style>
