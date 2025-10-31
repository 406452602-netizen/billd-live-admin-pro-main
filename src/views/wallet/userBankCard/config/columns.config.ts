import { IUserBankCard } from '@/interface';

import type { TableColumns } from 'naive-ui/es/data-table/src/interface';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const columnsConfig = (_t): TableColumns<IUserBankCard> => {
  return [
    {
      title: 'ID',
      key: 'id',
      width: 80,
    },
    {
      title: '银行卡号',
      key: 'card_number',
    },
    {
      title: '银行卡持有人',
      key: 'holder_name',
    },
    {
      title: '所属银行',
      key: 'bank.bank_name',
    },
  ];
};
