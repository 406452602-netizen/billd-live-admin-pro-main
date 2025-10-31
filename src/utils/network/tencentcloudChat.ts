import TencentCloudChat, { ChatSDK } from '@tencentcloud/chat';

import { fetchTencentcloudChatGenUserSig } from '@/api/tencentcloudChat';
import { TENCENTCLOUD_CHAT_SDK_APPID } from '@/spec-config';
import { useUserStore } from '@/store/user';

export class TencentCloudChatClass {
  chat: ChatSDK | null = null;
  groupId: string = '';
  constructor() {
    // 创建 SDK 实例，`TencentCloudChat.create()`方法对于同一个 `SDKAppID` 只会返回同一份实例
    this.chat = TencentCloudChat.create({
      SDKAppID: TENCENTCLOUD_CHAT_SDK_APPID, // 接入时需要将0替换为您的即时通信 IM 应用的 SDKAppID
    }); // SDK 实例通常用 chat 表示
    this.chat.setLogLevel(1); // 普通级别，日志量较多，接入时建议使用}
    // setInterval(() => {
    //   this.send();
    // }, 1000);
  }

  init = async (liveRoomId) => {
    if (!this.chat) return;
    this.groupId = liveRoomId;
    await this.login();
    // for (let i = 0; i < 100; i += 1) {
    // this.createGroup('1');
    // }
    this.chat?.on(TencentCloudChat.EVENT.MESSAGE_RECEIVED, (event) => {
      console.log('MESSAGE_RECEIVED', event);
    });
    this.chat?.on(TencentCloudChat.EVENT.SDK_READY, async (event) => {
      console.log('SDK_READY', event);
      // await this.findGroup(liveRoomId);
      // await this.createGroup(liveRoomId);
      await this.joinGroup();
    });
  };

  login = async () => {
    if (!this.chat) return;
    const userStore = useUserStore();
    const userInfoId = userStore.userInfo?.id;
    if (!userInfoId) {
      console.error('login失败');
      return;
    }
    const userId = `${userInfoId}`;
    const res = await fetchTencentcloudChatGenUserSig(userId);
    const loginres = await this.chat.login({
      userID: userId,
      userSig: res.data,
    });
    console.log('loginres', loginres);
  };

  findGroup = async (liveRoomId) => {
    try {
      if (!this.chat) return;
      // const userStore = useUserStore();
      // const userLiveRoomInfoId = userStore.userInfo?.live_rooms?.[0]?.id;
      // const liveRoomId = `${userLiveRoomInfoId}`;
      const findGroupRes = await this.chat.getGroupProfile({
        groupID: liveRoomId,
      });
      console.log('findGroupRes', findGroupRes);
      this.groupId = findGroupRes.data.group.groupID;
    } catch (error) {
      console.error(error);
      console.error('findGroup失败');
    }
  };

  createGroup = async (liveRoomId) => {
    try {
      if (!this.chat) return;
      if (this.groupId) {
        console.warn('有群组了，不创建');
        return;
      }
      // TencentCloudChat.TYPES.GRP_WORK（好友工作群，默认）
      // TencentCloudChat.TYPES.GRP_PUBLIC（陌生人社交群）
      // TencentCloudChat.TYPES.GRP_MEETING（临时会议群）
      // TencentCloudChat.TYPES.GRP_AVCHATROOM（直播群）
      // TencentCloudChat.TYPES.GRP_COMMUNITY（社群）
      // const userStore = useUserStore();
      // const userLiveRoomInfoId = userStore.userInfo?.live_rooms?.[0]?.id;
      // const userLiveRoomInfoTitle =
      //   userStore.userInfo?.live_rooms?.[0]?.title || '';
      // console.log('userLiveRoomInfoId', userLiveRoomInfoId);
      // if (!userLiveRoomInfoId) {
      //   return;
      // }
      // const liveRoomId = `${userLiveRoomInfoId}`;
      const createGroupRes = await this.chat.createGroup({
        name: liveRoomId,
        groupID: liveRoomId,
        type: TencentCloudChat.TYPES.GRP_MEETING,
      });
      console.log('createGroupRes', createGroupRes);
      this.groupId = createGroupRes.data.group.groupID;
    } catch (error) {
      console.error(error);
      console.error('createGroup失败');
    }
  };

  joinGroup = async () => {
    try {
      if (!this.chat) return;
      const joinGroupRes = await this.chat.joinGroup({
        groupID: this.groupId,
      });
      console.log('joinGroupRes', joinGroupRes);
    } catch (error) {
      console.error(error);
      console.error('joinGroup失败');
    }
  };

  send = async (msg) => {
    try {
      console.log('chat-sendxxx');
      if (!this.chat) return;
      console.log('chat-send');
      const message = this.chat.createTextMessage({
        to: this.groupId,
        conversationType: TencentCloudChat.TYPES.CONV_GROUP,
        payload: {
          text: msg,
        },
      });
      await this.chat?.sendMessage(message);
    } catch (error) {
      console.error(error);
      console.error('send失败');
    }
  };
}

export const tencentCloudChat = new TencentCloudChatClass();
