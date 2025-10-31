import { NButton } from 'naive-ui';
import { h } from 'vue';

// import type { IQuizPayoutsStatistics } from '@/interface';

import type { TableColumns } from 'naive-ui/es/data-table/src/interface';

export const columnsConfig = (
  _t,
  userIdClick,
  memberIdClick
): TableColumns<any> => {
  return [
    {
      title: '用户id',
      key: 'id',
      align: 'center',
      width: 80,
      render(row) {
        return h(
          NButton,
          {
            size: 'small',
            type: 'primary',
            text: true,
            onClick: () => userIdClick(row),
          },
          { default: () => row.user_id }
        );
      },
    },
    {
      title: '会员数量',
      key: 'lower_level_member_count',
      align: 'center',
      width: 80,
      render(row) {
        return h(
          NButton,
          {
            size: 'small',
            type: 'primary',
            text: true,
            onClick: () => memberIdClick(row),
          },
          { default: () => row.member_count }
        );
      },
    },
    {
      title: '用户名',
      key: 'user_name',
      align: 'center',
      width: 100,
    },
    {
      title: '上级收交',
      key: 'parent_divided_into',
      align: 'center',
      render(row) {
        return row.user_id == 1
          ? '-'
          : Number(row.lower_level_amount_result) +
              Number(row.user_amount_result);
      },
      // width: 150,
    },
    {
      title: '可获收益',
      key: 'amount_result',
      align: 'center',
      // width: 150,
      render(row) {
        return row.is_agent ? row.user_amount_result : '-';
      },
    },
    {
      title: '下级交收',
      key: 'lower_level_amount_result',
      align: 'center',
      // width: 150,
      render(row) {
        return row.is_agent ? -row.lower_level_amount_result : '-';
      },
    },
    {
      title: '下级总流水',
      key: 'lower_level_flow',
      align: 'center',
      // width: 150,
      render(row) {
        return row.is_agent ? row.lower_level_flow : '-';
      },
    },
    {
      title: '下级实际总流水',
      key: 'lower_level_actual_flow',
      align: 'center',
      render(row) {
        return row.is_agent ? row.lower_level_actual_flow : '-';
      },
      // width: 150,
      // render(row) {
      //   return row.sum_parent_divided_into;
      // },
    },
    {
      title: '下级总输赢(结算总和)',
      key: 'lower_level_amount_result',
      align: 'center',
      render(row) {
        return row.is_agent ? row.lower_level_total_win_lose : '-';
      },
      // width: 150,
      // render(row) {
      //   return row.sum_parent_divided_into;
      // },
    },
    {
      title: '是否为代理',
      key: 'is_agent',
      align: 'center',
      width: 150,
      render(row) {
        return row.is_agent ? '代理商' : '会员';
      },
    },
    {
      title: '代理占比',
      key: 'agent_account_for',
      align: 'center',
      width: 80,
      render(row) {
        if (row.is_agent && row.agent_ratio) {
          const accountFor = Number(row.agent_ratio) * 100;
          return `${accountFor}%`;
        } else {
          return '无';
        }
      },
    },
    // {
    //   title: '上级结果',
    //   key: 'user_payout_amount',
    //   align: 'center',
    //   width: 150,
    // },
    // {
    //   title: '代理商结果',
    //   key: 'agent_payout_amount',
    //   align: 'center',
    //   width: 150,
    // },
    // {
    //   title: '代理用户投注数量',
    //   key: 'agent_vip_vote_count',
    //   align: 'center',
    //   width: 150,
    // },
    // {
    //   title: '代理用户下注金额',
    //   key: 'agent_vip_vote_bet',
    //   align: 'center',
    //   width: 150,
    // },
    //
    // {
    //   title: '代理用户有效金额',
    //   key: 'agent_vip_vote_bet_effective',
    //   align: 'center',
    //   width: 150,
    // },
  ];
};
