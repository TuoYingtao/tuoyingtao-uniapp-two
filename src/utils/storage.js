/**
 * @const token储存的key
 */
export const TOKEN_KEY = "user_token";

/**
 * 获取token
 */
export const getToken = () => {
  let data = uni.getStorageSync(TOKEN_KEY);
  if (!data) data = { value: "", create_time: 0, expire_time: 0 };
  if (data.expire_time == 0) return data.value;
  else if (new Date().valueOf() - data.create_time > data.expire_time) return "";
  else return data.value;
};

/**
 * 设置token
 * @param {string} token token的值
 * @param {number} expire_time 过期时间(毫秒数)
 */
export const setToken = (token = "", expire_time = 0) => {
  uni.setStorageSync(TOKEN_KEY, {
    create_time: new Date().valueOf(),
    expire_time: expire_time,
    value: token,
  });
};
