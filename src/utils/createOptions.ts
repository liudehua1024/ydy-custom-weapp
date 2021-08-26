function handlePageEventOption(opt: WxPage.Options) {
	if (!wx.$isUtils.isEmpty(opt.$eventBusListeners)) {
		opt.$initBusGroup = function () {
			this.$eventBusGroup = wx.$eventBus.createEventBusGroup();
			wx.$eventBus.registerEventBusGroup(this.$eventBusGroup);

			const listeners = this.$eventBusListeners;
			if (listeners) {
				Object.keys(listeners).forEach((key) => {
					let listener = listeners[key];
					if (wx.$isUtils.isFun(listener)) {
						listener = { onEvent: listener } as EventBusListener;
					}

					if (!wx.$isUtils.isFun(listener.onEvent)) return;

					const methodeName = `_eventCallFun_${key}_`;
					this[methodeName] = listener.onEvent;

					listener.onEvent = (data: WxPage.DataOption) => {
						if (wx.$isUtils.isFun(this[methodeName])) this[methodeName](data);
					};

					this.$eventBusGroup?.registerEventListener(key, listener);
				});
			}
		};

		opt.$removeEventGroup = function () {
			if (this.$eventBusGroup) {
				wx.$eventBus.unregisterEventBusGroup(this.$eventBusGroup);
			}
		};
	}
	return opt;
}

export const handlePageOption: HandlePageOption = (opt: WxPage.Options) => {
	handlePageEventOption(opt);
	const newOpt: WxPage.Options & Omit<WxPage.OtherInstanceOption, '$jsonParams'> = {
		setTitle(title: string) {
			if (this.pageRoot && this.pageRoot.data) {
				const { useNavBar } = this.pageRoot.data;
				if (useNavBar) {
					this.pageRoot.setData({ title });
				}
			}
			wx.setNavigationBarTitle({ title }).then();
		},
		setBackState(state: boolean) {
			if (this.pageRoot && this.pageRoot.data) {
				const { useNavBar } = this.pageRoot.data;
				if (useNavBar) {
					this.pageRoot.setData({ showBack: state });
				}
			}
		},
		onLoad(query: Record<string, string | undefined>): void | Promise<void> {
			if (this.$main) {
				wx.$router.init(this);
			}

			this.setBackState(wx.$router.getRouteStack().length > 1);

			this.$api = wx.$createApiRequest();
			const jsonParams = this.$jsonParams !== undefined ? this.$jsonParams : true;
			if (jsonParams) {
				const { params } = query;
				if (params) {
					try {
						const obj = JSON.parse(params);
						if (obj) {
							delete query.params;
							Object.assign(query, obj);
						}
					} catch (e) {}
				}
			}
			if (wx.$isUtils.isFun(this._onLoad)) this._onLoad(query);
			// 在onLoad执行后再注册事件,避免有些数据还未初始化
			if (wx.$isUtils.isFun(this.$initBusGroup)) this.$initBusGroup();
		},
		onUnload(): void | Promise<void> {
			if (wx.$isUtils.isFun(this.$removeEventGroup)) {
				this.$removeEventGroup();
			}
			if (this.$api) {
				this.$api.stopTask();
			}
			if (wx.$isUtils.isFun(this._onUnload)) this._onUnload();
		},
		_onLoad: opt.onLoad,
		_onUnload: opt.onUnload
	};

	return Object.assign(opt, newOpt);
};
