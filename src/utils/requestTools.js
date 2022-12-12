import { request } from "@/utils/request";
import { setToken } from "@/utils/storage";

let isSilenceLock = false;
export function silenceAuthorizedLogin() {
  if (isSilenceLock) return false;
  isSilenceLock = true
  const requestInstance =  request.getRequest();
  return new Promise((resolve, reject) => {
    uni.login({
      scopes: 'auth_base',
      success: (res) => {
        let data = {
          code: res.code
        }
        requestInstance({ url: '/register', method: 'POST', data}).then(res => {
          setToken(res.token, Number(res.expiration_time) * 1000);
          resolve(true);
        }).finally(() => {
          isSilenceLock = false;
        })
      }
    })
  })
}
