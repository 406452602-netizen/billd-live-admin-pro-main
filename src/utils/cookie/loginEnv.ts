import cookies from 'js-cookie';

import { COOKIE_KEY } from '@/constant';
import { COOKIE_DOMAIN } from '@/spec-config';

export const getLoginEnv = () => {
  return cookies.get(COOKIE_KEY.loginEnv);
};

export const setLoginEnv = (val) => {
  cookies.set(COOKIE_KEY.loginEnv, val, {
    domain: COOKIE_DOMAIN,
  });
};

export const clearLoginEnv = () => {
  cookies.remove(COOKIE_KEY.loginEnv);
};
