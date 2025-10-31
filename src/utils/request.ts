import axios, { Axios, AxiosRequestConfig } from 'axios';
import { PluginOption } from 'billd-html-webpack-plugin';
import { getRandomString, isMobile } from 'billd-utils';

import { ClientAppEnum, ClientEnvEnum } from '@/interface';
import { AXIOS_BASEURL } from '@/spec-config';
import { useUserStore } from '@/store/user';
import { getCurrEnv, getToken } from '@/utils/localStorage';

export interface MyAxiosPromise<T = any>
  extends Promise<{
    code: number;
    data: T;
    msg: string;
  }> {}

interface MyAxiosInstance extends Axios {
  (config: AxiosRequestConfig): MyAxiosPromise;

  (url: string, config?: AxiosRequestConfig): MyAxiosPromise;
}

export const getBaseUrl = () => {
  switch (getCurrEnv()) {
    case 'prod':
      return AXIOS_BASEURL;
    case 'beta':
      return AXIOS_BASEURL;
    case 'development':
      return '/api/';
    default:
      return '/api/';
  }
};

class MyAxios {
  // axios 实例
  instance: MyAxiosInstance;

  constructor(config: AxiosRequestConfig) {
    // @ts-ignore
    this.instance = axios.create(config);

    // 请求拦截器
    this.instance.interceptors.request.use(
      (cfg) => {
        cfg.baseURL = getBaseUrl();
        const token = getToken();
        if (token) {
          cfg.headers.Authorization = `Bearer ${token}`;
        }
        // @ts-ignore
        const appInfo = process.env
          .BilldHtmlWebpackPlugin as PluginOption['log'];
        cfg.headers['X-Billd-Trace-Id'] = getRandomString(32);
        cfg.headers['X-Billd-Env'] = isMobile()
          ? ClientEnvEnum.web_mobile
          : ClientEnvEnum.web_pc;
        cfg.headers['X-Billd-App'] = ClientAppEnum.billd_live_admin;
        cfg.headers['X-Billd-Appver'] = appInfo?.pkgVersion;
        return cfg;
      },
      (error) => {
        console.log(error);
        return Promise.reject(error);
      }
    );

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response) => {
        console.log('response.config.url', response.config.url);
        console.log('response.data', response.data);
        return response.data;
      },
      (error) => {
        console.log('响应拦截到错误', error);
        if (error.message.indexOf('timeout') !== -1) {
          console.error(error.message);
          window.$message.error('请求超时，请重试');
          return;
        }
        const statusCode = error.response.status as number;
        const errorResponse = error.response;
        const errorResponseData = errorResponse.data;
        const whiteList = ['400', '401', '403', '404', '500'];
        if (error.response) {
          if (!whiteList.includes(`${statusCode}`)) {
            window.$message.error(error.message);
            return Promise.reject(error.message);
          }
          if (statusCode === 400) {
            console.error(errorResponseData.msg);
            window.$message.error(errorResponseData.msg);
            return Promise.reject(errorResponseData);
          }
          if (statusCode === 401) {
            console.error(errorResponseData.msg);
            window.$message.error(errorResponseData.msg);
            const userStore = useUserStore();
            userStore.logout();
            return Promise.reject(errorResponseData);
          }
          if (statusCode === 403) {
            console.error(errorResponseData.msg);
            window.$message.error(errorResponseData.msg);
            return Promise.reject(errorResponseData);
          }
          if (statusCode === 404) {
            console.error(errorResponseData.msg);
            window.$message.error(errorResponseData.msg);
            return Promise.reject(errorResponseData);
          }
          if (statusCode === 500) {
            console.error(errorResponseData.error);
            window.$message.error(errorResponseData.error);
            return Promise.reject(errorResponseData);
          }
        } else {
          // 请求超时没有response
          console.error(error.message);
          window.$message.error(error.message);
          return Promise.reject(error.message);
        }
      }
    );
  }

  get<T = any>(
    url: string,
    config?: AxiosRequestConfig<any> | undefined
  ): MyAxiosPromise<T> {
    return this.instance.get(url, config);
  }

  post<T = any>(
    url: string,
    data?: object | undefined,
    config?: AxiosRequestConfig
  ): MyAxiosPromise<T> {
    return this.instance.post(url, data, config);
  }

  put<T = any>(
    url: string,
    data?: object | undefined,
    config?: AxiosRequestConfig
  ): MyAxiosPromise<T> {
    return this.instance.put(url, data, config);
  }

  delete<T = any>(url: string, config?: AxiosRequestConfig): MyAxiosPromise<T> {
    return this.instance.delete(url, config);
  }
}

export default new MyAxios({
  timeout: 1000 * 5,
});
