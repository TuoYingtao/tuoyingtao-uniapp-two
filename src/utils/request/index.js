import merge from 'lodash/merge';
import isString from 'lodash/isString';
import beforeRequest from "./beforeRequest.js";
import afterResponse from "./afterResponse.js";
import { VRequest } from "@/utils/request/Request";
import { getToken } from "../storage";
import { joinTimestamp, setObjToUrlParams } from "./requestUtils";

// 如果是mock模式 或 没启用直连代理 就不配置HOST 会走本地Mock拦截
const HOST = process.env.VUE_APP_BASE_API;

const transform = {

  // 响应处理
  transformRequestHook: (res, options) => {
    const { isTransformResponse, isTransformCodeResponse, isReturnNativeResponse } = options;

    const method = res.config.method.toUpperCase();
    if (res.status == 204 || method === 'PATCH') {
      return res.data;
    }

    // 是否返回原生响应头 比如：需要获取响应头时使用该属性
    if (isReturnNativeResponse) {
      return res;
    }

    // 不进行任何处理，直接返回 用于页面代码可能需要直接获取code，data，message这些信息时开启
    if (!isTransformResponse) {
      return res.data;
    }

    const { data } = res;
    if (!data) {
      throw new Error('请求接口错误');
    }
    const { code, msg } = data;
    const hasSuccess = data && code == 200;
    if (hasSuccess) {
      // 不进行任何处理，直接返回 用于页面代码可能需要直接获取code，data，message这些信息时开启
      if (!isTransformCodeResponse) {
        return data;
      }
      return data.data;
    }
    
    if (code == 401) {
      // TODO token 凭证失效处理
    }
    throw new Error(`${msg || '未知错误'}`);
  },

  // 请求前置处理
  beforeRequestHook: (config, options) => {
    const { apiUrl, isJoinPrefix, urlPrefix, joinParamsToUrl, joinTime = true } = options;
    // 添加接口前缀
    if (isJoinPrefix) {
      config.url = `${urlPrefix}${config.url}`;
    }
    // 将baseUrl拼接
    if (apiUrl && isString(apiUrl)) {
      config.url = `${apiUrl}${config.url}`;
    }
    const params = config.params || {};
    const data = config.data || false;
    if (config.method.toUpperCase() === "GET") {
      if (!isString(params)) {
        // 给 GET 请求加上时间戳参数，避免从缓存中拿数据。
        config.params = Object.assign(params || {}, joinTimestamp(joinTime, false));
      } else {
        config.url = `${config.url}${params}${joinTimestamp(joinTime, true, false)}`;
        config.params = undefined;
      }
    } else if (!isString(params)){
      if (config && config.data && Object.keys(config.data).length > 0) {
        config.data = data;
        config.params = params;
      } else {
        // 非GET请求如果没有提供data，则将params视为data
        config.data = params;
        config.params = undefined;
      }
      if (joinParamsToUrl) {
        config.url = setObjToUrlParams(config.url, { ...config.params, ...config.data });
      }
    } else {
      // 兼容restful风格
      config.url += params;
      config.params = undefined;
    }
    config.data = Object.assign({}, !isString(params) && params, data);
    delete config.params;
    return config;
  },

  // 请求前的拦截器
  requestInterceptors: (config, options) => {
    // const token = getToken()
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NzMzMzkzMDksInN1YiI6IueUqOaIt-WHreivgSIsIm5iZiI6MTY3MDc0NzMxMSwiYXVkIjoidXNlciIsImlhdCI6MTY3MDc0NzMwOSwianRpIjoiNGRlYTQ0NTExZDMyNjI5MTVmNGJhNTBkZmU4ZjJiNDMiLCJpc3MiOiJhbGFuZyIsInN0YXR1cyI6MSwiZGF0YSI6eyJ1c2VyX2lkIjo4MDAwNDd9fQ.uhlGZr2v6rvy9_Jnh4Qx-cVs5Rcx0Zsicx8ZjxBcY-M';
    config.header = {};
    if (token && options.requestOptions.withToken != false) {
      config.header[options.requestOptions.fieldToken] = options.requestOptions.authenticationScheme
      ? `${options.requestOptions.authenticationScheme} ${token}`
      : token;
    }
    const header = config.header || options.headers;
    const contentType = header['Content-Type'] || header['content-type'];
    if (config.method.toUpperCase() === "POST" 
        && contentType !== 'application/x-www-form-urlencoded;charset=utf-8' ) {
      config.header['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
    }
    config.timeout = options.timeout;
    config.withCredentials = options.withCredentials;
    config.dataType = options.dataType;
    config.responseType = options.responseType;
    return config;
  },

  // 响应拦截器
  responseInterceptors: ([error, response], conf) => {
    if (error && error.errMsg) {
      throw new Error(error.errMsg)
    } else {
      if (response.statusCode != 200) {
        response.isRetry = true;
      }
      response.config = conf;
      return response;
    }
  },

  // 响应错误拦截
  responseInterceptorsCatch: (error) => {
    const { config } = error;
    if (!config || !config.requestOptions.retry) return Promise.reject(error);
    config.retryCount = config.retryCount || 0;
    if (config.retryCount >= config.requestOptions.retry.count) return Promise.reject(error);
    config.retryCount += 1;
    const backoff = new Promise((resolve) => {
      setTimeout(() => {
        resolve(config);
      }, config.requestOptions.retry.delay || 1);
    });
    return backoff.then((config) => request.executor(config));
  }

}

function createRequest(options) {
  return new VRequest(merge({
    // 超时时间
    timeout: 10 * 1000,
    // 携带Cookie
    withCredentials: true,
    // 如果设为 json，会尝试对返回的数据做一次 JSON.parse
    dataType: 'json',
    // 设置响应的数据类型。合法值：text、arraybuffer
    responseType: 'text',
    // 头信息
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    // 请求数据
    transform,
    requestOptions: {
      // 请求IP地址
      apiUrl: HOST,
      // 是否自动添加接口前缀
      isJoinPrefix: true,
      // 接口前缀
      urlPrefix: '/api',
      // 是否返回原生响应头 比如：需要获取响应头时使用该属性
      isReturnNativeResponse: false,
      // 需要对返回数据进行处理
      isTransformResponse: true,
      // 当code为200 时，需要对返回数据进行处理
      isTransformCodeResponse: true,
      // post请求的时候添加参数到url
      joinParamsToUrl: false,
      // 是否加入时间戳
      joinTime: true,
      // 忽略重复请求
      ignoreRepeatRequest: true,
      // 是否携带token
      withToken: true,
      // token 字段
      fieldToken: 'token',
      // token 令牌前缀如：'Bearer'
      authenticationScheme: '',
      // 重试机制
      retry: {
        count: 3,
        delay: 1000,
      },
    }
  }, options || {}));
}

export const request = createRequest();

export default async (config) => {
  config = await beforeRequest(config);
  return uni.request(config).then(([error, response]) => {
    return afterResponse(config, error, response);
  });
};

export const upload = async (config) => {
  config.is_upload = true;
  config = await beforeRequest(config);
  return uni.uploadFile(config).then(([error, response]) => {
    try {
      response.data = JSON.parse(response.data);
    } catch (e) { }
    return afterResponse(config, error, response);
  });
};
