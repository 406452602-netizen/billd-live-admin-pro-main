import { IGameConsumptionRecord } from '@/interface';

import type { TableColumns } from 'naive-ui/es/data-table/src/interface';

/**
 * 表格列配置
 * @param _t 国际化函数
 * @returns 表格列配置数组
 */
// eslint-disable-next-line
export function columnsConfig(_t): TableColumns<IGameConsumptionRecord> {
  return [
    {
      title: '用户ID',
      key: 'user_id',
      width: 120,
      fixed: 'left',
    },
    {
      title: '游戏订单号',
      key: 'game_order',
      width: 200,
    },
    {
      title: '游戏名',
      key: 'game.game_name',
      width: 100,
    },
    {
      title: '消费金额',
      key: 'consumption_amount',
      width: 120,
      render(row) {
        return `¥${row.consumption_amount}`;
      },
    },
    {
      title: '结算金额',
      key: 'settlement_amount',
      align: 'center',
      width: 120,
      render(row) {
        return row.settlement_amount !== null
          ? `¥${row.settlement_amount}`
          : '-';
      },
    },
    {
      title: '消费时间',
      key: 'consumption_time',
      width: 180,
    },
    {
      title: '结算时间',
      key: 'settlement_time',
      width: 140,
    },
    {
      title: '结果',
      key: 'result',
      width: 250,
    },
    {
      title: '创建时间',
      key: 'created_at',
      width: 200,
    },
  ];
}
