import { IWsUserMessage } from '@/interface.ts';
import request from '@/utils/request.ts';

export function getLastMessages(userId) {
  return request.instance({
    url: `/ws_user_message/getLastMessagesByTargetUserId/${userId}`,
    method: 'get',
  });
}

export function fetchWsKeepJoined(data) {
  return request.post('/ws/keep_joined', data);
}

export function fetchWsJoin(data) {
  return request.post('/ws/join', data);
}

export function fetchWsSendUserMsg(data) {
  return request.post('/ws/send_user_msg', data);
}

export function fetchWsSendMsg(data) {
  return request.post('/ws/send_msg', data);
}

export function fetchWsGetWsInfo() {
  return request.get('/ws/get_ws_info');
}

export function fetchGetWsUserMessageList(data: IWsUserMessage) {
  return request.post('/ws_user_message/customerService/list', data);
}
