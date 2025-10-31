import type { IQuizMatchTypes } from '@/interface';

import type { TableColumns } from 'naive-ui/es/data-table/src/interface';

// eslint-disable-next-line
export const columnsConfig = (_t): TableColumns<IQuizMatchTypes> => {
  return [
    {
      title: 'ID',
      key: 'id',
      width: 100,
    },
    {
      title: '比赛类型名称',
      key: 'type_name',
      width: 200,
    },
  ];
};
