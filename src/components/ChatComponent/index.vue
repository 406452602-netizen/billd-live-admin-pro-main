<template>
  <div
    class="chat-container"
    :class="{ 'chat-collapsed': isCollapsed }"
  >
    <div
      class="chat-toggle"
      @click="toggleCollapse"
    >
      {{ isCollapsed ? '>' : '<' }}
    </div>
    <div
      v-if="!isCollapsed"
      class="chat-content"
    >
      <div class="chat-header">
        <div class="chat-header-title">
          {{ selectedUser ? selectedUser.name : '用户列表' }}
        </div>
      </div>
      <div class="chat-body">
        <div
          v-if="!selectedUser"
          class="user-list"
        >
          <n-scrollbar>
            <n-list>
              <n-list-item
                v-for="(item, index) in users"
                :key="index"
                class="user-list-item"
                :class="{
                  active: selectedUser && selectedUser.id === item.id,
                }"
              >
                <div
                  class="user-list-item-content"
                  @click="selectUser(item.sourceUser)"
                >
                  <!-- 头像 -->
                  <img
                    class="user-avatar"
                    :src="item.sourceUser.avatar"
                    :alt="item.sourceUser.username + ' 头像'"
                  />
                  <div class="user-info">
                    <div class="user-header">
                      <!-- 用户名称 -->
                      <span class="user-name">{{
                        item.sourceUser.username
                      }}</span>
                      <!-- 最新消息时间 -->
                      <span class="user-last-message-time">{{
                        item.send_message_time
                      }}</span>
                    </div>
                    <!-- 最新消息内容 -->
                    <div class="user-last-message">
                      {{ item.content }}
                    </div>
                  </div>
                </div>
              </n-list-item>
            </n-list>
          </n-scrollbar>
        </div>
        <div
          v-else
          class="chat-detail"
        >
          <div>
            <n-button
              v-if="selectedUser"
              class="back-button"
              @click="backToUserList"
            >
              <template #icon>
                <BackspaceOutline />
              </template>
            </n-button>
            <span>{{ selectedUser.username }}</span>
          </div>

          <div
            ref="chatListRef"
            class="chat-messages"
          >
            <n-scrollbar>
              <n-list :show-divider="false">
                <n-list-item
                  v-for="(item, index) in danmuList"
                  :key="index"
                >
                  <div
                    class="message-time"
                    v-if="isHide(item.send_message_time, index)"
                  >
                    {{ item.send_message_time }}
                  </div>
                  <div
                    class="message-item"
                    :class="{
                      self: item.target_user_id == userStore.userInfo?.id,
                    }"
                  >
                    <img
                      class="message-avatar"
                      :src="
                        item.source_user_id == userStore.userInfo?.id
                          ? userStore.userInfo?.avatar
                          : item.targetUser?.avatar
                      "
                    />
                    <div class="message-content-wrapper">
                      <div class="message-content">
                        {{ item.content }}
                      </div>
                    </div>
                  </div>
                </n-list-item>
              </n-list>
            </n-scrollbar>
          </div>
          <div class="chat-input">
            <n-input-group>
              <n-input
                v-model:value="messageInput"
                placeholder="输入消息..."
                class="message-input"
                @keyup.enter="sendMessage"
              >
              </n-input>
              <n-button
                class="send-button"
                @click="sendMessage"
                >发送
              </n-button>
            </n-input-group>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { BackspaceOutline } from '@vicons/ionicons5';
import { NList, NScrollbar, NInput, NButton } from 'naive-ui';
import { ref, onMounted, watch, nextTick } from 'vue';

import { fetchGetWsUserMessageList, getLastMessages } from '@/api/wsMessage.ts';
import { useWebsocketIm } from '@/hooks/use-websocket-im'; // 假设路径正确
import { formatTime } from '@/router/utils.ts';
import { useUserStore } from '@/store/user';

const userStore = useUserStore();

const isCollapsed = ref(true);
const messageInput = ref('');
const selectedUser = ref<any>(null);

const chatListRef = ref<HTMLDivElement | null>(null);
// 模拟用户数据，添加头像和最新消息时间
const users = ref<any>([
  {
    id: 1,
    name: '用户 A',
    avatar: 'https://via.placeholder.com/40', // 头像链接
    lastMessage: '最近有什么优惠活动？',
    lastMessageTime: '09:00', // 最新消息时间
    messages: [
      {
        id: 1,
        content: '最近有什么优惠活动？',
        time: '2025-07-16 09:00:00',
        isCustomer: true,
      },
      {
        id: 2,
        content: '目前有满减活动哦。',
        time: '2025-07-16 09:01:00',
        isCustomer: false,
      },
    ],
  },
  {
    id: 2,
    name: '用户 B',
    avatar: 'https://via.placeholder.com/40', // 头像链接
    lastMessage: '商品什么时候发货？',
    lastMessageTime: '09:05', // 最新消息时间
    messages: [
      {
        id: 3,
        content: '商品什么时候发货？',
        time: '2025-07-16 09:05:00',
        isCustomer: true,
      },
    ],
  },
]);
const {
  initUserWs: initUserWs,
  danmuList,
  sendUserDanmuTxt,
} = useWebsocketIm();
const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
};

function isHide(sendMessageTime, index) {
  if (index == 0) {
    return true;
  }
  const a = new Date(sendMessageTime).getTime();
  const b =
    new Date(danmuList.value[index - 1].send_message_time).getTime() +
    1000 * 60 * 5;
  console.log(a, b);
  return a > b;
}

async function handleHistoryMsg(targetUser) {
  try {
    const res = await fetchGetWsUserMessageList({
      source_user_id: userStore.userInfo?.id,
      target_user_id: targetUser.id,
    });
    if (res.code === 200) {
      console.log(res.data);
      selectedUser.value = {
        sessionId: res.data.contact,
        targetUserId: targetUser.id,
        username: targetUser.username,
      };
      danmuList.value = [];
      res.data.list.forEach((v) => {
        danmuList.value.push(v);
      });
    }
  } catch (error) {
    console.log(error);
  }
}

const selectUser = (user) => {
  handleHistoryMsg(user);
};

const backToUserList = () => {
  selectedUser.value = null;
};

const sendMessage = () => {
  console.log('sendMessage', messageInput.value);
  if (messageInput.value.trim() && selectedUser.value) {
    const newMessage = {
      content: messageInput.value.trim(),
      send_message_time: new Date().toLocaleTimeString(),
      target_user_id: selectedUser.value.targetUserId,
      source_user_id: userStore.userInfo?.id,
    };
    danmuList.value.push(newMessage);
    sendUserDanmuTxt(
      messageInput.value.trim(),
      selectedUser.value.targetUserId,
      selectedUser.value.sessionId
    );

    messageInput.value = '';
  }
};

onMounted(() => {
  getInit();
});
const getInit = () => {
  getLastMessages(userStore.userInfo?.id).then((res) => {
    console.log(res);
    users.value = res.data;
  });
  if (userStore.userInfo) {
    initUserWs({
      ws_user_contact_id: userStore.userInfo?.id,
    });
  }
};

// 添加用户更新逻辑函数
const updateUsersFromDanmu = (newDanmuList) => {
  if (!newDanmuList.length) return;

  // 获取最新的一条弹幕消息
  const latestDanmu: any = newDanmuList[newDanmuList.length - 1];
  const {
    source_user_id: sourceUserId,
    content,
    send_message_time: sendMessageTime,
    user,
  } = latestDanmu;
  const sendMessageTimeFormat = formatTime(sendMessageTime);

  // 在用户列表中查找对应的用户
  const userIndex = users.value.findIndex(
    (u) => u.sourceUser?.id === sourceUserId
  );

  if (userIndex > -1) {
    // 更新现有用户的最后一条消息和时间
    users.value[userIndex].content = content;
    users.value[userIndex].send_message_time = sendMessageTimeFormat;
  } else {
    // 新增用户（使用默认头像和用户名，实际项目中可能需要从接口获取完整用户信息）
    const newUser = {
      id: sourceUserId,
      sourceUser: {
        id: sourceUserId,
        username: `${user.username}`,
        avatar: `${user.avatar}`,
      },
      content,
      send_message_time: sendMessageTimeFormat,
    };
    users.value.push(newUser);
  }
};

const scrollToBottom = () => {
  nextTick(() => {
    if (chatListRef.value) {
      chatListRef.value.scrollTop = chatListRef.value.scrollHeight;
    }
  });
};

watch(danmuList.value, (value) => {
  scrollToBottom();
  updateUsersFromDanmu(value);
  console.log('danmuList', value);
});
</script>

<style scoped lang="scss">
.chat-container {
  position: fixed;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 80vh;
  width: 300px;
  background-color: #fff;
  z-index: 1000;
  transition: width 0.3s ease;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

  .chat-toggle {
    position: absolute;
    left: -20px;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    height: 50px;
    background-color: #07c160;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 4px 0 0 4px;
    transition: background-color 0.3s;

    &:hover {
      background-color: #06a755;
    }
  }

  .chat-content {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .chat-header {
    padding: 12px 16px;
    background-color: #f5f5f5;
    border-bottom: 1px solid #e6e6e6;
    display: flex;
    align-items: center;

    .chat-header-title {
      font-size: 16px;
      font-weight: 500;
    }
  }

  .chat-body {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .user-list {
    flex: 1;
    overflow-y: scroll;
  }

  .user-list-item {
    padding: 12px 16px;
    transition: background-color 0.3s;

    &:hover {
      background-color: #f8f9fa;
    }

    &.active {
      background-color: #e7f3ff;
    }
  }

  .user-list-item-content {
    display: flex;
    align-items: center;
  }

  .user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 6px;
    object-fit: cover;
    margin-right: 12px;
  }

  .user-info {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .user-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
  }

  .user-name {
    font-size: 14px;
    font-weight: 500;
    color: #212529;
  }

  .user-last-message-time {
    font-size: 12px;
    color: #909399;
  }

  .back-button {
    margin-right: 8px;
  }

  .user-last-message {
    font-size: 12px;
    color: #606266;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .chat-detail {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .chat-messages {
    //flex: 1;
    padding: 16px;
    overflow-y: scroll;
    height: 60vh;
  }

  .message-item {
    display: flex;
    align-items: flex-start;
    margin-bottom: 16px;

    &.self {
      flex-direction: row-reverse;
    }
  }

  .message-avatar {
    width: 32px;
    height: 32px;
    border-radius: 6px;
    object-fit: cover;
  }

  .self .message-avatar {
    margin-left: 12px;
  }

  .message-content-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .message-content {
    max-width: 70%;
    padding: 8px 12px;
    border-radius: 6px;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      top: 10px;
      border: 6px solid transparent;
    }
  }

  .message-item:not(.self) .message-content {
    background-color: #f0f0f0;
    margin-left: 12px;

    &::before {
      left: -12px;
      border-right-color: #f0f0f0;
    }
  }

  .message-item.self .message-content {
    background-color: #9eea6a;
    margin-right: 12px;
    align-self: flex-end;

    &::before {
      right: -12px;
      border-left-color: #9eea6a;
    }
  }

  .message-time {
    font-size: 12px;
    color: #909399;
    text-align: center;
    margin: 8px 0;
  }

  .chat-input {
    padding: 12px 16px;
    flex: 1;
    border-top: 1px solid #e6e6e6;
  }

  .message-input {
    border-radius: 4px;
  }

  .send-button {
    margin-left: 8px;
    background-color: #07c160;
    color: white;

    &:hover {
      background-color: #06a755;
    }
  }
}

.chat-collapsed {
  width: 0;
}
</style>
