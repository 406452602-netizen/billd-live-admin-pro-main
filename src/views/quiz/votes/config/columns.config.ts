import { QuizVoteTypeMap, VoteResultMap } from '@/constant.ts';
import type { IQuizVotes } from '@/interface';

import type { TableColumns } from 'naive-ui/es/data-table/src/interface';

// eslint-disable-next-line
export const columnsConfig = (_t): TableColumns<IQuizVotes> => {
  return [
    {
      title: 'A队',
      key: 'match.team1.team_name',
      align: 'center',
      width: 150,
    },
    {
      title: 'B队',
      key: 'match.team2.team_name',
      align: 'center',
      width: 150,
    },
    {
      title: '赔率',
      key: 'odds',
      align: 'center',
      width: 200,
    },
    {
      title: '让球数量/分数',
      key: 'handicap',
      align: 'center',
      width: 100,
    },
    {
      title: '下注金额',
      key: 'vote_amount',
      align: 'center',
      width: 200,
    },
    {
      title: '下注类型',
      key: 'votes_type',
      align: 'center',
      width: 200,
      render(row) {
        return QuizVoteTypeMap[row.votes_type!];
      },
    },

    {
      title: '结果',
      key: 'result_amount',
      align: 'center',
      width: 200,
    },
    {
      title: '收益',
      key: 'net_profit_amount',
      align: 'center',
      width: 200,
    },
    {
      title: '投票结果',
      key: 'prize_winner',
      align: 'center',
      width: 80,
      render(row) {
        if (typeof row.prize_winner === 'number') {
          return VoteResultMap[row.prize_winner];
        } else {
          return '未结算';
        }
      },
    },
  ];
};
