import { checkStatus } from 'checkStatus';
import { CustomStatusCode, RequestError, ResultSuccessCode } from 'constant';

class HttpRequest {
	private readonly globalConfig: GlobalRequestConfig;
	private readonly globalReqCustomConfig: RequestCustomConfig;
	private readonly taskList: Array<HttpRequestTask>;
	private state = true;

	constructor(globalConfig: GlobalRequestConfig, globalReqCustomConfig: RequestCustomConfig) {
		this.globalConfig = globalConfig;
		this.globalReqCustomConfig = globalReqCustomConfig;
		this.taskList = new Array<HttpRequestTask>();
	}

	private addTask(task: HttpRequestTask) {
		this.taskList.push(task);
	}

	private removeTask(task: HttpRequestTask) {
		if (!task) return;
		const index = this.taskList.indexOf(task);
		if (index != -1) {
			this.taskList.splice(index, 1);
		}
	}

	stopAll() {
		this.state = false;
		const len = this.taskList.length;
		for (let i = 0; i < len; i++) {
			const task = this.taskList[i];
			if (task && task.wxTask) {
				task.wxTask.abort();
			}
		}
		this.taskList.splice(0, len);
		this.state = true;
	}

	request<T>(reqConfig: RequestConfig, callback?: RequestCallback<T>): void {
		if (!this.state) return;
		this.requestBefore(this.globalConfig, reqConfig);
		const requestTask = {
			req: reqConfig
		} as HttpRequestTask;

		this.addTask(requestTask);
		if (callback && wx.$isUtils.isFun(callback.ready)) {
			callback.ready(reqConfig, requestTask);
		}

		requestTask.wxTask = wx.request<ResponseResult<T>>({
			url: reqConfig.url,
			method: reqConfig.method,
			header: reqConfig.header,
			data: reqConfig.data,
			dataType: reqConfig.dataType,
			enableCache: reqConfig.enableCache,
			timeout: reqConfig.timeout,
			success: (res) => {
				this.removeTask(requestTask);
				const response = {
					data: res.data,
					header: res.header,
					statusCode: res.statusCode,
					errMsg: res.errMsg,
					requestOption: reqConfig
				} as ResponseOptions<ResponseResult<T>>;

				HttpRequest.requestAfter(response, callback);
			},
			fail: (res) => {
				this.removeTask(requestTask);
				const response = {
					errMsg: res.errMsg,
					requestOption: reqConfig
				} as ResponseOptions<ResponseResult<T>>;
				HttpRequest.requestAfter(response, callback);
			}
		});
	}

	private requestBefore(
		globalConfig: GlobalRequestConfig,
		reqConfig: RequestConfig
	): RequestConfig {
		HttpRequest.transformRequestConfig(globalConfig, reqConfig);

		if (reqConfig.baseUrl) {
			reqConfig.url = HttpRequest.genUrl(reqConfig.baseUrl, reqConfig.url);
		}

		reqConfig = HttpRequest.transformRequestParams(reqConfig);

		reqConfig.custom = Object.assign({}, this.globalReqCustomConfig, reqConfig.custom);
		if (reqConfig.custom?.isShowLoading) {
			wx.$toastUtils.showLoading(reqConfig.custom.loadingOpt);
		}

		if (reqConfig.custom?.useToken) {
			reqConfig.header = Object.assign({}, reqConfig.header, {
				'Authorization': 'Bearer ' + wx.$loginHelper.getToken()
			});
		}

		return reqConfig;
	}

	private static transformRequestConfig(
		globalConfig: GlobalRequestConfig,
		reqConfig: RequestConfig
	) {
		if (!reqConfig.baseUrl) {
			reqConfig.baseUrl = globalConfig.baseUrl;
		}

		if (!reqConfig.header) {
			reqConfig.header = globalConfig.header;
		} else {
			reqConfig.header = Object.assign({}, globalConfig.header, reqConfig.header);
		}

		if (!reqConfig.timeout) {
			reqConfig.timeout = globalConfig.timeout;
		}

		if (!reqConfig.custom) {
			reqConfig.custom = globalConfig.custom;
		} else {
			reqConfig.custom = Object.assign({}, globalConfig.custom, reqConfig.custom);
		}
	}

	private static requestAfter<T>(
		response: ResponseOptions<ResponseResult<T>>,
		callback?: RequestCallback<T>
	) {
		let { statusCode, errMsg, requestOption } = response;

		if (requestOption.custom && requestOption.custom.isShowLoading) {
			wx.$toastUtils.hideLoading();
		}

		const err: RequestError = {
			statusCode: 0,
			code: 0,
			msg: ''
		};

		if (statusCode === 200) {
			const { code, msg } = response.data;
			if (code == ResultSuccessCode) {
				if (callback && wx.$isUtils.isFun(callback.success)) {
					if (HttpRequest.isPageData(response.data.data)) {
						const { meta, data } = response.data.data;
						let curSize = 0;
						if (wx.$isUtils.isArray(data)) {
							curSize = data.length;
						}
						meta.hasNext = curSize == meta.pageSize;
					}
					callback.success(response.data);
				}
			} else {
				err.code = code;
				err.msg = msg;
			}
		} else if (statusCode > 0) {
			err.statusCode = statusCode;
			err.msg = checkStatus(statusCode);
		} else if (errMsg.endsWith('timeout')) {
			err.statusCode = CustomStatusCode.Timeout;
			err.msg = RequestError.ErrorTimeout;
		} else {
			err.statusCode = CustomStatusCode.Network;
			err.msg = RequestError.ErrorNetwork;
		}

		if (err.statusCode !== 0 || err.code !== 0) {
			if (requestOption.custom && requestOption.custom.isShowErrMsgToast) {
				wx.$toastUtils.showMsgToast(err.msg);
			}

			if (callback && wx.$isUtils.isFun(callback.fail)) {
				callback.fail(err);
			}
		}

		if (callback && wx.$isUtils.isFun(callback.complete)) {
			callback.complete();
		}
	}

	private static isPageData(data: any): data is Pagination<any> {
		if (data && data.hasOwnProperty('meta')) {
			const { meta } = data;
			return meta && meta.pageSize != undefined;
		}
		return false;
	}

	private static genUrl(baseUrl: string, url: string): string {
		const separator = '/';
		if (baseUrl.endsWith(separator)) {
			baseUrl = baseUrl.substring(baseUrl.length - 1);
		}
		if (url.startsWith(separator)) {
			url = url.substring(1, url.length);
		}
		return baseUrl + separator + url;
	}

	private static transformRequestParams(reqConfig: RequestConfig): RequestConfig {
		if (reqConfig.method === 'GET' || reqConfig.method === 'DELETE') {
			if (typeof reqConfig.data === 'object') {
				reqConfig.url += HttpRequest.paresQueryParams(reqConfig.data);
				reqConfig.data = undefined;
			}
		}
		return reqConfig;
	}

	private static paresQueryParams(
		params: Record<string, any>,
		arrayParamMode: '' | 's' | '[]' = ''
	): string {
		let str = '';
		Object.keys(params).forEach((k) => {
			const v = params[k];
			if (v) {
				let key = encodeURIComponent(k);
				if (str.length > 0) str += '&';
				let val = '';
				switch (typeof v) {
					case 'object':
						if (Array.isArray(v)) {
							key += arrayParamMode;
							val = v.join('&' + key + '=');
						} else {
							val = encodeURIComponent(v.toString());
						}
						break;
					case 'undefined':
						break;
					default:
						val = encodeURIComponent(v);
						break;
				}

				str += key + '=' + val;
			}
		});

		if (str.length > 0) {
			str = '?' + str;
		}

		return str;
	}
}

export const httpRequest = new HttpRequest(
	{
		baseUrl: 'http://192.168.0.132:8888',
		timeout: 5 * 1000
	},
	{
		isShowLoading: false,
		isShowErrMsgToast: true,
		useToken: false
	}
);
