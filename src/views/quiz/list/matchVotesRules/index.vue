<template>
  <NModal
    v-model:show="showForm"
    title="开盘"
    style="width: 600px"
    preset="dialog"
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
          <n-form-item
            label="请选择投票类型"
            path="votes_type"
          >
            <n-select
              v-model:value="formData.votes_type"
              :options="voteTypeOption"
            >
            </n-select>
          </n-form-item>
        </n-grid-item>
        <n-grid-item>
          <n-space>
            <n-form-item
              path="is_lock"
              label="锁盘"
            >
              <n-switch
                v-model:value="formData.is_lock"
                :default-value="formData.is_lock"
                :unchecked-value="0"
                :checked-value="1"
              ></n-switch>
            </n-form-item>
            <n-form-item
              path="isAutoFill"
              label="自动填盘"
            >
              <n-switch
                v-model:value="isAutoFill"
                :default-value="false"
                :unchecked-value="false"
                :checked-value="true"
              ></n-switch>
            </n-form-item>
          </n-space>
        </n-grid-item>
        <n-grid-item>
          <n-space
            ><span>税率：{{ match.tax_rate }}</span>
          </n-space>
        </n-grid-item>
        <n-grid-item
          v-if="
            QuizVoteType.bureauLetBall == formData.votes_type ||
            (QuizVoteType.oddPurchase == formData.votes_type &&
              match.bureau_number)
          "
        >
          <n-form-item
            label="胜负局"
            path="bureau_index"
          >
            <n-select
              v-model:value="formData.bureau_index"
              placeholder="请选择局数"
              :options="bureauNumberOption"
            ></n-select>
          </n-form-item>
        </n-grid-item>
        <n-grid-item
          v-if="
            ![
              QuizVoteType.overGameLetBall,
              QuizVoteType.bureauLetBall,
            ].includes(formData.votes_type)
          "
        >
          <n-form-item
            path="reserve_price"
            label="底价/底分"
          >
            <n-input-number
              v-model:value="formData.reserve_price"
              step="0.1"
              :min="0.1"
              placeholder="请输入底价/底分"
            />
          </n-form-item>
        </n-grid-item>
        <n-grid-item v-if="formData.votes_type === QuizVoteType.oddPurchase">
          <n-form-item
            path="maximum_differential"
            label="最大分差"
          >
            <n-input-number
              v-model:value="formData.maximum_differential"
              step="1"
              :min="1"
              placeholder="请输入最大分差"
            />
          </n-form-item>
        </n-grid-item>
      </n-grid>
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
            <div v-if="formData.votes_type == QuizVoteType.gameNumber">大</div>
            <div v-else>
              <img
                width="60"
                height="60"
                :src="url + match.team1.team_logo"
              />
              <div>{{ match.team1.team_name }}</div>
            </div>
          </n-flex>
        </n-grid-item>
        <n-grid-item>
          <n-flex
            vertical
            align="center"
          >
            <div v-if="formData.votes_type == QuizVoteType.gameNumber">小</div>
            <div v-else>
              <img
                width="60"
                height="60"
                :src="url + match.team2.team_logo"
              />
              <div>{{ match.team2.team_name }}</div>
            </div>
          </n-flex>
        </n-grid-item>
        <n-grid-item v-if="formData.votes_type != QuizVoteType.oddPurchase">
          <n-form-item path="team1_odds">
            <n-input-number
              v-model:value="formData.team1_odds"
              step="0.1"
              :min="1"
              :precision="2"
              @update:value="handleTeam1OddsChange"
            >
              <template #prefix> 赔率</template>
            </n-input-number>
          </n-form-item>
        </n-grid-item>
        <n-grid-item v-if="formData.votes_type != QuizVoteType.oddPurchase">
          <n-form-item path="team2_odds">
            <n-input-number
              v-model:value="formData.team2_odds"
              step="0.1"
              :min="1"
              :precision="2"
              @update:value="handleTeam2OddsChange"
            >
              <template #prefix> 赔率</template>
            </n-input-number>
          </n-form-item>
        </n-grid-item>
        <n-grid-item v-if="formData.votes_type != QuizVoteType.winLoss">
          <n-form-item path="team1_odds">
            <n-input-number
              v-model:value="formData.team1_fraction"
              step="1"
              :precision="2"
              @update:value="handleTeam1FractionChange"
            >
              <template #prefix> 球/分</template>
            </n-input-number>
          </n-form-item>
        </n-grid-item>
        <n-grid-item v-if="formData.votes_type != QuizVoteType.winLoss">
          <n-form-item path="team2_odds">
            <n-input-number
              v-model:value="formData.team2_fraction"
              step="1"
              :precision="2"
              @update:value="handleTeam2FractionChange"
            >
              <template #prefix> 球/分</template>
            </n-input-number>
          </n-form-item>
        </n-grid-item>
      </n-grid>

      <!-- 大局让分的动态让分详情录入 - 完全独立的逻辑 -->
      <n-form-item
        v-if="formData.votes_type === QuizVoteType.overGameLetBall"
        label="每局让分情况"
        :show-label="false"
      >
        <div class="let-score-detail-container">
          <div
            v-if="
              formData.let_score_detail && formData.let_score_detail.length > 0
            "
          >
            <div class="let-score-detail-header">
              <div class="header-item">局数</div>
              <div class="header-item">让分情况</div>
              <div class="header-item">操作</div>
            </div>
            <div
              v-for="(item, index) in formData.let_score_detail"
              :key="`let-score-${index}`"
              class="let-score-detail-row"
            >
              <div class="row-item">第{{ item.bureau_index + 1 }}局</div>
              <div class="row-item">
                <n-descriptions
                  label-align="right"
                  label-placement="left"
                  :column="1"
                >
                  <n-descriptions-item :label="match.team1.team_name">
                    <n-input-number
                      v-model:value="item.team1_fraction"
                      step="1"
                      :precision="2"
                      style="width: 100px"
                      @update:value="
                        (v) => handleBureauTeam1FractionChange(index, Number(v))
                      "
                    />
                  </n-descriptions-item>
                  <n-descriptions-item :label="match.team2.team_name">
                    <n-input-number
                      v-model:value="item.team2_fraction"
                      step="1"
                      :precision="2"
                      style="width: 100px"
                      @update:value="
                        (v) => handleBureauTeam2FractionChange(index, Number(v))
                      "
                    />
                  </n-descriptions-item>
                </n-descriptions>
              </div>
              <div class="row-item">
                <n-button
                  size="small"
                  danger
                  @click="removeLetScoreDetail(index)"
                  >删除
                </n-button>
              </div>
            </div>
          </div>
          <div class="add-let-score-btn">
            <n-button
              type="primary"
              @click="openSelectBureauModal"
              :disabled="!canAddLetScoreDetail"
            >
              添加让分记录
            </n-button>
            <span
              v-if="!canAddLetScoreDetail"
              class="add-disabled-tip"
            >
              已添加所有局数的让分记录
            </span>
          </div>
        </div>
      </n-form-item>
    </n-form>
    <template #action>
      <n-button
        type="primary"
        @click="submitForm"
      >
        提交
      </n-button>
    </template>
  </NModal>

  <!-- 选择局数的弹窗 - 新增 -->
  <NModal
    v-model:show="showSelectBureauModal"
    title="选择要添加让分的局数"
    preset="dialog"
  >
    <n-form-item label="选择局数">
      <n-select
        v-model:value="selectedBureauIndex"
        placeholder="请选择要添加让分的局数"
        :options="availableBureauOptions"
      ></n-select>
    </n-form-item>
    <template #action>
      <n-button @click="showSelectBureauModal = false">取消</n-button>
      <n-button
        type="primary"
        @click="addLetScoreDetail"
        :disabled="selectedBureauIndex === null"
      >
        确认添加
      </n-button>
    </template>
  </NModal>

  <NModal
    v-model:show="showModal"
    title="开盘记录"
    style="width: 800px"
    preset="dialog"
  >
    <template #action>
      <n-button
        type="primary"
        @click="lotteryOpen"
      >
        开盘
      </n-button>
    </template>
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
  </NModal>
</template>

<script setup lang="ts">
import { NButton, NModal, NSelect, NSpace } from 'naive-ui';
import { TableColumns } from 'naive-ui/es/data-table/src/interface';
import { computed, h, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import {
  addQuizMatchVotes,
  editQuizMatchVotes,
  fetchQuizMatchVotes,
  fetchQuizMatchVotesById,
} from '@/api/quiz.ts';
import { QuizVoteTypeMap } from '@/constant';
import { usePage } from '@/hooks/use-page.ts';
import { IList, IQuizMatchVotes, QuizVoteType } from '@/interface.ts';
import { getBaseUrl } from '@/utils/request.ts';

import { columnsConfig } from '../config/matchVotesColumns.config.ts';

const tableListData = ref<any>([]);
const { t } = useI18n();
const tableListLoading = ref(false);
const voteTypeOption = Object.keys(QuizVoteTypeMap).map((v) => {
  return {
    label: QuizVoteTypeMap[v],
    value: Number(v),
  };
});

interface ISearch extends IQuizMatchVotes, IList<any> {}

// 定义让分详情接口 - 完全独立于顶层bureau_index的逻辑
interface ILetScoreDetail {
  bureau_index: number; // 这个是每局让分详情中的局数索引
  team1_fraction: number;
  team2_fraction: number;
}

const total = ref(0);
const pagination = usePage();

const edit = ref(false);

const showModal = ref(false);
const showForm = ref(false);
const match = ref({
  tax_rate: 0,
  team1: {
    team_logo: '',
    team_name: '',
  },
  team2: {
    team_logo: '',
    team_name: '',
  },
  bureau_number: null,
});

const params = ref<ISearch>({
  orderName: 'created_at',
  orderBy: 'desc',
});
const createColumns = (): TableColumns<IQuizMatchVotes> => {
  const action: TableColumns<IQuizMatchVotes> = [
    {
      title: '操作',
      key: 'actions',
      width: 100,
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
                  console.log('触发编辑', row);
                  find(row.id);
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
const scrollX = ref(0);
columns.forEach((item) => {
  if (item.width) {
    scrollX.value += Number(item.width);
  }
});

function lotteryOpen() {
  formData.value.votes_type = undefined;
  formData.value.bureau_index = undefined;
  formData.value.let_score_detail = [];
  tableListData.value.forEach((itemOut) => {
    // 判断是否为“单局让分”或其他需要顶层bureau_index的类型
    if (
      [QuizVoteType.bureauLetBall, QuizVoteType.oddPurchase].includes(
        itemOut.votes_type
      )
    ) {
      bureauNumberOption.value.forEach((item) => {
        if (item.value === itemOut.bureau_index) {
          item['disabled'] = true;
        }
      });
    } else {
      // 其他情况都智能出现一种选项，所以需要禁止
      voteTypeOption.forEach((item) => {
        if (itemOut.votes_type === item.value) {
          item['disabled'] = true;
        }
      });
    }
  });
  showForm.value = true;
}

async function ajaxFetchList(args) {
  try {
    tableListLoading.value = true;
    const res: any = await fetchQuizMatchVotes(args);
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
    match_id: formData.value.match_id,
    pageSize: pagination.pageSize,
    nowPage: currentPage,
  });
}

const initFormData = (matchInfo) => {
  showModal.value = true;
  formData.value = {
    team1_odds: 0,
    team2_odds: 0,
    team1_fraction: 0,
    team2_fraction: 0,
    votes_type: null,
    is_lock: false,
    match_id: matchInfo.match_id,
    bureau_index: null, // 顶层bureau_index，用于单局让分等类型
    reserve_price: 20,
    id: -1,
    maximum_differential: 300,
    let_score_detail: [], // 让分详情数组，用于大局让分类型
  };
  match.value = matchInfo;
  console.log('bureau_number', matchInfo);
  if (matchInfo.bureau_number) {
    bureauNumberOption.value = [];
    for (let i = 0; i < matchInfo.bureau_number; i += 1) {
      bureauNumberOption.value.push({
        label: `第${i + 1}局`,
        value: i,
      });
    }
  }
  handlePageChange(1);
  console.log('match', match.value);
};

defineExpose({
  initFormData,
});

const url = getBaseUrl();

const formRef = ref();
const isAutoFill = ref(false);
const bureauNumberOption = ref<any>([]);
const formData = ref<any>({
  team1_odds: 0,
  team2_odds: 0,
  team1_fraction: 0,
  team2_fraction: 0,
  votes_type: null,
  match_id: 0,
  is_lock: false,
  id: -1,
  bureau_index: null, // 顶层bureau_index，用于单局让分等类型
  reserve_price: null,
  maximum_differential: null,
  let_score_detail: [], // 让分详情数组，用于大局让分类型
});

// 新增：选择局数的弹窗相关状态
const showSelectBureauModal = ref(false);
const selectedBureauIndex = ref<number | null>(null);

// 计算是否可以添加更多让分记录
const canAddLetScoreDetail = computed(() => {
  if (!match.value.bureau_number || !formData.value.let_score_detail) {
    return false;
  }
  // 确保每局只能有一条记录
  const existingBureaus = new Set(
    formData.value.let_score_detail.map((item) => item.bureau_index)
  );
  const availableBureaus: number[] = [];

  // 查找还没有添加让分记录的局数
  const bureauNumber = match.value.bureau_number as unknown as number;
  for (let i = 0; i < bureauNumber; i += 1) {
    if (!existingBureaus.has(i)) {
      availableBureaus.push(i);
    }
  }

  return availableBureaus.length > 0;
});

// 获取可用的局数选项 - 新增
const availableBureauOptions = computed(() => {
  if (!match.value.bureau_number || !formData.value.let_score_detail) {
    return [];
  }

  const existingBureaus = new Set(
    formData.value.let_score_detail.map((item) => item.bureau_index)
  );
  const options: any[] = [];

  const bureauNumber = match.value.bureau_number as unknown as number;
  for (let i = 0; i < bureauNumber; i += 1) {
    if (!existingBureaus.has(i)) {
      options.push({
        label: `第${i + 1}局`,
        value: i,
      });
    }
  }

  return options;
});

// 打开选择局数弹窗 - 新增
const openSelectBureauModal = () => {
  if (!canAddLetScoreDetail.value) return;
  selectedBureauIndex.value = null;
  showSelectBureauModal.value = true;
};

// 添加让分详情 - 修改为使用用户选择的局数
const addLetScoreDetail = () => {
  if (selectedBureauIndex.value === null) return;

  const newDetail: ILetScoreDetail = {
    bureau_index: selectedBureauIndex.value, // 使用用户选择的局数索引
    team1_fraction: 0,
    team2_fraction: 0,
  };

  formData.value.let_score_detail.push(newDetail);
  showSelectBureauModal.value = false;
  selectedBureauIndex.value = null;
};

// 删除让分详情
const removeLetScoreDetail = (index: number) => {
  formData.value.let_score_detail.splice(index, 1);
};

async function find(id) {
  if (id) {
    const res = await fetchQuizMatchVotesById(id);
    if (res.code !== 200) return;
    const row = res.data;
    showForm.value = true;
    edit.value = true;
    Object.keys(formData.value).forEach((v) => {
      switch (v) {
        case 'created_at':
        case 'updated_at':
        case 'deleted_at':
          return;
        case 'let_score_detail':
          // 特殊处理让分详情，确保是数组格式
          formData.value[v] = row[v] && Array.isArray(row[v]) ? row[v] : [];
          break;
        default:
          formData.value[v] = Number(row[v]);
      }
    });
    console.log('formData', formData.value);
  }
}

async function submitForm() {
  try {
    // 显式验证表单
    await formRef.value?.validate();

    let res;
    // 确保let_score_detail字段存在且为数组
    if (!formData.value.let_score_detail) {
      formData.value.let_score_detail = [];
    }

    // 对于大局让分类型，确保顶层bureau_index为空
    if (formData.value.votes_type === QuizVoteType.overGameLetBall) {
      formData.value.bureau_index = null;
      // 过滤掉队伍1和队伍2让分都为0的记录
      formData.value.let_score_detail = formData.value.let_score_detail.filter(
        (item) => item.team1_fraction !== 0 || item.team2_fraction !== 0
      );
    }

    if (formData.value.id !== -1) {
      res = await editQuizMatchVotes(formData.value);
      if (res.code === 200) {
        window.$message.success('修改成功');
      }
    } else {
      res = await addQuizMatchVotes(formData.value);
      if (res.code === 200) {
        window.$message.success('添加成功');
      }
    }
    handlePageChange(1);
    showForm.value = false;
  } catch (errors) {
    // 表单验证失败，错误信息会自动显示
    console.log('表单验证失败:', errors);
  }
}

function handleTeam1OddsChange(v) {
  if (isAutoFill.value && match.value.tax_rate + v < 4) {
    formData.value.team2_odds = Number(
      (4 - match.value.tax_rate - v).toFixed(2)
    );
  }
}

function handleTeam2OddsChange(v) {
  if (isAutoFill.value && match.value.tax_rate + v < 4) {
    formData.value.team1_odds = Number(
      (4 - match.value.tax_rate - v).toFixed(2)
    );
  }
}

function handleTeam1FractionChange(v) {
  switch (formData.value.votes_type) {
    case QuizVoteType.letBall:
    case QuizVoteType.bureauLetBall:
    case QuizVoteType.oddPurchase:
    case QuizVoteType.overGameLetBall:
      formData.value.team2_fraction = -v;
      break;
    default:
      formData.value.team2_fraction = v;
  }
}

function handleTeam2FractionChange(v) {
  switch (formData.value.votes_type) {
    case QuizVoteType.letBall:
    case QuizVoteType.bureauLetBall:
    case QuizVoteType.oddPurchase:
    case QuizVoteType.overGameLetBall:
      formData.value.team1_fraction = -v;
      break;
    default:
      formData.value.team1_fraction = v;
  }
}

// 处理单个局数的队伍1让分变化
const handleBureauTeam1FractionChange = (index: number, v: number) => {
  formData.value.let_score_detail[index].team2_fraction = -v;
};

// 处理单个局数的队伍2让分变化
const handleBureauTeam2FractionChange = (index: number, v: number) => {
  formData.value.let_score_detail[index].team1_fraction = -v;
};

const formRules: any = {
  bureau_index: {
    required: true,
    message: '请选择该盘口为第几局',
    trigger: ['blur', 'change'],
    // 只对需要顶层bureau_index的类型进行验证
    validator: () => {
      const needBureauIndex = [
        QuizVoteType.bureauLetBall,
        QuizVoteType.oddPurchase,
      ].includes(formData.value.votes_type);
      return !needBureauIndex || formData.value.bureau_index !== null;
    },
  },
  reserve_price: [
    {
      required: true,
      message: '请输入底价/底分',
      trigger: ['blur', 'change'],
      // 只对需要reserve_price的类型进行验证
      validator: () => {
        const needReservePrice = ![
          QuizVoteType.overGameLetBall,
          QuizVoteType.bureauLetBall,
        ].includes(formData.value.votes_type);
        return !needReservePrice || formData.value.reserve_price !== null;
      },
    },
    {
      validator: (_, value) => {
        if (value === null || value === undefined || value === '') {
          return true;
        }
        return Number(value) >= 0.1;
      },
      message: '底价/底分必须大于或等于0.1',
      trigger: ['blur', 'change'],
    },
  ],
  maximum_differential: [
    {
      required: true,
      message: '请输入最大分差',
      trigger: ['blur', 'change'],
      // 只对oddPurchase类型进行验证
      validator: () => {
        return (
          formData.value.votes_type !== QuizVoteType.oddPurchase ||
          formData.value.maximum_differential !== null
        );
      },
    },
    {
      validator: (_: any, value: any) => {
        if (value === null || value === undefined || value === '') {
          return true;
        }
        return Number(value) >= 1;
      },
      message: '最大分差必须大于或等于1',
      trigger: ['blur', 'change'],
    },
  ],
  team1_odds: [
    {
      required: true,
      message: '请输入队伍1赔率',
      trigger: ['blur', 'change'],
      // 只对需要赔率的类型进行验证
      validator: () => {
        return (
          formData.value.votes_type === QuizVoteType.oddPurchase ||
          formData.value.team1_odds !== 0
        );
      },
    },
    {
      validator: (_, value) => {
        if (formData.value.votes_type === QuizVoteType.oddPurchase) {
          return true;
        }
        return Number(value) > 0;
      },
      message: '赔率必须大于0',
      trigger: ['blur', 'change'],
    },
  ],
  team2_odds: [
    {
      required: true,
      message: '请输入队伍2赔率',
      trigger: ['blur', 'change'],
      // 只对需要赔率的类型进行验证
      validator: () => {
        return (
          formData.value.votes_type === QuizVoteType.oddPurchase ||
          formData.value.team2_odds !== 0
        );
      },
    },
    {
      validator: (_, value) => {
        if (formData.value.votes_type === QuizVoteType.oddPurchase) {
          return true;
        }
        return Number(value) > 0;
      },
      message: '赔率必须大于0',
      trigger: ['blur', 'change'],
    },
  ],
  votes_type: {
    required: true,
    message: '请选择投票类型',
  },
};
</script>
<style scoped lang="scss">
.let-score-detail-container {
  width: 100%;
  margin-top: 16px;
}

.let-score-detail-header {
  display: flex;
  background-color: #f5f7fa;
  padding: 8px 0;
  margin-bottom: 8px;
  border-radius: 4px;
}

.header-item {
  flex: 1;
  text-align: center;
  font-weight: 600;
}

.let-score-detail-row {
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #e8e8e8;
}

.row-item {
  flex: 1;
  text-align: center;
}

.add-let-score-btn {
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-disabled-tip {
  margin-left: 12px;
  color: #8c8c8c;
  font-size: 14px;
}
</style>
