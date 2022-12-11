
export class NetworkError extends Error {
	constructor(message, url, data) {
		super(message)
		this.url = url
		this.data = data;
	}
}

export class RequestError extends Error {
	constructor(message, url, statusCode, responseBody) {
		super(message)
		this.url = url;
		this.statusCode = statusCode;
		this.responseBody = responseBody;
	}
}

export class ResponseError extends RequestError {
	constructor(message, url, statusCode, responseBody) {
		super(message, url, statusCode, responseBody)
		this.message = responseBody.msg ?? message;
	}
}

export default async (config, error, response) => {
	if (error) {
		if (error.errMsg && error.errMsg == 'request:fail ') throw new NetworkError('网络连接异常', config.url, config.data)
		else throw new Error(error.errMsg ?? '未定义的请求错误')
	}
	if (response.statusCode != 200) throw new RequestError(`Request fail with status code ${response.statusCode}`, config.url, response.statusCode, response.data)
	if (config.auto_throw !== false && response.data.code != 0) {
		uni.showToast({
			icon: 'none',
			title: response.data.msg,
		});
		throw new ResponseError(`Response Server Error`, config.url, response.statusCode, response.data)
	}
	return response.data
}