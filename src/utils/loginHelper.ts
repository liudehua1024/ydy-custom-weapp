interface LoginOptions {
	/** 是否静默登录,不做显示提示 */
	silent?: boolean;
	/** 登录错误时是否显示错误Dialog */
	showFailDialog?: boolean;
}

export class MyLoginHelper implements LoginHelper {
	readonly stateChangeTag = 'loginStateChange';
	loginState: LoginResp;
	apiCommand: ApiRequest;

	constructor() {
		this.loginState = {} as LoginResp;
		this.apiCommand = wx.$createApiRequest();
	}

	checkLogin(): boolean {
		return !!this.loginState.token;
	}

	getToken(): string | undefined {
		return this.loginState.token;
	}

	getLoginState() {
		return this.loginState;
	}

	private setLoginState(loginState: LoginResp) {
		if (wx.$isUtils.isEmpty(loginState)) loginState = {} as LoginResp;
		this.loginState = loginState;
		this.callLoginEvent();
	}

	clearLoginState(callEvent: boolean = false) {
		const oldState = this.checkLogin();

		Object.keys(this.loginState).forEach((key) => {
			delete (this.loginState as Record<string, any>)[key];
		});

		if (oldState && callEvent) {
			this.callLoginEvent();
		}
	}

	private callLoginEvent() {
		wx.$eventBus.pushStickEvent(this.stateChangeTag, this.checkLogin());
	}

	/**
	 * 自动登录
	 */
	autoLogin() {
		this.codeLogin({ silent: true });
	}

	/**
	 * 必须在绑定在点击事件上才能调用
	 */
	authLogin() {
		const opt: LoginOptions = {
			silent: false
		};
		wx.getUserProfile({
			withCredentials: false,
			desc: '用于注册/注册',
			lang: 'zh_CN',
			success: (res) => {
				const { userInfo } = res;
				this.codeLogin(opt, userInfo);
			},
			fail: (res) => {
				console.error('微信授权失败:', res.errMsg);
				MyLoginHelper.showLoginFailMsg('微信授权失败', opt);
			}
		});
	}

	private codeLogin(opt: LoginOptions, req?: Omit<LoginReq, 'code'>) {
		wx.login({
			success: (res) => {
				this.login(opt, Object.assign({ code: res.code }, req));
			},
			fail: (res) => {
				console.error('微信授权失败:', res.errMsg);
				MyLoginHelper.showLoginFailMsg('微信授权失败', opt);
			}
		});
	}

	private login(opt: LoginOptions, req: LoginReq) {
		this.apiCommand.wxAuthLogin({
			req,
			custom: { isShowLoading: !opt.silent, isShowErrMsgToast: false },
			callback: {
				success: (res) => {
					this.setLoginState(res.data);
				},
				fail: (err) => {
					this.clearLoginState();
					MyLoginHelper.showLoginFailMsg('登录失败:' + err.msg, opt);
				}
			}
		});
	}

	private static showLoginFailMsg(errMsg: string, opt: LoginOptions) {
		const { silent, showFailDialog } = opt;
		if (silent) {
		} else if (!showFailDialog) {
			wx.$toastUtils.showMsgToast(errMsg);
		} else {
			wx.$dialogUtils.showLoginFailDialog(errMsg);
		}
	}
}
