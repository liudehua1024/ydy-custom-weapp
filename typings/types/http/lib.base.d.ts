/** request **/

/** 自定义配置结构 */
interface RequestCustomConfig {
	/** 是否展示加载框 */
	isShowLoading?: boolean;
	/** loading显示配置,isShowLoading为true时有效 */
	loadingOpt?: CustomToastOptions;
	/** 是否展示错误消息提示 */
	isShowErrMsgToast?: boolean;
	/** 是否使用Token */
	useToken?: boolean;
}

/** 全局请求配置结构 */
interface GlobalRequestConfig {
	/** 基础地址 */
	baseUrl?: string;
	/** 全局header */
	header?: HttpHeader;
	/** 超时时间，单位为毫秒 */
	timeout?: number;
	/** 自定义配置信息 */
	custom?: RequestCustomConfig;
}

/** 请求配置结构 */
interface RequestConfig {
	/** 基础地址 **/
	baseUrl?: string;
	/** 地址 **/
	url: string;
	/** 请求类型 **/
	method: HttpMethod;
	/** header **/
	header?: HttpHeader;
	/** 请求的参数 **/
	data?: HttpData;
	/** 返回参数data的类型 **/
	dataType?: 'json' | '其他';
	/** 开启 cache */
	enableCache?: boolean;
	/** 超时时间 **/
	timeout?: number;
	/** 自定义配置信息 */
	custom?: RequestCustomConfig;
}

/** 分页请求结构体 */
interface PaginationReq {
	pageSize?: number;
	page?: number;
	orderBy?: string;
}

/** response **/

/** 响应 */
interface ResponseOptions<T> {
	data: T;
	errMsg: string;
	header: HttpHeader;
	statusCode: number;
	requestOption: RequestConfig;
}

/** 服务器响应结构体 */
interface ResponseResult<T extends void | string | Record<string, any>> {
	code: number;
	msg: string;
	data: T;
}

/** 分页信息结构体 */
interface PaginationMeta {
	total: number;
	currentPage: number;
	pageSize: number;
	hasNext: boolean;
}

/** 分页结果结构体 */
interface Pagination<T> {
	data: T;
	meta: PaginationMeta;
}

/** callback **/

/** 请求错误 **/
interface RequestError {
	statusCode: number;
	code: number;
	msg: string;
}

/** 请求回调 **/
interface RequestCallback<T> {
	ready?: (config: RequestConfig, task: HttpRequestTask) => void;
	success: (res: ResponseResult<T>) => void;
	fail?: (err: RequestError) => void;
	complete?: () => void;
}

/** 请求任务 **/
interface HttpRequestTask {
	req: RequestConfig;
	wxTask: WechatMiniprogram.RequestTask;
}

/** 包含自定义配置和 **/
type CustomConfigReq<T, R> = {
	other?: Record<string, any>;
	custom?: RequestCustomConfig;
	callback?: RequestCallback<R>;
} & (T extends void ? { req?: T } : { req: T });
