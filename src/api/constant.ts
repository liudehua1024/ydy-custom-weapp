/**
 * @description 请求成功返回的code
 */
export const ResultSuccessCode = 0;

/**
 * @description 请求被取消信息
 */
export const CancelRequestMsg = '请求被取消';

export const CustomStatusCode = {
	Timeout: -2,
	Network: -1
};

/**
 * @description HTTP错误信息
 */
export const HttpError = {
	Error400: '错误请求!',
	Error401: '令牌过期,请重新登录!',
	Error403: '没有API接口访问权限!',
	Error404: '访问服务器不存在的API!',
	Error405: '网络请求错误，请求方法未允许!',
	Error408: '请求超时!',
	Error500: '服务器端出错，请联系管理员!',
	Error501: '网络未实现!',
	Error502: '网络错误!',
	Error503: '服务不可用，服务器暂时过载或维护!',
	Error504: '网络超时!',
	Error505: 'http版本不支持该请求!'
};

/**
 * @description 请求错误信息
 */
export const RequestError = {
	ErrorUnknown: '未知错误!',
	ErrorTimeout: '请求超时!',
	ErrorNetwork: '网络错误，请检查网络!',
	ErrorRequestFail: '请求失败，请稍后重试!',
	ErrorNotResult: '响应错误!',
	ErrorResult: '响应内容格式错误!'
};
