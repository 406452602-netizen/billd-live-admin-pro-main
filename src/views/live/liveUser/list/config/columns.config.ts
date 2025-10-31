import { TableColumns } from 'naive-ui/es/data-table/src/interface';

import { ILiveRoomLiveUser } from '@/interface';

// eslint-disable-next-line
export const columnsConfig = (_t): TableColumns<ILiveRoomLiveUser> => [
  {
    title: '直播间id',
    key: 'live_room_id',
    align: 'center',
    width: 150,
  },
  {
    title: '用户id',
    key: 'user_id',
    align: 'center',
    width: 150,
  },
  {
    title: '用户名',
    key: 'user_username',
    align: 'center',
    width: 150,
  },
  {
    title: '直播间标题',
    key: 'live_room_title',
    align: 'center',
    width: 200,
  },
];
