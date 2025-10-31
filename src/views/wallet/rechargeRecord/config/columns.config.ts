import { auditStatusEnumMap } from '@/constant.ts';
import { IRechargeRecord } from '@/interface.ts';

import type { TableColumns } from 'naive-ui/es/data-table/src/interface';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const columnsConfig = (_t): TableColumns<IRechargeRecord> => {
  return [
    {
      title: 'ID',
      key: 'id',
      width: 80,
    },
    {
      title: '金额',
      key: 'amount',
    },
    {
      title: '充值用户账号',
      key: 'user.username',
    },
    {
      title: '充值用户id',
      key: 'user.id',
    },
    {
      title: '状态',
      key: 'status',
      render(row) {
        return auditStatusEnumMap[row.status!];
      },
    },
  ];
};
