import { getToken } from "@/utils/storage";
import cloneDeep from 'lodash/cloneDeep'
import pickBy from 'lodash/pickBy'
import isUndefined from 'lodash/isUndefined'

/**
 * 约定config的额外参数
 * @param {string|undefined} base_url = [undefined] 当设置值时,不自动追加api_base_url
 * @param {boolean} no_token = [true] 当设置为false时,不自动追加token
 * @param {string} content_type = ['application/x-www-form-urlencoded;charset=utf-8'] 设置Content-Tpype
 * @param {boolean} is_upload = [undefined]
 * @param {Function} before_request = [undefined] 当传入函数时,在本函数最后执行回调
 * @param {boolean} auto_throw = [true] res.code != 0 时是否自动提示错误并抛出异常
 */
export default async (config) => {
	// 处理请求前缀
	if (typeof config.base_url == "undefined") config.url = `${process.env.VUE_APP_BASE_API}${config.url}`;
	else config.url = `${config.base_url}${config.url}`;

	// 处理请求方式
	if (typeof config.method == 'undefined') config.method = 'post';

	// 挂载token
	config.data = Object.assign({}, cloneDeep(config.data))
	if (config.no_token !== false) {
		config.data.TOKEN = getToken()
	}

	if (!config.is_upload) {
		// 处理ContentType
		if (!config.header) config.header = {};
		config.header["Content-Type"] = typeof config.content_type == "undefined" ? "application/x-www-form-urlencoded;charset=utf-8" : config.content_type;

		// 过滤参数undefined
		if (typeof config.data == "object") config.data = pickBy(config.data, (val) => !isUndefined(val));
	}

	// 处理回调
	if (typeof config.before_request == "function") {
		return config.before_request(config);
	}

	return config;
};
