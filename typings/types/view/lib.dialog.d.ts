interface ModalCallbackResult {
	errMsg: string;
}

interface ModalSuccessResult extends ModalCallbackResult {
	/** 为 true 时，表示用户点击了取消 */
	cancel: boolean;
	/** 为 true 时，表示用户点击了确定按钮 */
	confirm: boolean;
	/** editable 为 true 时，用户输入的文本 */
	content: string;
}

interface ModalCallback {
	/** 调用之前 */
	ready?: () => void;
	/** 接口调用成功的回调函数 */
	success?: (res: ModalSuccessResult) => void;
	/** 接口调用失败的回调函数 */
	fail?: (err: ModalCallbackResult) => void;
	/** 接口调用结束的回调函数（调用成功、失败都会执行） */
	complete?: () => void;
}

interface BaseModalOptions extends ModalCallback {
	/** 弹窗等级 */
	level?: number;
	/** 弹窗等级相同时是否允许覆盖 */
	cover?: number;
}

interface TipModalOptions extends BaseModalOptions {
	/** 提示的标题 */
	title?: string;
	/** 提示的内容 */
	content?: string;
	/** 确认按钮的文字 */
	confirmText?: string;
	/** 确认按钮的文字颜色，必须是 16 进制格式的颜色字符串 */
	confirmColor?: string;
	/** 取消按钮的文字 */
	cancelText?: string;
	/** 是否显示取消按钮 */
	showCancel?: boolean;
	/** 取消按钮的文字颜色，必须是 16 进制格式的颜色字符串 */
	cancelColor?: string;
}

interface EditTextModalOptions extends TipModalOptions {
	/** 是否显示输入框 */
	editable?: boolean;
	/** 输入框提示文本 */
	placeholderText?: string;
}

type ModalOptions = EditTextModalOptions;
