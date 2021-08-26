import { HttpError } from 'constant';

export function checkStatus(status: number): string {
	switch (status) {
		case 400:
			return HttpError.Error400;
		case 401:
			// 此处需要清空缓存的登录信息
			wx.$loginHelper.clearLoginState(true);
			return HttpError.Error401;
		case 403:
			return HttpError.Error403;
		case 404:
			return HttpError.Error404;
		case 405:
			return HttpError.Error405;
		case 408:
			return HttpError.Error408;
		case 500:
			return HttpError.Error500;
		case 501:
			return HttpError.Error501;
		case 502:
			return HttpError.Error502;
		case 503:
			return HttpError.Error503;
		case 504:
			return HttpError.Error504;
		case 505:
			return HttpError.Error505;
	}

	return '';
}
