import { ILive, ILiveRoomLiveUser, IPaging } from '@/interface';
import request from '@/utils/request';

export function fetchLiveRoomOnlineUser(liveRoomId: number) {
  return request.get<ILiveRoomLiveUser[]>(
    `/live/live_room_online_user/${liveRoomId}`
  );
}

export function fetchAllLiveRoomOnlineUser() {
  return request.get<ILiveRoomLiveUser[]>(`/live/all_live_room_online_user`);
}

export function fetchLiveList(params) {
  return request.get<IPaging<ILive>>('/live/list', {
    params,
  });
}

export function fetchForwardList() {
  return request.get('/live/forward_list');
}

export function fetchKillForward(pid: number) {
  return request.post(`/live/kill_forward/${pid}`);
}

export function fetchCloseLiveByLiveRoomId(liveRoomId: number) {
  return request.post(`/live/close_live_by_live_room_id/${liveRoomId}`);
}

export function fetchLiveStartLive(data: {
  live_room_type: number;
  area_id?: number;
  area_name?: string;
  room_id?: number;
}) {
  return request.post(`/live/start_live`, data);
}

export function fetchLiveCloseMyLive(data: any) {
  return request.post(`/live/close_my_live`, data);
}

export function fetchLiveLiveRoomIsLive(liveRoomId: number) {
  return request.get<ILive | null>(`/live/live_room_is_live/${liveRoomId}`);
}
