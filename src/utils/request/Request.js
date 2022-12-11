import afterResponse from "@/utils/request/afterResponse";
import cloneDeep from 'lodash/cloneDeep';
import isFunction from 'lodash/isFunction';

export class VRequest {

  // request实例
  #privateInstance;

  // request选项
  #privateOptions;

  constructor(options) {
    this.#privateOptions = options;
    // this.#privateInstance = this.#privateCreateRequest(options);
    // this.#privateSetupBeforeHook();
  }

  // 获取request实例
  // getRequest() {
  //   return this.#privateInstance;
  // }

  // setConfigRequest(options) {
  //   if (!this.#privateInstance) return false;
  //   this.#privateCreateRequest(options);
  // }

  // 创建request实例
  // #privateCreateRequest(options) {
  //   this.#privateInstance = uni.request(options);
  // }

  // 获取数据处理
  #privateGetTransform() {
    const { transform } = this.#privateOptions;
    return transform;
  }

  // 设置请求拦截
  #privateSetupBeforeHook(config, options) {
    const transform = this.#privateGetTransform();
    if (!transform) {
      console.warn('处理数据参数不能为空！')
    }
    let conf = cloneDeep(config);
    const { requestOptions } = this.#privateOptions;
    const opt = { ...requestOptions, ...options };
    const { beforeRequestHook } = transform;
    return new Promise((resolve, reject) => {
      if (beforeRequestHook && isFunction(beforeRequestHook)) {
        conf = beforeRequestHook(conf, opt);
      }
      conf.requestOptions = opt;
      resolve(conf);
    })
  }
  
  #privateSetupInterceptors(config, options) {
    const transform = this.#privateGetTransform();
    if (!transform) {
      console.warn('处理数据参数不能为空！')
    }
    let conf = cloneDeep(config);
    const opt = { ...this.#privateOptions };
    opt.requestOptions = { ...opt.requestOptions, ...options }
    const { requestInterceptors } = transform;
    return new Promise((resolve, reject) => {
      if (requestInterceptors && isFunction(requestInterceptors)) {
        conf = requestInterceptors(config, opt);
      }
      conf.requestOptions = opt.requestOptions;
      resolve(conf);
    })
  }

  get(config, options) {
    config.method = 'GET'
    return this.executor(config, options);
  }

  post(config, options) {
    config.method = 'POST'
    return this.executor(config, options);
  }

  put(config, options) {
    config.method = 'PUT'
    return this.executor(config, options);
  }

  delete(config, options) {
    config.method = 'DELETE'
    return this.executor(config, options);
  }

  patch(config, options) {
    config.method = 'PATCH'
    return this.executor(config, options);
  }

  async executor(config, options) {
    let conf = config || {};
    if (conf && !conf.retryCount) {
      conf = await this.#privateSetupBeforeHook(config, options);
      conf = await this.#privateSetupInterceptors(conf, options); 
    }
    const transform = this.#privateGetTransform();
    const { responseInterceptors, responseInterceptorsCatch, transformRequestHook } = transform;
    return uni.request(conf).then(([error, response]) => {
      const res = responseInterceptors([error, response], conf);
      if (res.isRetry) {
        return responseInterceptorsCatch(res);
      } else {
        return transformRequestHook(res, conf.requestOptions);
      }
    }).finally(() => {
      console.log('finally')
    });
  }
}
