import { IQuizMatchGoals } from '@/interface';

import type { TableColumns } from 'naive-ui/es/data-table/src/interface';

// eslint-disable-next-line
export const columnsConfig = (): TableColumns<IQuizMatchGoals> => {
  return [
    {
      title: 'id',
      key: 'goal_id',
      align: 'center',
      width: 80,
    },
    {
      title: '进球分数',
      key: 'goals_num',
      align: 'center',
    },
    {
      title: '进球球员姓名',
      key: 'scorer_name',
      align: 'center',
    },
    {
      title: '进球时间',
      key: 'goal_time',
      align: 'center',
    },
    {
      title: '创建时间',
      key: 'created_at',
      width: 200,
    },
  ];
};
