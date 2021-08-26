const defLoadingOptions: LoadingOption = {
	title: '',
	mask: true
};

const defToastOptions: ToastOptions = {
	title: '',
	duration: 2500,
	mask: false
};

const toastState = {
	toastEnable: true,
	isShowing: false,
	isLoading: false
};

const showToast = (opt: ToastOptions) => {
	if (!toastState.toastEnable) return;
	wx.showToast(
		Object.assign(
			{
				success: () => {
					toastState.isShowing = true;
				}
			},
			opt
		)
	);
};

const hideToast = () => {
	wx.hideToast({
		success: () => {
			toastState.isShowing = false;
		}
	});
};

const showSuccessToast = (opt?: CustomToastOptions | string) => {
	if (typeof opt === 'string') {
		opt = { title: opt };
	}
	showToast(Object.assign({ icon: 'success' }, defToastOptions, opt));
};

const showFailToast = (opt?: CustomToastOptions | string) => {
	if (typeof opt === 'string') {
		opt = { title: opt };
	}
	showToast(Object.assign({ icon: 'error' }, defToastOptions, opt));
};

const showMsgToast = (opt?: CustomToastOptions | string) => {
	if (typeof opt === 'string') {
		opt = { title: opt };
	}
	showToast(Object.assign({ icon: 'none' }, defToastOptions, opt));
};

const showLoading = (opt?: CustomToastOptions | string) => {
	if (typeof opt === 'string') {
		opt = { title: opt };
	}
	wx.showLoading(
		Object.assign(
			{
				success: () => {
					toastState.isLoading = true;
				}
			},
			defLoadingOptions,
			opt
		)
	);
};

const hideLoading = () => {
	wx.hideLoading({
		success: () => {
			toastState.isLoading = false;
		}
	});
};

const setToastEnable = (enable: boolean) => {
	if (!enable) {
		hideToast();
	}
	toastState.toastEnable = enable;
};

export const toastUtils: ToastUtils = {
	showToast: showToast,
	hideToast: hideToast,
	showSuccessToast: showSuccessToast,
	showFailToast: showFailToast,
	showMsgToast: showMsgToast,
	showLoading: showLoading,
	hideLoading: hideLoading,
	setToastEnable: setToastEnable
};
