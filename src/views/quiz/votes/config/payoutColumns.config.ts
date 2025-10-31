import type { IQuizPayouts } from '@/interface';

import type { TableColumns } from 'naive-ui/es/data-table/src/interface';

// eslint-disable-next-line
export const payoutColumnsConfig = (_t): TableColumns<IQuizPayouts> => {
  return [
    {
      title: '收益用户id',
      key: 'payouts_user_id',
      align: 'center',
      width: 100,
    },
    {
      title: '收益账号',
      key: 'user.username',
      align: 'center',
      width: 180,
    },
    {
      title: '收益金额',
      key: 'payout_amount',
      align: 'center',
      width: 180,
    },
    {
      title: '收益占比',
      key: 'profit_ratio',
      align: 'center',
      width: 80,
    },
  ];
};
