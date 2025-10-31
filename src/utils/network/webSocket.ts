import { isMobile } from 'billd-utils';
import { io, Socket } from 'socket.io-client';
// import customParser from 'socket.io-msgpack-parser';

import { IM_NAMESPACE } from '@/constant.ts';
import { ClientAppEnum, ClientEnvEnum } from '@/interface';
import { useNetworkStore } from '@/store/network';
import { useUserStore } from '@/store/user';
import {
  IReqWsFormat,
  WsConnectStatusEnum,
  WsMsgTypeEnum,
} from '@/types/websocket';

export function prettierReceiveWsMsg(...arg) {
  console.warn('【websocket】收到消息', ...arg);
}

export function prettierSendWsMsg(data: {
  requestId: string;
  msgType: string;
  data;
}) {
  console.warn(
    `【websocket】发送消息 msgType:${data.msgType},requestId:${data.requestId}`,
    data
  );
}

export class WebSocketClass {
  socketIo: Socket | null = null;
  status: WsConnectStatusEnum = WsConnectStatusEnum.disconnect;
  host = '';
  protocol = '';
  roomId = '-1';
  isIm = false;
  isChat = false;

  constructor(data: {
    roomId: string;
    host: string;
    protocol: string;
    path: string;
    isIm: boolean;
    isChat?: boolean;
  }) {
    if (!window.WebSocket) {
      alert('当前环境不支持WebSocket！');
      return;
    }
    console.warn('开始new WebSocketClass', data);
    this.isIm = data.isIm;
    this.roomId = data.roomId;
    this.host = data.host;
    this.protocol = data.protocol;
    const appInfo = process.env.BilldHtmlWebpackPlugin as any;
    let namespace = '';
    if (this.isIm) {
      // 直播房间和聊天房间的websocket连接地址不同
      namespace = IM_NAMESPACE.live;
      if (data.isChat) {
        namespace = IM_NAMESPACE.chat;
        this.isChat = true;
      }
    }

    const wsPath = `${this.protocol}://${this.host}${namespace}`;
    console.log('wsPath', wsPath);
    this.socketIo = io(wsPath, {
      path: data.path,
      addTrailingSlash: false,
      query: {
        billd_env: isMobile() ? ClientEnvEnum.web_mobile : ClientEnvEnum.web_pc,
        billd_app: ClientAppEnum.billd_live,
        billd_app_ver: appInfo?.pkgVersion,
      },
      transports: ['websocket'],
      // forceBase64: true,
      // WARN 用了自定义parser之后，msrblob里面的blob文件错误
      // parser: customParser,
    });
    this.update();
  }

  // 发送websocket消息
  send = <T>({
    // 写成<T extends unknown>而不是<T>是为了避免eslint将箭头函数的<T>后面的内容识别成jsx语法
    msgType,
    requestId,
    data,
  }: {
    msgType: WsMsgTypeEnum;
    requestId: string;
    data?: T;
  }) => {
    if (!this.socketIo?.connected) {
      console.error(
        '【websocket】未连接成功，不发送websocket消息！',
        msgType,
        data
      );
      return;
    }
    prettierSendWsMsg({ requestId, msgType, data });
    const userStore = useUserStore();
    const sendData: IReqWsFormat<any> = {
      request_id: requestId,
      socket_id: this.socketIo.id || '',
      user_token: userStore.token || '',
      time: +new Date(),
      data: data || {},
    };
    // const binary = stringToArrayBuffer(JSON.stringify(sendData));
    // this.socketIo?.emit(msgType, binary);
    this.socketIo?.emit(msgType, sendData);
  };

  // 更新store
  update = () => {
    const networkStore = useNetworkStore();
    if (this.isChat) {
      networkStore.chatImMap.set(this.roomId, { ...this });
    } else if (this.isIm) {
      networkStore.imWsMap.set(this.roomId, { ...this });
    } else {
      networkStore.wsMap.set(this.roomId, { ...this });
    }
  };

  // 手动关闭websocket连接
  close = () => {
    console.warn('手动关闭websocket连接', this.socketIo?.id);
    this.socketIo?.close();
  };
}
