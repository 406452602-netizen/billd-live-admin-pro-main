import { h } from 'vue';

import { IQuizTeams } from '@/interface';
import { getBaseUrl } from '@/utils/request';

import type { TableColumns } from 'naive-ui/es/data-table/src/interface';

const url = getBaseUrl();

// eslint-disable-next-line
export const columnsConfig = (_t): TableColumns<IQuizTeams> => {
  return [
    {
      title: 'id',
      key: 'team_id',
      width: 100,
    },
    {
      title: '队伍名称',
      key: 'team_name',
      width: 200,
    },
    {
      title: 'logo',
      key: 'team_logo',
      align: 'center',
      render(row) {
        return h('img', {
          src: `${url}${row.team_logo}`,
          width: 150,
        });
      },
      width: 150,
    },
  ];
};
