const dialogLevel = {
	UpdateTipDialog: 3,
	LoginTipDialog: 2,
	Normal: 1,
	None: 0
};

const defTipModalOptions: ModalOptions = {
	title: '提示',
	confirmText: '确定',
	cancelText: '取消',
	level: dialogLevel.Normal
};

const dialogState = {
	curLevel: dialogLevel.None
};

/**
 * 显示dialog
 * @param opt
 */
function showDialog(opt: ModalOptions) {
	const { level } = Object.assign({ level: dialogLevel.Normal }, opt); // 默认普通级
	if (level < dialogState.curLevel) {
		console.debug(
			`低级别dialog无法覆盖高级别弹窗,level =${level} curLevel=${dialogState.curLevel}`
		);
		return;
	}

	dialogState.curLevel = level;
	if (wx.$isUtils.isFun(opt.ready)) opt.ready();
	wx.showModal(opt);
}

/**
 * 简单提示窗
 * @param opt
 */
function showTipDialog(opt: TipModalOptions) {
	showDialog(Object.assign({}, defTipModalOptions, opt));
}

/**
 * 显示微信登录失败提示框
 */
function showLoginFailDialog(errMsg: string) {
	let content = '';
	if (errMsg) {
		content = '登录失败：' + errMsg;
	} else {
		content = '登录失败，请检查网络是否连接正常！';
	}
	showDialog({
		title: '登录失败',
		content: content,
		confirmText: '重新登录',
		level: dialogLevel.LoginTipDialog,
		success: (res) => {
			if (res.confirm) {
				// 登录
				wx.$loginHelper.authLogin();
			}
		}
	});
}

/**
 * 显示未登录提示框
 */
function showNoLoginDialog() {
	showDialog({
		title: '未登录',
		content: '未登录，请登录后再进行操作！',
		confirmText: '登录',
		level: dialogLevel.LoginTipDialog,
		success(res) {
			if (res.confirm) {
				// 登录
				wx.$loginHelper.authLogin();
			}
		}
	});
}

/**
 * 显示更新提示
 */
function showUpdateTipDialog() {
	showDialog({
		title: '更新提示',
		content: '版本已更新，重启应用后生效！',
		showCancel: false,
		confirmText: '重启应用',
		level: dialogLevel.UpdateTipDialog,
		ready() {
			wx.$toastUtils.setToastEnable(false);
		},
		success(res) {
			console.log(res);
			// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
			wx.getUpdateManager().applyUpdate(); // 不管点击外部或是点击确定都重启应用
		}
	});
}

/**
 * 网络连接失败提示
 */
function showNetFailedDialog() {
	showTipDialog({
		title: '提示',
		content: '网络连接失败，请检查网络！',
		confirmText: '知道了',
		showCancel: false
	});
}

export const dialogUtils: DialogUtils = {
	showDialog: showDialog,
	showTipDialog: showTipDialog,
	showLoginFailDialog: showLoginFailDialog,
	showNoLoginDialog: showNoLoginDialog,
	showUpdateTipDialog: showUpdateTipDialog,
	showNetFailedDialog: showNetFailedDialog
};
