import { NButton } from 'naive-ui';
import { h } from 'vue';

import type { TableColumns } from 'naive-ui/es/data-table/src/interface';

export const columnsConfig = (_t, userIdClick): TableColumns<any> => {
  return [
    {
      title: '用户id',
      key: 'user_id',
      align: 'center',
      width: 80,
      render(row) {
        return h(
          NButton,
          {
            size: 'small',
            type: 'primary',
            text: true,
            onClick: () => userIdClick({ id: row.user_id }),
          },
          { default: () => row.user_id }
        );
      },
    },
    {
      title: '用户名',
      key: 'username',
      align: 'center',
      width: 120,
      render(row) {
        return row.username || '-';
      },
    },
    {
      title: '竞猜总流水',
      key: 'quiz_total_flow',
      align: 'center',
      width: 120,
      render(row) {
        return row.quiz?.total_flow || 0;
      },
    },
    {
      title: '竞猜总盈亏',
      key: 'quiz_total_profit',
      align: 'center',
      width: 120,
      render(row) {
        return (
          Number(row.quiz?.total_flow) - Number(row.quiz?.total_profit) || 0
        );
      },
    },
  ];
};
