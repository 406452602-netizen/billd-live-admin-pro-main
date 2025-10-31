import { IBank } from '@/interface.ts';

import type { TableColumns } from 'naive-ui/es/data-table/src/interface';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const columnsConfig = (_t): TableColumns<IBank> => {
  return [
    {
      title: 'ID',
      key: 'id',
      width: 80,
    },
    {
      title: '银行名称',
      key: 'bank_name',
    },
    {
      title: '是否国内银行',
      key: 'is_domestic',
      render: (row) => (row.is_domestic === 1 ? '是' : '否'),
    },
    {
      title: '是否为虚拟银行',
      key: 'type',
      render: (row) => (row.type === 1 ? '是' : '否'),
    },
  ];
};
