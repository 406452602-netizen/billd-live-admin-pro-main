import { auditStatusEnumMap } from '@/constant.ts';
import { IWithdrawalRecord } from '@/interface';

import type { TableColumns } from 'naive-ui/es/data-table/src/interface';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const columnsConfig = (_t): TableColumns<IWithdrawalRecord> => {
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
      title: '银行卡号',
      key: 'bankCard.card_number',
    },
    {
      title: '银行卡持有人',
      key: 'bankCard.holder_name',
    },
    {
      title: '所属银行',
      key: 'bankCard.bank.bank_name',
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
      render: (row) => {
        return auditStatusEnumMap[row.status!];
      },
    },
  ];
};
