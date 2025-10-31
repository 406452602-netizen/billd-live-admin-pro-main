import { h } from 'vue';

import { IQuizSeasons } from '@/interface';
import { getBaseUrl } from '@/utils/request';

import type { TableColumns } from 'naive-ui/es/data-table/src/interface';

const url = getBaseUrl();

// eslint-disable-next-line
export const columnsConfig = (_t): TableColumns<IQuizSeasons> => {
  return [
    {
      title: 'id',
      key: 'season_id',
      width: 100,
    },
    {
      title: '赛季名称',
      key: 'season_name',
      width: 200,
    },
    {
      title: '开始时间',
      key: 'start_date',
      width: 200,
    },
    {
      title: '结束时间',
      key: 'end_date',
      width: 200,
    },
    {
      title: 'logo',
      key: 'season_logo',
      align: 'center',
      render(row) {
        return h('img', {
          src: `${url}${row.season_logo}`,
          width: 150,
        });
      },
      width: 150,
    },
  ];
};
