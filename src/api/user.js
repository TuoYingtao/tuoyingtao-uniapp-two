import request from '@/utils/request'

// 微信登录
// export const Login = (data) => request({ url: 'weappapi/User/Login', data })
export const Login = (data) => Promise.resolve({ msg: 'ok', code: 0, data: { token: 'TOKENaabbccdd' } })

// 获取用户信息
// export const getUserInfo = (data) => request({ url: 'weappapi/User/getUserInfo', data })
export const getUserInfo = (data) => Promise.resolve({ msg: 'ok', code: 0, data: { id: 1, nickname: '李立民' } })
