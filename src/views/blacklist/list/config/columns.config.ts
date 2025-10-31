import { TableColumns } from 'naive-ui/es/data-table/src/interface';

import { blacklistTypeEnumMap } from '@/constant';
import { IBlacklist } from '@/interface';

// eslint-disable-next-line
export const columnsConfig = (_t): TableColumns<IBlacklist> => {
  return [
    {
      title: 'id',
      key: 'id',
      width: 100,
      align: 'center',
    },
    {
      title: '黑名单类型',
      key: 'type',
      width: 150,
      align: 'center',
      render(row) {
        return blacklistTypeEnumMap[row.type || -1];
      },
    },
    {
      title: 'ip',
      key: 'client_ip',
      width: 150,
      align: 'center',
    },
    {
      title: '直播间id',
      key: 'live_room_id',
      width: 150,
      align: 'center',
    },
    {
      title: '用户id',
      key: 'user_id',
      width: 150,
      align: 'center',
    },
    {
      title: '开始时间',
      key: 'start_date',
      width: 200,
      align: 'center',
    },
    {
      title: '结束时间',
      key: 'end_date',
      width: 200,
      align: 'center',
    },
    {
      title: '禁用提示语',
      key: 'msg',
      width: 200,
      align: 'center',
    },
    {
      title: '备注',
      key: 'remark',
      width: 200,
      align: 'center',
    },
    {
      title: '创建时间',
      key: 'created_at',
      width: 180,
      align: 'center',
      fixed: 'right',
    },
    {
      title: '最后更新',
      key: 'updated_at',
      width: 180,
      align: 'center',
      fixed: 'right',
    },
  ];
};
