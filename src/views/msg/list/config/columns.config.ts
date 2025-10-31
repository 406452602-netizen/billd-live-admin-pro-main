import { TableColumns } from 'naive-ui/es/data-table/src/interface';

import {
  ClientAppMap,
  ClientEnvMap,
  msgContentTypeMap,
  msgTypeMap,
} from '@/constant';
import { IMsg } from '@/interface';

// eslint-disable-next-line
export const columnsConfig = (_t): TableColumns<IMsg> => [
  {
    title: 'id',
    key: 'id',
    align: 'center',
    width: 100,
    fixed: 'left',
  },
  {
    title: '消息类型',
    key: 'msg_type',
    align: 'center',
    width: 100,
    render(row) {
      return msgTypeMap[row.msg_type!];
    },
  },
  {
    title: '直播间id',
    key: 'live_room_id',
    align: 'center',
    width: 150,
  },
  {
    title: '直播记录id',
    key: 'live_record_id',
    align: 'center',
    width: 150,
  },
  {
    title: '用户名',
    key: 'username',
    align: 'center',
    width: 150,
  },
  {
    title: '原用户名',
    key: 'origin_username',
    align: 'center',
    width: 150,
  },
  {
    title: '内容',
    key: 'content',
    align: 'center',
    width: 150,
  },
  {
    title: '原内容',
    key: 'origin_content',
    align: 'center',
    width: 150,
  },
  {
    title: '内容类型',
    key: 'content_type',
    align: 'center',
    width: 100,
    render(row) {
      return msgContentTypeMap[row.content_type!];
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
    width: 150,
  },
  {
    title: '发送时间',
    key: 'send_msg_time',
    align: 'center',
    width: 200,
    fixed: 'right',
  },
];
