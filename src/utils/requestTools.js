import { request } from "@/utils/request";
import { setToken } from "@/utils/storage";

export function silenceAuthorizedLogin() {
  const requestInstance =  request.getRequest();
  return new Promise((resolve, reject) => {
    uni.login({
      scopes: 'auth_base',
      success: (res) => {
        let data = {
          code: res.code
        }
        requestInstance({ url: '/auth/silent', method: 'POST', data}).then(res => {
          setToken(res.token, Number(res.expiration_time) * 1000);
          resolve(true);
        });
      }
    })
  })
}
