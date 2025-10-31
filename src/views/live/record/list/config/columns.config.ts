import { TableColumns } from 'naive-ui/es/data-table/src/interface';

import { ClientAppMap, ClientEnvMap } from '@/constant';
import { ILiveRecord } from '@/interface';
import { convertToTime } from '@/utils';

// eslint-disable-next-line
export const columnsConfig = (_t): TableColumns<ILiveRecord> => [
  {
    title: 'id',
    key: 'id',
    align: 'center',
    width: 100,
  },
  {
    title: '直播分区',
    key: 'area_name',
    align: 'center',
    width: 150,
  },
  {
    title: '直播间id',
    key: 'live_room_id',
    align: 'center',
    width: 100,
  },
  {
    title: '直播间标题',
    key: 'live_room_title',
    align: 'center',
    width: 200,
    render(row) {
      return row.live_room?.title;
    },
  },
  {
    title: '直播用户id',
    key: 'user_id',
    align: 'center',
    width: 100,
  },
  {
    title: '直播用户名',
    key: 'user_name',
    align: 'center',
    width: 150,
    render(row) {
      return row.user?.username;
    },
  },
  {
    title: '观看数',
    key: 'view',
    align: 'center',
    width: 100,
  },
  {
    title: '弹幕数',
    key: 'danmu',
    align: 'center',
    width: 100,
  },
  {
    title: '直播时长',
    key: 'duration',
    align: 'center',
    width: 100,
    render(row) {
      return convertToTime(row.duration || 0);
    },
  },
  {
    title: 'ip',
    key: 'client_ip',
    align: 'center',
    width: 200,
  },
  {
    title: '客户端环境',
    key: 'client_env',
    align: 'center',
    width: 200,
    render(row) {
      return ClientEnvMap[row.client_env!];
    },
  },
  {
    title: '客户端app',
    key: 'client_app',
    align: 'center',
    width: 200,
    render(row) {
      return ClientAppMap[row.client_app!];
    },
  },
  {
    title: '客户端app版本',
    key: 'client_app_version',
    align: 'center',
    width: 200,
  },
  {
    title: '备注',
    key: 'remark',
    align: 'center',
    width: 200,
  },
  {
    title: '直播开始时间',
    key: 'start_time',
    align: 'center',
    width: 200,
    fixed: 'right',
  },
  {
    title: '直播结束时间',
    key: 'end_time',
    align: 'center',
    width: 200,
    fixed: 'right',
  },
];
