import { QuizVoteTypeMap } from '@/constant.ts';
import { IQuizMatchVotes } from '@/interface';

import type { TableColumns } from 'naive-ui/es/data-table/src/interface';

// eslint-disable-next-line
export const columnsConfig = (_t): TableColumns<IQuizMatchVotes> => {
  return [
    {
      title: '比赛id',
      key: 'match_id',
      width: 100,
    },
    {
      title: '主场赔率',
      key: 'team1_odds',
      width: 100,
    },
    {
      title: '客场赔率',
      key: 'team2_odds',
      width: 100,
    },
    {
      title: '球/分',
      key: 'team1_fraction',
      width: 100,
    },
    {
      title: '球/分',
      key: 'team2_fraction',
      width: 100,
    },
    {
      title: '开盘类型',
      key: 'votes_type',
      render(row) {
        return QuizVoteTypeMap[row.votes_type!];
      },
      width: 100,
    },
  ];
};
