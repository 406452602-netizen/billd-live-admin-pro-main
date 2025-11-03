<template>
  <div class="login-warp">
    <div class="content">
      <img
        class="logo"
        src="@/assets/img/billd-admin-logo.png"
        alt=""
      />
      <n-card>
        <n-tabs
          :value="currentTab"
          :default-value="currentTab"
          size="large"
          :on-update:value="tabChange"
        >
          <!--          <n-tab-pane-->
          <!--            name="idLogin"-->
          <!--            tab="id登录"-->
          <!--          >-->
          <!--            <n-form-->
          <!--              ref="loginFormRef"-->
          <!--              label-placement="left"-->
          <!--              size="large"-->
          <!--              :model="loginForm"-->
          <!--              :rules="loginRules"-->
          <!--            >-->
          <!--              <n-form-item path="id">-->
          <!--                <n-input-->
          <!--                  v-model:value="loginForm.id"-->
          <!--                  type="text"-->
          <!--                  placeholder="请输入账号"-->
          <!--                >-->
          <!--                  <template #prefix>-->
          <!--                    <n-icon-->
          <!--                      size="20"-->
          <!--                      class="lang"-->
          <!--                    >-->
          <!--                      <PersonOutline></PersonOutline>-->
          <!--                    </n-icon>-->
          <!--                  </template>-->
          <!--                </n-input>-->
          <!--              </n-form-item>-->
          <!--              <n-form-item path="password">-->
          <!--                <n-input-->
          <!--                  v-model:value="loginForm.password"-->
          <!--                  type="password"-->
          <!--                  show-password-on="mousedown"-->
          <!--                  placeholder="请输入密码"-->
          <!--                  @focus="onFocus"-->
          <!--                  @blur="onBlur"-->
          <!--                  @keyup.enter="handleLoginSubmit"-->
          <!--                >-->
          <!--                  <template #prefix>-->
          <!--                    <n-icon-->
          <!--                      size="20"-->
          <!--                      class="lang"-->
          <!--                    >-->
          <!--                      <LockClosedOutline></LockClosedOutline>-->
          <!--                    </n-icon>-->
          <!--                  </template>-->
          <!--                </n-input>-->
          <!--              </n-form-item>-->
          <!--              <n-form-item path="captcha_code">-->
          <!--                <div style="display: flex; gap: 10px; align-items: center">-->
          <!--                  <n-input-->
          <!--                    v-model:value="loginForm.captcha_code"-->
          <!--                    placeholder="请输入验证码"-->
          <!--                    @focus="onFocus"-->
          <!--                    @blur="onBlur"-->
          <!--                    @keyup.enter="handleLoginSubmit"-->
          <!--                    style="flex: 1"-->
          <!--                  />-->
          <!--                  <div-->
          <!--                    style="-->
          <!--                      cursor: pointer;-->
          <!--                      width: 120px;-->
          <!--                      height: 40px;-->
          <!--                      border: 1px solid #dcdfe6;-->
          <!--                      border-radius: 4px;-->
          <!--                      padding: 4px;-->
          <!--                    "-->
          <!--                    @click="getCaptcha"-->
          <!--                    v-html="captchaSvg"-->
          <!--                  />-->
          <!--                </div>-->
          <!--              </n-form-item>-->
          <!--            </n-form>-->
          <!--            <n-button-->
          <!--              type="primary"-->
          <!--              block-->
          <!--              secondary-->
          <!--              strong-->
          <!--              @click="handleLoginSubmit"-->
          <!--              :loading="isLoading"-->
          <!--            >-->
          <!--              登录-->
          <!--            </n-button>-->
          <!--          </n-tab-pane>-->
          <n-tab-pane
            name="usernameLogin"
            tab="用户名登录"
          >
            <n-form
              ref="loginFormRef"
              label-placement="left"
              size="large"
              :model="loginForm"
              :rules="baseRules"
            >
              <n-form-item path="id">
                <n-input
                  v-model:value="loginForm.id"
                  type="text"
                  placeholder="请输入用户名"
                >
                  <template #prefix>
                    <n-icon
                      size="20"
                      class="lang"
                    >
                      <PersonOutline></PersonOutline>
                    </n-icon>
                  </template>
                </n-input>
              </n-form-item>
              <n-form-item path="password">
                <n-input
                  v-model:value="loginForm.password"
                  type="password"
                  show-password-on="mousedown"
                  placeholder="请输入密码"
                  @focus="onFocus"
                  @blur="onBlur"
                  @keyup.enter="handleLoginSubmit"
                >
                  <template #prefix>
                    <n-icon
                      size="20"
                      class="lang"
                    >
                      <LockClosedOutline></LockClosedOutline>
                    </n-icon>
                  </template>
                </n-input>
              </n-form-item>
              <n-form-item path="captcha_code">
                <div style="display: flex; gap: 10px; align-items: center">
                  <n-input
                    v-model:value="loginForm.captcha_code"
                    placeholder="请输入验证码"
                    style="flex: 1"
                    @focus="onFocus"
                    @blur="onBlur"
                    @keyup.enter="handleLoginSubmit"
                  />
                  <div
                    style="
                      cursor: pointer;
                      width: 120px;
                      height: 40px;
                      border: 1px solid #dcdfe6;
                      border-radius: 4px;
                      padding: 4px;
                    "
                    @click="getCaptcha"
                    v-html="captchaSvg"
                  />
                </div>
              </n-form-item>
            </n-form>
            <n-button
              type="primary"
              block
              secondary
              strong
              :loading="isLoading"
              @click="handleLoginSubmit"
            >
              登录
            </n-button>
          </n-tab-pane>
          <n-tab-pane
            name="userInvite"
            tab="邀请码注册"
          >
            <n-space
              vertical
              :size="12"
            >
              <n-form
                ref="loginFormRef"
                label-placement="left"
                size="large"
                :model="loginForm"
                :rules="registerRules"
              >
                <n-form-item path="id">
                  <n-input
                    v-model:value="loginForm.id"
                    type="text"
                    placeholder="请输入用户名"
                  >
                    <template #prefix>
                      <n-icon
                        size="20"
                        class="lang"
                      >
                        <PersonOutline></PersonOutline>
                      </n-icon>
                    </template>
                  </n-input>
                </n-form-item>
                <n-form-item path="password">
                  <n-input
                    v-model:value="loginForm.password"
                    type="password"
                    show-password-on="mousedown"
                    placeholder="请输入密码(至少包含字母和数字)"
                    @focus="onFocus"
                    @blur="onBlur"
                    @keyup.enter="handleLoginSubmit"
                  >
                    <template #prefix>
                      <n-icon
                        size="20"
                        class="lang"
                      >
                        <LockClosedOutline></LockClosedOutline>
                      </n-icon>
                    </template>
                  </n-input>
                </n-form-item>
                <n-form-item path="confirmPassword">
                  <n-input
                    v-model:value="loginForm.confirmPassword"
                    type="password"
                    show-password-on="mousedown"
                    placeholder="请确认密码"
                    @focus="onFocus"
                    @blur="onBlur"
                    @keyup.enter="handleLoginSubmit"
                  >
                    <template #prefix>
                      <n-icon
                        size="20"
                        class="lang"
                      >
                        <LockClosedOutline></LockClosedOutline>
                      </n-icon>
                    </template>
                  </n-input>
                </n-form-item>
                <n-form-item path="invite_code">
                  <n-input
                    v-model:value="loginForm.invite_code"
                    placeholder="请输入邀请码"
                    @focus="onFocus"
                    @blur="onBlur"
                    @keyup.enter="handleLoginSubmit"
                  >
                  </n-input>
                </n-form-item>
              </n-form>
            </n-space>
            <n-button
              type="primary"
              block
              secondary
              strong
              :loading="isLoading"
              @click="handleLoginSubmit"
            >
              注册
            </n-button>
          </n-tab-pane>
        </n-tabs>
      </n-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { LockClosedOutline, PersonOutline } from '@vicons/ionicons5';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { fetchCaptcha } from '@/api/user';
import { useUserStore } from '@/store/user';

const captchaSvg = ref('');
const captchaKey = ref('');
const captchaCode = ref('');

async function getCaptcha() {
  try {
    const res = await fetchCaptcha();
    captchaSvg.value = res.data.svg;
    captchaKey.value = res.data.captchaKey;
    captchaCode.value = res.data.captchaCode;
  } catch (error) {
    window.$message.error('获取验证码失败，请重试');
  }
}

// 基础验证规则
const baseRules = {
  id: { required: true, message: '请输入账号', trigger: 'blur' },
  password: {
    required: true,
    message: '请输入密码',
    trigger: 'blur',
  },
  captcha_code: { required: true, message: '请输入验证码', trigger: 'blur' },
  invite_code: { required: true, message: '请输入邀请码', trigger: 'blur' },
};

// 注册表单验证规则（带密码复杂度和确认验证）
const registerRules = {
  id: {
    required: true,
    trigger: 'blur',
    validator: (_, value) => {
      if (!value) {
        return new Error('请输入用户名');
      }
      if (value.match(/^\d/)) {
        return new Error('用户名不能以数字开头');
      }
      if (!value.match(/^[a-zA-Z0-9_]*$/)) {
        return new Error('用户名只能包含字母、数字、下划线');
      }
      if (value.match(/[\u4e00-\u9fa5]/)) {
        return new Error('用户名不支持中文');
      }
      if (value.match(/[^a-zA-Z0-9_]/)) {
        return new Error('用户名不支持特殊符号');
      }
    },
  },
  password: {
    required: true,
    message: '密码至少包含字母和数字，长度不少于6位',
    trigger: 'blur',
    pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/,
  },
  confirmPassword: {
    required: true,
    message: '请确认密码',
    trigger: 'blur',
    validator: (_, value) => {
      if (value === '') {
        return new Error('请确认密码');
      } else if (value !== loginForm.value.password) {
        return new Error('两次输入的密码不一致');
      }
    },
  },
  invite_code: { required: true, message: '请输入邀请码', trigger: 'blur' },
};

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

const loginForm = ref({
  id: '',
  password: '',
  confirmPassword: '',
  invite_code: '',
  captcha_code: '',
});

const loginFormRef = ref(null);
const currentTab = ref<'idLogin' | 'usernameLogin' | 'userInvite'>(
  'usernameLogin'
);
const isLoading = ref(false);

const handleLogin = async () => {
  isLoading.value = true;
  try {
    let token = null;
    if (
      currentTab.value === 'usernameLogin' ||
      currentTab.value === 'idLogin'
    ) {
      // 登录时需要验证码
      if (!captchaKey.value) {
        await getCaptcha();
      }

      if (currentTab.value === 'usernameLogin') {
        token = await userStore.fetchUserNameLogin({
          username: loginForm.value.id,
          password: loginForm.value.password,
          captchaKey: captchaKey.value,
          captchaCode: loginForm.value.captcha_code,
        });
      } else {
        token = await userStore.pwdLogin({
          id: +loginForm.value.id,
          password: loginForm.value.password,
          captchaKey: captchaKey.value,
          captchaCode: loginForm.value.captcha_code,
        });
      }
    } else if (currentTab.value === 'userInvite') {
      token = await userStore.inviteAgentRegister({
        username: loginForm.value.id,
        password: loginForm.value.password,
        inviteCode: loginForm.value.invite_code,
      });
    }
    if (token) {
      window.$message.success('登录成功!');
      router.push((route.query.redirect as '') || '/');
    }
  } catch (error: any) {
    // 处理验证码失效或超时错误
    if (error.errorCode === 1013) {
      window.$message.error('验证码已失效，请重新获取');
      await getCaptcha();
    }
  } finally {
    isLoading.value = false;
  }
};
const handleLoginSubmit = (e) => {
  e.preventDefault();
  // @ts-ignore
  loginFormRef.value.validate((errors) => {
    if (!errors) {
      handleLogin();
    }
  });
};

onMounted(async () => {
  const inviteCode = route.query.invite_code as string;
  if (inviteCode) {
    loginForm.value.invite_code = inviteCode;
    currentTab.value = 'userInvite';
  } else {
    // 登录页面自动获取验证码
    await getCaptcha();
  }
});

const tabChange = (v) => {
  currentTab.value = v;
};
const focus = ref(false);
const onFocus = () => {
  focus.value = true;
};
const onBlur = () => {
  focus.value = false;
};
</script>

<style lang="scss">
.login-warp {
  position: relative;
  min-height: 100vh;
  background-color: #f5f7f9;

  .content {
    position: absolute;
    top: calc(50% - 60px);
    left: 50%;
    min-width: 350px;
    border-radius: 5px;
    transform: translate(-50%, -50%);

    .logo {
      display: block;
      margin: 0 auto 10px;
      width: 300px;
    }

    .other-login {
      display: flex;
      align-items: center;
      justify-content: space-around;
      margin: 5px 0;

      .logo-wrap {
        display: flex;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: #f4f8fb;
        cursor: pointer;

        .qq-logo {
          margin: 0 auto;
          width: 25px;
        }
      }
    }
  }
}
</style>
