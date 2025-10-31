import { getRandomString } from 'billd-utils';
import { onUnmounted, ref } from 'vue';

import {
  fetchWsGetWsInfo,
  fetchWsKeepJoined,
  fetchWsSendMsg,
  fetchWsSendUserMsg,
} from '@/api/wsMessage';
import { IM_NAMESPACE } from '@/constant.ts';
import {
  DanmuMsgTypeEnum,
  IWsMessage,
  IWsUserMessage,
  WsMessageContentTypeEnum,
  WsMessageIsBilibiliEnum,
} from '@/interface';
import { useAppStore } from '@/store/app';
import { useNetworkStore } from '@/store/network';
import {
  WsConnectStatusEnum,
  WsJoinType,
  WsLeavedType,
  WsMessageType,
  WsMsgTypeEnum,
  WsOtherJoinType,
  WsUserMessageType,
} from '@/types/websocket';
import {
  WebSocketClass,
  prettierReceiveWsMsg,
} from '@/utils/network/webSocket';

export const useWebsocketIm = () => {
  const appStore = useAppStore();
  const networkStore = useNetworkStore();

  const connectStatus = ref<WsConnectStatusEnum>();
  const roomId = ref('');
  const keepJoinedTimer = ref();
  const danmuList = ref<any[]>([]);
  const danmukuList = ref<IWsMessage[]>([]);
  const userMsgList = ref<IWsUserMessage[]>([]);
  const joinedDelay = 5000;
  const uuid = ref('');

  onUnmounted(() => {
    clearInterval(keepJoinedTimer.value);
  });

  const sendDanmuTxt = (txt: string) => {
    if (!txt.trim().length) {
      window.$message.warning('请输入弹幕内容！');
      return;
    }

    const instance = networkStore.imWsMap.get(roomId.value);
    if (!instance) return;
    const messageData: WsMessageType['data'] = {
      content: txt,
      content_type: WsMessageContentTypeEnum.txt,
      msg_type: DanmuMsgTypeEnum.danmu,
      live_room_id: Number(roomId.value),
      is_bilibili: WsMessageIsBilibiliEnum.no,
      send_msg_time: +new Date(),
    };
    fetchWsSendMsg(messageData);
  };

  const sendUserDanmuTxt = (
    txt: string,
    targetUserId: number,
    sessionId: number
  ) => {
    if (!txt.trim().length) {
      window.$message.warning('请输入弹幕内容！');
      return;
    }

    const instance = networkStore.chatImMap.get(roomId.value);
    console.log(instance, networkStore.chatImMap);
    if (!instance) return;
    const messageData: WsUserMessageType['data'] = {
      content: txt,
      target_user_id: targetUserId,
      ws_user_contact_id: sessionId,
      send_message_time: +new Date(),
    };
    fetchWsSendUserMsg(messageData);
  };

  const sendDanmuImg = (url: string) => {
    if (!url.trim().length) {
      window.$message.warning('图片不能为空！');
      return;
    }
    const instance = networkStore.imWsMap.get(roomId.value);
    if (!instance) return;
    const messageData: WsMessageType['data'] = {
      content: url,
      content_type: WsMessageContentTypeEnum.img,
      msg_type: DanmuMsgTypeEnum.danmu,
      live_room_id: Number(roomId.value),
      is_bilibili: WsMessageIsBilibiliEnum.no,
      send_msg_time: +new Date(),
    };
    fetchWsSendMsg(messageData);
  };

  const sendDanmuReward = (txt: string) => {
    if (!txt.trim().length) {
      window.$message.warning('请输入弹幕内容！');
      return;
    }
    const instance = networkStore.imWsMap.get(roomId.value);
    if (!instance) return;
    const messageData: WsMessageType['data'] = {
      content: txt,
      content_type: WsMessageContentTypeEnum.txt,
      msg_type: DanmuMsgTypeEnum.reward,
      live_room_id: Number(roomId.value),
      is_bilibili: WsMessageIsBilibiliEnum.no,
      send_msg_time: +new Date(),
    };
    fetchWsSendMsg(messageData);
  };

  function handleHeartbeat() {}

  function sendJoin() {
    const instance = networkStore.imWsMap.get(roomId.value);
    const userInstance = networkStore.chatImMap.get(roomId.value);
    console.log('sendJoin', instance, userInstance);
    if (instance) {
      try {
        // await fetchWsJoin({
        //   user_id: userStore.userInfo?.id,
        //   // session_id: getRandomString(10),
        //   host: instance.host,
        //   socket_id: instance.socketIo?.id,
        //   live_room_id: Number(roomId.value),
        //   duration: joinedDelay / 1000,
        // });
        instance.send<WsJoinType['data']>({
          requestId: getRandomString(8),
          msgType: WsMsgTypeEnum.join,
          data: {
            live_room_id: Number(roomId.value),
            cluster_id:
              appStore.wsInfo?.host_list[appStore.wsInfo.index].id || '',
            duration: joinedDelay / 1000,
            uuid: uuid.value,
          },
        });
      } catch (error) {
        console.error(error);
      }
    } else if (userInstance) {
      userInstance.send<WsJoinType['data']>({
        requestId: getRandomString(8),
        msgType: WsMsgTypeEnum.join,
        data: {
          live_room_id: roomId.value,
          cluster_id:
            appStore.wsInfo?.host_list[appStore.wsInfo.index].id || '',
          duration: joinedDelay / 1000,
          uuid: uuid.value,
        },
      });
    }
  }

  function initReceive() {
    const ws = networkStore.imWsMap.get(roomId.value);
    const userWs = networkStore.chatImMap.get(roomId.value);
    if (ws?.socketIo) {
      // websocket连接成功
      ws.socketIo.on(WsConnectStatusEnum.connect, () => {
        prettierReceiveWsMsg(WsConnectStatusEnum.connect, ws.socketIo);
        handleHeartbeat();
        if (!ws) return;
        connectStatus.value = WsConnectStatusEnum.connect;
        ws.status = WsConnectStatusEnum.connect;
        ws.update();
        sendJoin();
      });

      // websocket连接断开
      ws.socketIo.on(WsConnectStatusEnum.disconnect, (err) => {
        prettierReceiveWsMsg(WsConnectStatusEnum.disconnect, ws);
        console.log('websocket连接断开', err);
        clearInterval(keepJoinedTimer.value);
        if (!ws) return;
        ws.status = WsConnectStatusEnum.disconnect;
        ws.update();
      });

      // 收到用户发送消息
      ws.socketIo.on(WsMsgTypeEnum.message, (data: WsMessageType['data']) => {
        prettierReceiveWsMsg(WsMsgTypeEnum.message, data);
        // @ts-ignore
        data.send_msg_time = new Date(data.send_msg_time!).toLocaleString();
        danmuList.value.push(data);
        danmukuList.value.push(data);
        userMsgList.value.push(data);
      });

      // 用户加入房间完成
      ws.socketIo.on(WsMsgTypeEnum.joined, (data: WsJoinType['data']) => {
        prettierReceiveWsMsg(WsMsgTypeEnum.joined, data);
        keepJoinedTimer.value = setInterval(() => {
          fetchWsKeepJoined({
            live_room_id: Number(roomId.value),
            duration: joinedDelay / 1000,
            cluster_id:
              appStore.wsInfo?.host_list[appStore.wsInfo.index].id || '',
            uuid: uuid.value,
          })
            .then((res) => {
              console.log('fetchWsKeepJoined', res);
            })
            .catch((err) => {
              console.log('fetchWsKeepJoined-err', err);
            });
        }, joinedDelay);
      });

      // 其他用户加入房间
      ws.socketIo.on(
        WsMsgTypeEnum.otherJoin,
        (data: WsOtherJoinType['data']) => {
          prettierReceiveWsMsg(WsMsgTypeEnum.otherJoin, data);
          if (data.join_socket_id !== ws.socketIo?.id) {
            const danmu: IWsMessage = {
              username: data.join_user_info?.username,
              send_msg_time: +new Date(),
              live_room_id: data.live_room_id!,
              id: -1,
              content: '',
              content_type: WsMessageContentTypeEnum.txt,
              msg_type: DanmuMsgTypeEnum.otherJoin,
            };
            danmuList.value.push(danmu);
          }
        }
      );

      // 用户离开房间
      ws.socketIo.on(WsMsgTypeEnum.leave, (data) => {
        prettierReceiveWsMsg(WsMsgTypeEnum.leave, data);
      });

      // 用户离开房间完成
      ws.socketIo.on(WsMsgTypeEnum.leaved, (data: WsLeavedType['data']) => {
        prettierReceiveWsMsg(WsMsgTypeEnum.leaved, data);
        console.log('用户离开房间完成', data);
        networkStore.removeRtc(data.socket_id);
        danmuList.value.push({
          ...data,
          send_msg_time: +new Date(),
          live_room_id: Number(roomId.value),
          id: -1,
          content: '',
          content_type: WsMessageContentTypeEnum.txt,
          msg_type: DanmuMsgTypeEnum.userLeaved,
        });
      });
    } else if (userWs?.socketIo) {
      // websocket连接成功
      userWs.socketIo.on(WsConnectStatusEnum.connect, () => {
        prettierReceiveWsMsg(WsConnectStatusEnum.connect, userWs.socketIo);
        handleHeartbeat();
        if (!userWs) return;
        connectStatus.value = WsConnectStatusEnum.connect;
        userWs.status = WsConnectStatusEnum.connect;
        userWs.update();
        sendJoin();
      });

      // websocket连接断开
      userWs.socketIo.on(WsConnectStatusEnum.disconnect, (err) => {
        prettierReceiveWsMsg(WsConnectStatusEnum.disconnect, userWs);
        console.log('websocket连接断开', err);
        clearInterval(keepJoinedTimer.value);
        if (!userWs) return;
        userWs.status = WsConnectStatusEnum.disconnect;
        userWs.update();
      });

      // 收到用户发送消息
      userWs.socketIo.on(
        WsMsgTypeEnum.message,
        (data: WsMessageType['data']) => {
          prettierReceiveWsMsg(WsMsgTypeEnum.message, data);
          // @ts-ignore
          data.send_msg_time = new Date(data.send_msg_time!).toLocaleString();
          danmuList.value.push(data);
          danmukuList.value.push(data);
          userMsgList.value.push(data);
        }
      );

      // 用户加入房间完成
      userWs.socketIo.on(WsMsgTypeEnum.joined, (data: WsJoinType['data']) => {
        prettierReceiveWsMsg(WsMsgTypeEnum.joined, data);
        keepJoinedTimer.value = setInterval(() => {
          fetchWsKeepJoined({
            live_room_id: roomId.value,
            duration: joinedDelay / 1000,
            cluster_id:
              appStore.wsInfo?.host_list[appStore.wsInfo.index].id || '',
            uuid: uuid.value,
          })
            .then((res) => {
              console.log('fetchWsKeepJoined', res);
            })
            .catch((err) => {
              console.log('fetchWsKeepJoined-err', err);
            });
        }, joinedDelay);
      });

      // 其他用户加入房间
      userWs.socketIo.on(
        WsMsgTypeEnum.otherJoin,
        (data: WsOtherJoinType['data']) => {
          prettierReceiveWsMsg(WsMsgTypeEnum.otherJoin, data);
          if (data.join_socket_id !== userWs.socketIo?.id) {
            // const danmu: IWsMessage = {
            //   username: data.join_user_info?.username,
            //   send_msg_time: +new Date(),
            //   live_room_id: data.live_room_id!,
            //   id: -1,
            //   content: '',
            //   content_type: WsMessageContentTypeEnum.txt,
            //   msg_type: DanmuMsgTypeEnum.otherJoin,
            // };
            // danmuList.value.push(danmu);
          }
        }
      );

      // 用户离开房间
      userWs.socketIo.on(WsMsgTypeEnum.leave, (data) => {
        prettierReceiveWsMsg(WsMsgTypeEnum.leave, data);
      });

      // 用户离开房间完成
      userWs.socketIo.on(WsMsgTypeEnum.leaved, (data: WsLeavedType['data']) => {
        prettierReceiveWsMsg(WsMsgTypeEnum.leaved, data);
        console.log('用户离开房间完成', data);
        networkStore.removeRtc(data.socket_id);
        // danmuList.value.push({
        //   ...data,
        //   send_msg_time: +new Date(),
        //   live_room_id: Number(roomId.value),
        //   id: -1,
        //   content: '',
        //   content_type: WsMessageContentTypeEnum.txt,
        //   msg_type: DanmuMsgTypeEnum.userLeaved,
        // });
      });
    }
  }

  async function initWs(data: { roomId: string }) {
    roomId.value = data.roomId;
    uuid.value = `${roomId.value}___${getRandomString(20)}`;

    const res = await fetchWsGetWsInfo();
    const host = res.data.host_list[res.data.index].host;
    const protocol = res.data.host_list[res.data.index].protocol;
    appStore.wsInfo = res.data;
    if (res.code === 200) {
      new WebSocketClass({
        isIm: true,
        roomId: roomId.value,
        host,
        protocol,
        path: '/sub',
      });
      initReceive();
    }
  }

  async function initUserWs(data: { ws_user_contact_id }) {
    roomId.value = IM_NAMESPACE.chat + data.ws_user_contact_id;
    uuid.value = `${roomId.value}___${getRandomString(20)}`;

    const res = await fetchWsGetWsInfo();
    const host = res.data.host_list[res.data.index].host;
    const protocol = res.data.host_list[res.data.index].protocol;
    appStore.wsInfo = res.data;
    if (res.code === 200) {
      new WebSocketClass({
        isIm: true,
        roomId: roomId.value,
        host,
        protocol,
        path: '/sub',
        isChat: true,
      });
      initReceive();
    }
  }

  return {
    initWs,
    initUserWs,
    sendDanmuTxt,
    sendUserDanmuTxt,
    sendDanmuImg,
    sendDanmuReward,
    connectStatus,
    danmuList,
    danmukuList,
    userMsgList,
  };
};
