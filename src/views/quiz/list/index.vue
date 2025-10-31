<template>
  <div>
    <HSearch
      :search-form-config="searchForm"
      :init-value="params"
      :hide-add-btn="userStore.userInfo?.id != 1"
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
    <NModal
      v-model:show="showModal"
      style="width: 600px"
      :title="t('common.add')"
      preset="dialog"
    >
      <template #action>
        <n-button
          type="info"
          @click="createLiveRoom"
        >
          创建直播间
        </n-button>
      </template>
      <n-card
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
          @update:filed="handleUpdateFiled"
          @click:confirm="handleConfirm"
        ></HForm>
      </n-card>
    </NModal>

    <NModal
      v-model:show="showMatchModal"
      preset="dialog"
      style="width: 800px"
    >
      <template #action>
        <n-button
          v-if="Number(formData.status) != 2"
          type="error"
          @click="lockMatchVotesAll"
        >
          全部锁盘
        </n-button>
        <n-button
          v-if="Number(formData.status) != 2"
          type="info"
          @click="handleUpdate(formData)"
        >
          修改
        </n-button>
        <n-button
          v-if="Number(formData.status) != 2"
          type="info"
          @click="votesRule(formData.match_id)"
        >
          球盘列表
        </n-button>
        <!-- 将原来的getStatusPrompt(formData)替换为statusPrompt -->
        <n-button
          v-if="Number(formData.status) != 2"
          type="warning"
          @click="startMatch"
        >
          {{ statusPrompt }}
        </n-button>
        <n-button
          class="btn-wrap"
          :class="{ end: startLive }"
          @click="handleStartLive()"
        >
          {{ !startLive ? '开始直播' : '结束直播' }}
        </n-button>
      </template>
      <n-card
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <n-form
          ref="formRef"
          label-placement="left"
          :model="formData"
          :rules="formRules"
        >
          <n-grid
            :x-gap="12"
            :y-gap="4"
            :cols="2"
          >
            <n-grid-item>
              <n-flex
                vertical
                align="center"
              >
                <img
                  width="60"
                  height="60"
                  :src="url + formData.team1.team_logo"
                  alt=""
                />
                <div>{{ formData.team1.team_name }}</div>
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
                  :src="url + formData.team2.team_logo"
                  alt=""
                />
                <div>{{ formData.team2.team_name }}</div>
              </n-flex>
            </n-grid-item>

            <n-grid-item>
              <n-space
                align="center"
                justify="space-around"
              >
                得分：{{ showGoals.team1.goals_num }}
                <n-button
                  @click="
                    openGoalsModal(formData.team_id, formData.team1.team_name)
                  "
                  >添加得分信息
                </n-button>
                <n-button
                  type="info"
                  @click="handleGoalsRecord(formData.team1, showGoals.team1)"
                  >得分记录
                </n-button>
              </n-space>
            </n-grid-item>
            <n-grid-item>
              <n-space
                align="center"
                justify="space-around"
              >
                得分：{{ showGoals.team2.goals_num }}
                <n-button
                  @click="
                    openGoalsModal(formData.team_id2, formData.team2.team_name)
                  "
                  >添加得分信息
                </n-button>
                <n-button
                  type="info"
                  @click="handleGoalsRecord(formData.team2, showGoals.team2)"
                  >得分记录
                </n-button>
              </n-space>
            </n-grid-item>
            <n-grid-item>
              <n-form-item path="rangTime">
                <n-date-picker
                  v-model:value="formData.rangTime"
                  type="datetimerange"
                />
              </n-form-item>
            </n-grid-item>
            <n-grid-item>
              <n-form-item path="team2_odds">
                <n-input-number
                  v-model:value="formData.tax_rate"
                  step="0.05"
                  :precision="2"
                >
                  <template #prefix> 税率</template>
                </n-input-number>
              </n-form-item>
            </n-grid-item>
            <n-grid-item>
              <n-input
                v-model:value="formData.description"
                placeholder="请输入比赛描述"
              />
            </n-grid-item>
            <n-grid-item>
              <n-select
                v-model:value="formData.bureau_number"
                :options="bureauOption"
                placeholder="请选择比赛局数"
              />
            </n-grid-item>
            <n-grid-item>
              <n-form-item path="team2_odds">
                <n-select
                  v-if="liveRoomOption.length > 0"
                  v-model:value="formData.live_room_id"
                  :disabled="startLive"
                  placeholder="请选择直播间"
                  :options="liveRoomOption"
                >
                </n-select>
              </n-form-item>
            </n-grid-item>
          </n-grid>
        </n-form>
        <div
          v-if="startLive && liveRoomInfo"
          class="obs-wrap"
        >
          <div class="obs-item">
            <div class="obs-ipt-wrap">
              <div>OBS服务器：</div>
              <n-space
                align="center"
                class="ipt"
              >
                <n-input
                  :value="liveRoomInfo.push_obs_server"
                  class="val disabled"
                  type="text"
                  disabled
                />
                <n-button @click="handleCopy(liveRoomInfo.push_obs_server)">
                  <n-icon
                    :component="Copy"
                    class="copy"
                  >
                  </n-icon>
                  复制
                </n-button>
              </n-space>
            </div>
            <div class="obs-ipt-wrap">
              <div>OBS推流码：</div>
              <n-space
                align="center"
                class="ipt"
              >
                <n-input
                  :value="liveRoomInfo.push_obs_stream_key"
                  class="val padding disabled"
                  type="text"
                  disabled
                />
                <n-button
                  class="update"
                  @click="handleUpdateKey"
                >
                  <n-icon :component="Refresh" />
                  刷新
                </n-button>
                <n-button @click="handleCopy(liveRoomInfo.push_obs_stream_key)">
                  <n-icon
                    :component="Copy"
                    class="copy"
                  >
                  </n-icon>
                  复制
                </n-button>
              </n-space>
            </div>
          </div>
          <div class="obs-item">
            <div class="obs-ipt-wrap">
              <div>RTMP推流地址：</div>
              <n-space class="ipt">
                <n-input
                  :value="liveRoomInfo.push_rtmp_url"
                  class="val disabled"
                  type="text"
                  disabled
                />
                <n-button @click="handleCopy(liveRoomInfo.push_rtmp_url)">
                  <n-icon
                    :component="Copy"
                    class="copy"
                  >
                  </n-icon>
                  复制
                </n-button>
              </n-space>
            </div>
          </div>
        </div>
      </n-card>
    </NModal>
    <matchVotesRules
      ref="matchVotesRulesRef"
      :match="formData"
      :show-modal="showRule"
    />
    <goals
      ref="goalsRef"
      v-model="formGoalsData"
      :table-list-data="goalsTableList"
      @refresh="refreshGoals"
    />
  </div>
</template>

<script lang="ts" setup>
import { Copy, Refresh } from '@vicons/ionicons5';
import { NButton, NSpace } from 'naive-ui';
import { TableColumns } from 'naive-ui/es/data-table/src/interface';
// 修改导入部分，添加computed
import { h, onMounted, ref, watch, computed } from 'vue';
import { useI18n } from 'vue-i18n';

import {
  fetchLiveStartLive,
  fetchLiveCloseMyLive,
  fetchLiveLiveRoomIsLive,
} from '@/api/live'; // 假设的 API 函数
import {
  fetchCreateUserLiveRoom,
  fetchUpdateLiveRoomKey,
} from '@/api/liveRoom.ts';
import {
  fetchQuizSeasonsList,
  addQuizMatches,
  editQuizMatches,
  fetchQuizMatchesList,
  fetchQuizMatchesById,
  fetchQuizMatchTypesList,
  findQuizTeamsById,
  getQuizMatchGoalsList,
  settlementQuizMatches,
  lockMatchVotes,
} from '@/api/quiz'; // 假设的 API 函数
import HForm from '@/components/Base/Form';
import HSearch from '@/components/Base/Search';
import { QuizMatchStatusEnumMap } from '@/constant.ts';
import { usePage } from '@/hooks/use-page';
// eslint-disable-next-line import/order
import { useUserStore } from '@/store/user';

const userStore = useUserStore();
const liveRoomInfo = ref<ILiveRoom>();

// eslint-disable-next-line import/order
import {
  IQuizMatchTypes,
  IList,
  IQuizTeams,
  IQuizMatches,
  ILiveRoom,
} from '@/interface';
import { getBaseUrl } from '@/utils/request';

// eslint-disable-next-line import/order
import { copyToClipBoard } from 'billd-utils';

import { columnsConfig } from './config/columns.config'; // 需创建对应配置文件
import { formConfig } from './config/form.config';
import { searchFormConfig } from './config/search.config';
import goals from './goals/index.vue';
import matchVotesRules from './matchVotesRules/index.vue';

const { t } = useI18n();
const startLive = ref(false);
const showRule = ref(false);
const matchVotesRulesRef = ref<InstanceType<typeof matchVotesRules>>();

const url = getBaseUrl();
const formRef = ref<any>();
const goalsTableList = ref<any>([]);
const goalsRef = ref<any>();

// 删除原来的getStatusPrompt函数定义
// 替换为计算属性
const statusPrompt = computed(() => {
  const item = formData.value;
  switch (Number(item.status)) {
    case 0:
      return '开始比赛';
    case 1:
      if (item.bureau_number && item.bureau_index + 1 < item.bureau_number) {
        return `结束第${item.bureau_index + 1}局`;
      } else {
        return '结束比赛(结算)';
      }
    default:
      return '错误';
  }
});

function getTeamOdds(rule: any, value: any, formData: any) {
  console.log('rule', rule);
  console.log('value', value);
  const values = formData?.value;
  const team1Odds = values?.team1_odds;
  const team2Odds = values?.team2_odds;
  const taxRate = values?.tax_rate;
  console.log('formData', taxRate);

  if (team1Odds !== undefined && team2Odds !== undefined) {
    const sum = Number(team1Odds) + Number(team2Odds);
    let max = 2;
    if (taxRate) {
      max = max - taxRate;
    }
    if (sum > max) {
      return new Error(`队伍1和队伍2赔率总和必须小于或等于${max}`);
    } else {
      return true;
    }
  } else {
    return true;
  }
}

const formRules = {
  team1_odds: {
    trigger: 'blur',
    validator: (rule: any, value: any) => {
      return getTeamOdds(rule, value, formData);
    },
  },
  team2_odds: {
    trigger: 'blur',
    validator: (rule: any, value: any) => {
      return getTeamOdds(rule, value, formData);
    },
  },
};

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

const lockMatchVotesAll = () => {
  lockMatchVotes({
    match_id: formData.value.match_id,
    is_lock: 1,
  }).then((result) => {
    if (result.code === 200) {
      window.$message.success('锁盘成功');
    }
  });
};

// 定义组件的响应式数据
const formData = ref({ ...props.modelValue });
const formGoalsData = ref();

const showGoals = ref({
  team1: {
    goals: [] as any[],
    goals_num: 0,
  },
  team2: {
    goals: [] as any[],
    goals_num: 0,
  },
});

// 定义新增/编辑的表单引用
const confirmLoading = ref(false);
const liveRoomOption = ref([{ label: '', value: 0 }]);

const tableListData = ref([]);
const total = ref(0);
const pagination = usePage();
const tableListLoading = ref(false);
const formConfigRes = ref();

const seasonOption = ref([]);
const teamOption = ref([]);
const typeOption = ref([]);
const bureauOption = ref([
  {
    label: '无局数',
    value: 0,
  },
  {
    label: '三局两胜',
    value: 3,
  },
  {
    label: '五局三胜',
    value: 5,
  },
  {
    label: '七局四胜',
    value: 7,
  },
  {
    label: '九局五胜',
    value: 9,
  },
]);

const params = ref<ISearch>({
  orderName: 'match_id',
  orderBy: 'desc',
});

const edit = ref(false);
const isOpenGoalsModel = ref(false);

const showModal = ref(false);
const showMatchModal = ref(false);

const searchForm = ref(searchFormConfig(t));
const createColumns = (): TableColumns<IQuizMatches> => {
  const action: TableColumns<IQuizMatches> = [
    {
      title: '状态',
      key: 'staus',
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
                type: 'success',
                onClick: () => {
                  console.log('触发编辑', row);
                  // showMatchModal.value = true;
                },
              },
              () => {
                console.log('status', row.status);
                return QuizMatchStatusEnumMap[Number(row.status)];
              } // 用箭头函数返回性能更好。
            ),
          ]
        );
      },
    },
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
                  type: 'info',
                  onClick: () => {
                    console.log('触发编辑', row);
                    votesRule(row.match_id);
                  },
                },
                () => '球盘列表' // 用箭头函数返回性能更好。
              ),
              h(
                NButton,
                {
                  size: 'small',
                  type: 'primary',
                  onClick: () => {
                    console.log('触发编辑', row);
                    find(row.match_id);
                  },
                },
                () => '编辑' // 用箭头函数返回性能更好。
              ),
            ]
          );
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
columns.forEach((item) => {
  if (item.width) {
    scrollX.value += Number(item.width);
  }
});
const createLiveRoom = () => {
  fetchCreateUserLiveRoom().then((res) => {
    if (res.code === 200) {
      liveRoomInfo.value = res.data;
      window.$message.success('创建直播间成功');
      userStore.getUserInfo();
      liveRoomList();
      formConfigRes.value = formConfig({
        quizSeasonsOption: seasonOption,
        quizTypeOption: typeOption,
        quizTeamOption: teamOption,
        formData,
        liveRoomOption,
        bureauOption,
      });
    }
  });
};

onMounted(async () => {
  const res = await fetchQuizMatchTypesList({});
  if (res.code === 200) {
    typeOption.value = res.data.rows.map((v) => {
      return {
        label: v.type_name,
        value: v.id,
      };
    });
    if (typeOption.value.length > 0) {
      formData.value.type_id = res.data.rows[0].id;
      switchType();
    } else {
      formConfigRes.value = formConfig({
        quizSeasonsOption: seasonOption,
        quizTypeOption: typeOption,
        quizTeamOption: teamOption,
        formData,
        liveRoomOption,
        bureauOption,
      });
    }
  }
  await handlePageChange(1);

  liveRoomList();
});

const liveRoomList = () => {
  if (userStore.userInfo && userStore.userInfo.live_rooms) {
    liveRoomOption.value = [];
    userStore.userInfo.live_rooms.map((v) => {
      liveRoomOption.value.push({
        label: v.title as string,
        value: v.id as number,
      });
    });
    console.log('liveRoomOption', liveRoomOption.value);
  }
};

watch(
  () => pagination.pageSize,
  () => {
    handlePageChange(1);
  }
);

const startMatch = () => {
  switch (Number(formData.value.status)) {
    case 0:
      formData.value.status = Number(formData.value.status) == 0 ? 1 : 2;
      handleUpdate(formData.value);
      break;
    case 1:
      if (
        formData.value.bureau_number &&
        (!formData.value.bureau_index ||
          formData.value.bureau_index + 1 < formData.value.bureau_number)
      ) {
        const index = formData.value.bureau_index
          ? formData.value.bureau_index + 1
          : 1;
        formData.value.bureau_index = index;
        editQuizMatches({
          match_id: formData.value.match_id,
          bureau_index: formData.value.bureau_index,
        }).then((res: any) => {
          if (res.code === 200) {
            find(formData.value.match_id);
            window.$message.success(`第${index}局结束`);
          }
        });
      } else {
        settlementQuizMatches(formData.value.match_id).then((res: any) => {
          if (res.code === 200) {
            window.$message.success('结算成功');
            fetchLiveCloseMyLive({ roomId: formData.value.live_room_id }).then(
              (response) => {
                if (response.code === 200) {
                  window.$message.warning('已关闭直播');
                  startLive.value = !startLive.value;
                }
              }
            );
            find(formData.value.match_id);
          }
        });
      }

      break;
    case 2:
      window.$message.warning('比赛已结束');
      break;
  }
};

async function ajaxFetchList(args) {
  try {
    tableListLoading.value = true;
    const res: any = await fetchQuizMatchesList(args);
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

async function votesRule(id) {
  const res = await fetchQuizMatchesById(id);
  matchVotesRulesRef.value?.initFormData(res.data);
  // const row = res.data;
  // formData.value = {
  //   ...row,
  // };
  // showRule.value = true;
}

async function find(id, goalTeamId?: number) {
  if (id) {
    const res = await fetchQuizMatchesById(id);

    if (res.code !== 200) return;
    const row = res.data;
    initStartLiveInfo(row.live_room_id);
    row.rangTime = [row.start_time, row.end_time];
    // showModal.value = true;
    edit.value = true;
    formData.value = {
      ...row,
      rangTime: [row.start_time, row.end_time],
    };
    showMatchModal.value = true;
    getQuizMatchGoalsList({
      bureau_index: row.bureau_index,
      match_id: id,
      pageSize: 500,
    }).then((res: any) => {
      if (res.code === 200) {
        const data = {
          team1: {
            goals: [] as any[],
            goals_num: 0,
            team_id: formData.value.team_id,
          },
          team2: {
            goals: [] as any[],
            goals_num: 0,
            team_id: formData.value.team_id2,
          },
        };
        res.data.rows.forEach((v) => {
          if (formData.value.team_id == v.team_id) {
            data.team1.goals.push(v);
            data.team1.goals_num += v.goals_num;
          } else if (formData.value.team_id2 == v.team_id) {
            data.team2.goals.push(v);
            data.team2.goals_num += v.goals_num;
          }
        });
        showGoals.value = data;
        if (goalTeamId) {
          if (goalTeamId == data.team1.team_id) {
            goalsRef.value.refreshGoalsList(data.team1);
          } else if (goalTeamId == data.team2.team_id) {
            goalsRef.value.refreshGoalsList(data.team2);
          }
        }
      }
    });
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
  formData.value['tax_rate'] = 0.01;
  edit.value = false;
}

function handleCreate(v: IQuizTeams) {
  confirmLoading.value = false;
  addQuizMatches(v).then((res: any) => {
    showModal.value = false;
    confirmLoading.value = false;
    handlePageChange(1);
    window.$message.success(res);
  });
}

function handleUpdate(v: IQuizTeams) {
  formRef.value
    .validate()
    .then(() => {
      confirmLoading.value = false;
      editQuizMatches(v).then((res: any) => {
        if (res.code !== 200) {
          return;
        }
        showModal.value = false;
        confirmLoading.value = false;
        handlePageChange(1);
        edit.value = false;
        window.$message.success('修改成功');
      });
    })
    .catch((err) => console.log('err', err));
}

const handleConfirm = (vv: IQuizMatches) => {
  const v = { ...vv };
  handleCreate(v);
  // const max = 2 - Number(v.tax_rate);
  // if (Number(v.team1_odds) + Number(v.team2_odds) > max) {
  //   const notification = useNotification();
  //   notification.error({
  //     title: '提示',
  //     description: '您的两队赔率的和必须小于等于${max}',
  //     content: `您的两队赔率的和必须小于等于${max}`,
  //     meta: '2019-5-27 15:11',
  //     onAfterLeave: () => {},
  //   });
  //   return;
  // }
};

function handleUpdateFiled(v) {
  if (v == 'type_id') {
    switchType();
  }
}

async function initStartLiveInfo(roomId) {
  const res = await fetchLiveLiveRoomIsLive(roomId);
  startLive.value = !!(res.code === 200 && res.data);
  if (userStore.userInfo && userStore.userInfo.live_rooms) {
    for (let i = 0; i < userStore.userInfo.live_rooms.length; i += 1) {
      if (userStore.userInfo.live_rooms[i].id === roomId) {
        liveRoomInfo.value = userStore.userInfo.live_rooms[i];
        break;
      }
    }
  }
}

function switchType() {
  // fetchQuizTeamsList({ type_id: formData.value.type_id }).then((res: any) => {
  //   if (res.code === 200) {
  //     teamOption.value = res.data.rows.map((v) => {
  //       return { label: v.team_name, value: v.team_id };
  //     });
  //     formConfigRes.value = formConfig({
  //       quizSeasonsOption: seasonOption,
  //       quizTypeOption: typeOption,
  //       quizTeamOption: teamOption,
  //     });
  //   }
  // });
  fetchQuizSeasonsList({
    quiz_match_type: formData.value.type_id,
    isNotEnded: true,
  }).then((res: any) => {
    if (res.code === 200) {
      const season = res.data.rows;
      seasonOption.value = season.map((v) => {
        return { label: v.season_name, value: v.season_id };
      });
      // formConfigRes.value = formConfig({
      //   quizSeasonsOption: seasonOption,
      //   quizTypeOption: typeOption,
      //   quizTeamOption: teamOption,
      // });
      if (res.data.total > 0) {
        const info = season[0].contest_teams.split(',');
        console.log('info', info);
        findQuizTeamsById(info).then((res: any) => {
          if (res.code === 200) {
            teamOption.value = res.data.map((v) => {
              return { label: v.team_name, value: v.team_id };
            });
            formConfigRes.value = formConfig({
              quizSeasonsOption: seasonOption,
              quizTypeOption: typeOption,
              quizTeamOption: teamOption,
              formData,
              liveRoomOption,
              bureauOption,
            });
          }
        });
      } else {
        formConfigRes.value = formConfig({
          quizSeasonsOption: seasonOption,
          quizTypeOption: typeOption,
          quizTeamOption: teamOption,
          formData,
          liveRoomOption,
          bureauOption,
        });
      }
    }
  });
}

async function handleStartLive() {
  if (startLive.value) {
    const res = await fetchLiveCloseMyLive({
      room_id: formData.value.live_room_id,
    });
    if (res.code === 200) {
      window.$message.warning('已关闭直播');
      startLive.value = !startLive.value;
    }
    return;
  }
  console.log('formData.value', formData.value);
  const res = await fetchLiveStartLive({
    live_room_type: 1,
    area_id: 1,
    room_id: formData.value.live_room_id,
    area_name: '平台直播',
  });
  if (res.code === 200 && res.data.code === 0) {
    startLive.value = !startLive.value;
    const data = {
      ...formData.value,
      live_room_id: res.data.data.live_room_id,
    };
    console.log('data', data, res.data.data.live_room_id);
    handleUpdate(data);
  }
}

function handleCopy(url: string | number | any) {
  copyToClipBoard(`${url}`);
  window.$message.success('复制成功！');
}

async function handleUpdateKey() {
  try {
    const res = await fetchUpdateLiveRoomKey();
    if (res.code === 200 && userStore.userInfo?.live_rooms?.[0]) {
      userStore.userInfo.live_rooms[0].push_obs_server =
        res.data.srsPushRes.obs_server;
      userStore.userInfo.live_rooms[0].push_obs_stream_key =
        res.data.srsPushRes.obs_stream_key;
      userStore.userInfo.live_rooms[0].push_rtmp_url =
        res.data.srsPushRes.rtmp_url;
      userStore.userInfo.live_rooms[0].push_srt_url =
        res.data.srsPushRes.srt_url;
      userStore.userInfo.live_rooms[0].push_webrtc_url =
        res.data.srsPushRes.webrtc_url;
      userStore.userInfo.live_rooms[0].push_cdn_obs_server =
        res.data.cdnPushRes.obs_server;
      userStore.userInfo.live_rooms[0].push_cdn_obs_stream_key =
        res.data.cdnPushRes.obs_stream_key;
      userStore.userInfo.live_rooms[0].push_cdn_rtmp_url =
        res.data.cdnPushRes.rtmp_url;
      userStore.userInfo.live_rooms[0].push_cdn_srt_url =
        res.data.cdnPushRes.srt_url;
      userStore.userInfo.live_rooms[0].push_cdn_webrtc_url =
        res.data.cdnPushRes.webrtc_url;
      window.$message.success('更新成功！');
    }
  } catch (error) {
    console.error(error);
  }
}

const openGoalsModal = (teamId, teamName) => {
  if (formData.value.status !== 1) {
    window.$message.warning('非正在进行比赛，无法添加进球');
    return;
  }
  let bureauIndex: any = undefined;
  if (formData.value.bureau_number) {
    if (formData.value.bureau_index) {
      bureauIndex = formData.value.bureau_index;
    } else {
      bureauIndex = 0;
    }
  }

  goalsRef.value.openGoalsModal(
    teamId,
    teamName,
    formData.value.match_id,
    bureauIndex
  );
};

const handleGoalsRecord = (team, goals) => {
  let bureauIndex: any = undefined;
  if (formData.value.bureau_number) {
    if (formData.value.bureau_index) {
      bureauIndex = formData.value.bureau_index;
    } else {
      bureauIndex = 0;
    }
  }
  goalsRef.value.openGoalsListModal(
    team,
    goals,
    formData.value.match_id,
    bureauIndex
  );
};

const refreshGoals = (teamId) => {
  isOpenGoalsModel.value = true;
  find(formData.value.match_id, teamId);
};
</script>

<style lang="scss" scoped>
.text-center {
  text-align: center;
}
</style>
