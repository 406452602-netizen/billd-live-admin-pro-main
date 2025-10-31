import { IQuizMatches } from '@/interface';

import type { TableColumns } from 'naive-ui/es/data-table/src/interface';

// eslint-disable-next-line
export const columnsConfig = (_t): TableColumns<IQuizMatches> => {
  return [
    {
      title: 'id',
      key: 'match_id',
      width: 100,
    },
    {
      title: '比赛名称',
      key: 'match_name',
      width: 200,
    },
    {
      title: '比赛队伍',
      key: 'team1.team_name',
      width: 200,
    },
    {
      title: '比赛队伍',
      key: 'team2.team_name',
      width: 200,
    },
    {
      title: '开始时间',
      key: 'start_time',
      width: 200,
    },
    {
      title: '比赛赛季',
      key: 'seasons.season_name',
      width: 200,
    },
    {
      title: '结束时间',
      key: 'end_time',
      width: 200,
    },
    {
      title: '获胜队伍',
      key: 'winTeam.team_name',
      width: 200,
    },
  ];
};
