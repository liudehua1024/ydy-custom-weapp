/** 全局请求配置 */
interface GlobalRequestOption {
	/** 基础地址 */
	baseUrl: string;
	/** 全局header */
	header?: HttpHeader;
	/** 超时时间，单位为毫秒 */
	timeout?: number;
}

/** 请求基本配置 */
interface RequestOption {
	/** 开发者服务器接口地址 */
	url: string;
	/** 请求的参数 */
	data?: string | Record<string, any> | ArrayBuffer;
	/** 返回的数据格式
	 *
	 * 可选值：
	 * - 'json': 返回的数据为 JSON，返回后会对返回的数据进行一次 JSON.parse;
	 * - '其他': 不对返回的内容进行 JSON.parse; */
	dataType?: 'json' | '其他';
	/** 开启 cache */
	enableCache?: boolean;
	/** 设置请求的 header */
	header?: HttpHeader;
	/** HTTP 请求方法 */
	method?: 'OPTIONS' | 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT';
	/** 响应的数据类型 */
	responseType?: 'text' | 'arraybuffer';
	/** 超时时间，单位为毫秒 */
	timeout?: number;
}

/** 自定义请求配置 */
interface CustomRequestOption extends RequestOption {
	/** 是否展示加载框 */
	isShowLoading?: boolean;
	/** 是否处理请求结果 */
	isTransformRequestResult?: boolean;
	/** 是否展示错误消息提示 */
	isShowErrMsgToast?: boolean;
	/** 成功返回数据是否为空 */
	successResultVoid?: boolean;
}

/** 响应信息 */
interface Response<T> {
	data: ResponseResult<T>;
	errMsg: string;
	heard: HttpHeader;
	statusCode: number;
	requestOption: RequestOption;
}
