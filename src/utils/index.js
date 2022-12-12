/**
 * 清除前后空格
 * @param str 字符串
 * @returns {*}
 */
export function trim(str) {
  return str.replace(/(^\s*)|(\s*$)/g, '');
}

/**
 * 去除所有空格
 * @param str 字符串
 * @returns {*}
 */
export function removeAllSpace(str) {
  return str.replace(/\s+/g, "");
}

/**
 * 判断是否为空
 * @param str 字符串
 * @returns {boolean}
 */
export function isEmpty(str) {
  if (val == null || typeof(val) == 'undefined' ||
    (typeof(val) == 'string' && (trim(val) == '' || trim(val) == 'null'))) {
    return true;
  } else {
    return false;
  }
}

/**
 * 判断是否为数组类型
 * @param arr 数组对象
 * @returns {boolean}
 */
export function isArray(arr) {
  return (typeof arr == 'object') && arr.constructor == Array
}

/**
 * 判断对象是否为空
 * @param obj 字符串
 * @returns {boolean}
 */
export function isEmptyObj(obj) {
  return Object.keys(obj) === 0 ? true : false
}

/**
 * 节流
 */
export function throttle(fn, tapTime = 1000) {
  var lastTime = 0;
  return function() {
    var nowTime = +new Date();
    if (nowTime - lastTime > tapTime) {
      fn.apply(this, arguments)
      lastTime = nowTime
    }
  }
}

/**
 * 节流函数
 * @description 本函数接收一个Promise，当Promise在pending状态中，会自动阻止下次继续触发，在finally后释放。同时允许传入一个时限，如果达到时限Promise还未finally，会执行onTime回调
 * @param {string|number} promise_id 节流ID，同ID的内部节流，不同ID的互不干扰
 * @param {Function} promiseFunction 要节流的Promise函数，该函数应该返回一个Promise
 * @param {number} time x毫秒后触发onTime，如果在此之前Promise已经finally，则不执行onTime
 * @param {Function} onTime 事件
 * @returns
 */
let _promiseThrottleMap = {};
export const promiseThrottle = (promise_id, promiseFunction, time = 500, onTime = null) => {
  if (_promiseThrottleMap[promise_id] === true) return Promise.reject(Error('请求正在进行中'));

  let timeout = undefined;
  if (typeof time == 'number') timeout = setTimeout(onTime, time);

  _promiseThrottleMap[promise_id] = true;
  return promiseFunction().finally(() => {
    _promiseThrottleMap[promise_id] = false;
    clearTimeout(timeout)
  });
}

/**
 * 防抖
 */
export function debounce(func, delay = 300) {
  let timer = null
  return function(...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}


/**
 * 获取url地址中的参数
 */
export function getURLParameter(name, url) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(url) || [,
    ""
  ])[1]
    .replace(/\+/g, '%20')) || null;
}

/**
 * 对象深拷贝
 * @param obj 数组
 * @returns {*[]}
 */
export function deepCopy(obj) {
  const result = Array.isArray(obj) ? [] : {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        result[key] = deepCopy(obj[key]); //递归复制
      } else {
        result[key] = obj[key];
      }
    }
  }
  return result;
}

/**
 * 手机号正则验证
 * @param {*} phone 手机号
 */
export function regPhone(phone) {
  let regPhone = /^1[3456789]\d{9}$/;
  return regPhone.test(phone);
}

/**
 * 字符长度验证
 * @param params 字符串
 * @param min 最小字符 默认：2
 * @param max 最大字符串 默认：10
 * @returns {boolean}
 */
export function regName(params, min = 2, max = 10) {
  const pattern = params.toString().replace(/\s/g, '').length > max
    || params.toString().replace(/\s/g, '').length < min;
  return pattern;
}

/**
 * 解析时间戳
 * @param param 时间戳
 * @param format 时间戳美化格式
 * @returns {string}
 */
export function parseTime(param, format = "${yyyy-MM-dd hh:mm:ss}") {
  if (param == null || param == "" || param == "undefined") return "";
  const date = new Date(Number(param) * 1000);
  const y = date.getFullYear();
  const M = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
  const d = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();;
  const h = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  const m = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  const s = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
  if (format == "${yyyy-MM-dd hh:mm:ss}") {
    return `${y}-${M}-${d} ${h}:${m}:${s}`;
  } else if (format == "${yyyy-MM-dd}") {
    return `${y}-${M}-${d}`;
  } else if (format == "${hh:mm:ss}") {
    return `${h}:${m}:${s}`;
  }
}

/**
 * 经纬度转换成三角函数中度分表形式
 * @param d
 * @returns {number}
 */
export function rad(d) {
  return d * Math.PI / 180.0;
}


/**
 * 根据经纬度计算距离，参数分别为第一点的纬度，经度；第二点的纬度，经度
  * @param lat1 纬度-1
 * @param lng1 进度-1
 * @param lat2 纬度-2
 * @param lng2 进度-2
 * @returns {number}
 */
export function getDistance(lat1, lng1, lat2, lng2) {
  const radLat1 = rad(lat1);
  const radLat2 = rad(lat2);
  const a = radLat1 - radLat2;
  const b = rad(lng1) - rad(lng2);
  let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
  s = s * 6378.137; // EARTH_RADIUS;
  s = Math.round(s * 10000) / 10000; //输出为公里

  // var distance = s;
  // var distance_str = "";

  // if (parseInt(distance) >= 1) {
  // 	distance_str = distance.toFixed(1) + "km";
  // } else {
  // 	distance_str = distance.toFixed(3) * 1000 + "m";
  // }

  return s.toFixed(3) * 1000;
}

/**
 * 阿里OSS图片处理
 * 文档详见https://help.aliyun.com/document_detail/44688.html?spm=a2c4g.11186623.6.744.e6861690GmP75X
 * @param url 为服务器返回 imageUrl
 * @param limit 指定当目标缩放图大于原图时是否进行缩放。1：表示不按指定参数进行缩放，直接返回原图。0：按指定参数进行缩放。
 * @param mode 压缩模式
 * @param width 二倍图设计稿宽度
 * @param height 二倍图设计稿高度
 * @param pixelRatio 设备像素比 默认：1
 * @returns {string}
 */
export function getAliOssImageUrl(url, limit = 0, mode = "fill", width, height, pixelRatio = 1) {
  return height ?
    `${url}?x-oss-process=image/resize,limit_${limit},m_${mode},w_${width/2*pixelRatio},h_${height/2*pixelRatio}` :
    `${url}?x-oss-process=image/resize,limit_${limit},m_${mode},w_${width/2*pixelRatio}`
}

/**
 * 腾讯OSS图片处理
 * 文档详见https://cloud.tencent.com/document/product/1246/45370
 * @param url 为服务器返回 imageUrl
 * @param mode 压缩模式
 * @param width 二倍图设计稿宽度
 * @param height 二倍图设计稿高度
 * @param pixelRatio 设备像素比 默认：1
 * @returns {string}
 */
export function getTenOssImageUrl(url, mode = 2, width, height, pixelRatio = 1) {
  return height ?
    `${url}?imageView2/${mode}/w/${width/2*pixelRatio}/h/${height/2*pixelRatio}` :
    `${url}?imageView2/${mode}/w/${width/2*pixelRatio}`

}

/**
 * 展开所有嵌套数组
 * @param arr 数组
 * @param d 层级
 * @returns {*}
 */
export function flatDeep(arr, d = 1) {
  return d > 0 ? arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? flatDeep(val, d - 1) : val), []) :
    arr.slice();
};


/**
 * 图片地址转换成base64
 * @param url 网络图片地址
 * @returns {Promise<unknown>}
 */
// #ifdef H5
export function getBase64(url) {
  return new Promise((resolve, reject) => {
    const Img = new Image()
    let dataURL = ''
    Img.setAttribute('crossOrigin', 'Anonymous')
    Img.src = url + '?v=' + Math.random()
    Img.onload = function() {
      // 要先确保图片完整获取到，这是个异步事件
      const canvas = document.createElement('canvas') // 创建canvas元素
      const width = Img.width // 确保canvas的尺寸和图片一样
      const height = Img.height
      canvas.width = width
      canvas.height = height
      canvas.getContext('2d').drawImage(Img, 0, 0, width, height) // 将图片绘制到canvas中
      dataURL = canvas.toDataURL('image/png') // 转换图片为dataURL
      resolve(dataURL)
    }
  })
}

/**
 * H5下载图片
 * @param url 网络图片地址
 */
export function funDownload(url) {
  // 创建隐藏的可下载链接
  let eleLink = document.createElement('a');
  eleLink.download = "share.png";
  eleLink.style.display = 'none';
  eleLink.href = url
  // eleLink.href = domImg.src
  // // 图片转base64地址
  // var canvas = document.createElement('canvas');
  // var context = canvas.getContext('2d');
  // var width = domImg.naturalWidth;
  // var height = domImg.naturalHeight;
  // context.drawImage(domImg, 0, 0);
  // // 如果是PNG图片，则canvas.toDataURL('image/png')
  // eleLink.href = canvas.toDataURL('image/jpeg');
  // 触发点击
  document.body.appendChild(eleLink);
  eleLink.click();
  // 然后移除
  document.body.removeChild(eleLink);
};

/**
 * 判断是否在微信浏览器打开页面
 * @returns {boolean}
 */
export function isWeixn() {
  let ua = navigator.userAgent.toLowerCase();
  if (ua.match(/MicroMessenger/i) == "micromessenger") {
    return true;
  } else {
    return false;
  }
}
// #endif
