import { TableColumns } from 'naive-ui/es/data-table/src/interface';

import { InviteAgentMap } from '@/constant.ts';
import { IInviteAgent } from '@/interface';

// eslint-disable-next-line
export const columnsConfig = (_t): TableColumns<IInviteAgent> => {
  return [
    {
      title: '邀请码',
      key: 'invite_code',
      align: 'center',
      width: 100,
      fixed: 'left',
    },
    {
      title: '代理人比例',
      key: 'agent_account_for',
      align: 'center',
      ellipsis: {
        tooltip: true,
      },
      width: 100,
    },
    {
      title: '邀请码类型',
      key: 'invite_class',
      align: 'center',
      width: 100,
      render(row: any) {
        return InviteAgentMap[row.invite_class];
      },
    },
    {
      title: '是否有效',
      key: 'is_valid',
      align: 'center',
      width: 100,
      fixed: 'right',
      render(row) {
        return row.is_valid ? '有效' : '无效';
      },
    },
    {
      title: '过期时间',
      key: 'expiration_time',
      align: 'center',
      width: 200,
      fixed: 'right',
    },
  ];
};
