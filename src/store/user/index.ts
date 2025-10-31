import { arrayUnique, windowReload } from 'billd-utils';
import { defineStore } from 'pinia';

import { fetchRegister } from '@/api/emailUser';
import { inviteAgentRegister } from '@/api/inviteAgent.ts';
import { fetchLogin, fetchUserInfo, fetchUserNameLogin } from '@/api/user';
import { IRole, IUser } from '@/interface';
import router from '@/router';
import { asyncRoutes } from '@/router/asyncRoute';
import { clearToken, setToken } from '@/utils/localStorage';

type UserRootState = {
  userInfo?: IUser;
  token?: string;
  roles?: IRole[];
};

export const useUserStore = defineStore('user', {
  state: (): UserRootState => {
    return {
      userInfo: undefined,
      token: undefined,
      roles: undefined,
    };
  },
  actions: {
    setUserInfo(res) {
      this.userInfo = res;
    },
    setToken(res) {
      setToken(res);
      this.token = res;
    },
    setRoles(res) {
      this.roles = res;
    },
    logout() {
      clearToken();
      this.token = undefined;
      this.userInfo = undefined;
      this.roles = undefined;
      router.push('/login').then(() =>
        setTimeout(() => {
          windowReload();
        }, 300)
      );
    },
    async pwdLogin({ id, password, captchaKey, captchaCode }) {
      try {
        const { data: token } = await fetchLogin({
          id,
          password,
          captcha_key: captchaKey,
          captcha_code: captchaCode,
        });
        this.setToken(token);
        return token;
      } catch (error: any) {
        // 错误返回401，全局的响应拦截会打印报错信息
        return null;
      }
    },
    async fetchUserNameLogin({ username, password, captchaKey, captchaCode }) {
      try {
        const { data: token } = await fetchUserNameLogin({
          username,
          password,
          captcha_key: captchaKey,
          captcha_code: captchaCode,
        });
        this.setToken(token);
        return token;
      } catch (error: any) {
        return null;
      }
    },

    async inviteAgentRegister({ username, password, inviteCode }) {
      try {
        const { data: token } = await inviteAgentRegister({
          username,
          password,
          inviteCode,
        });
        this.setToken(token);
        return token;
      } catch (error: any) {
        // 错误返回401，全局的响应拦截会打印报错信息
        return null;
      }
    },
    async register({ email, code }) {
      try {
        // @ts-ignore
        const { data: token } = await fetchRegister({
          email,
          code,
        });
        this.setToken(token);
        return { token };
      } catch (error: any) {
        window.$message.error(error.message);
        return error;
      }
    },
    async getUserInfo() {
      try {
        const { code, data }: any = await fetchUserInfo();
        this.setUserInfo(data);
        this.setRoles(data.roles);
        return { code, data };
      } catch (error) {
        return error;
      }
    },
    generateAsyncRoutes(roles, auths) {
      // 比较两数组是否有交集(返回true代表有交集)
      const hasMixin = (a, b) => {
        return a.length + b.length !== new Set([...a, ...b]).size;
      };
      const myRole = roles.map((v) => v.role_value);
      const myAuth = auths ? auths.map((v) => v.auth_value) : [];
      const handleAsyncRoutes = (roleRoutes) => {
        const deepFind = (route) => {
          // const res: any[] = [];
          // route.forEach((v) => {
          //   const t = { ...v };
          //   if (t.meta && t.meta.roles) {
          //     // 有meta数据，且meta有roles数据，开始判断权限，有权限才允许访问
          //     const hasRole = hasMixin(arrayUnique(t.meta.roles), myRole);

          //     console.log('role', myRole, 'route', t);
          //     hasRole && res.push(t);
          //   } else {
          //     // 没有meta信息，允许访问
          //     res.push(t);
          //   }
          //   if (t.children) {
          //     t.children = deepFind(t.children);
          //   }
          // });
          // return res;
          const res: any[] = [];
          route.forEach((v) => {
            const t = { ...v };
            // 先检查是否有权限要求
            let hasPermission = true;

            // 如果有auth权限要求，且角色权限检查通过，则继续检查auth权限
            if (t.meta && t.meta.auths) {
              hasPermission = hasMixin(arrayUnique(t.meta.auths), myAuth);
            }
            // 检查角色权限
            if (t.meta && t.meta.roles) {
              hasPermission = hasMixin(arrayUnique(t.meta.roles), myRole);
            }

            hasPermission && res.push(t);

            if (t.children) {
              t.children = deepFind(t.children);
            }
          });
          return res;
        };
        const res = deepFind(roleRoutes);
        return res;
      };
      return handleAsyncRoutes(asyncRoutes);
    },
  },
});
