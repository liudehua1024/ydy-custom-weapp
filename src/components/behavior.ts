export const screenConfigBehavior = Behavior({
	data: {
		screenConfig: wx.$getAppGlobalData().screenConfig
	}
});

export const httpApiBehavior = Behavior({
	data: {},
	lifetimes: {
		created() {
			this.$api = wx.$createApiRequest();
		}
	}
} as WxBehavior.Options);

export const eventBusBehavior = Behavior({
	data: {},
	lifetimes: {
		attached() {
			if (wx.$isUtils.isFun(this.$initBusGroup)) this.$initBusGroup();
		},
		detached() {
			if (wx.$isUtils.isFun(this.$removeEventGroup)) this.$removeEventGroup();
		}
	},
	definitionFilter: function (defFields: WxBehavior.Options) {
		const { $eventBusListeners } = defFields || {};
		if (!wx.$isUtils.isEmpty($eventBusListeners)) {
			const opt: WxBehavior.Options = {
				methods: {
					'$initBusGroup': function () {
						this.$eventBusGroup = wx.$eventBus.createEventBusGroup();
						wx.$eventBus.registerEventBusGroup(this.$eventBusGroup);

						const listeners = $eventBusListeners;
						if (listeners) {
							Object.keys(listeners).forEach((key) => {
								let listener = listeners[key];
								if (wx.$isUtils.isFun(listener)) {
									listener = { onEvent: listener } as EventBusListener;
								}

								if (!wx.$isUtils.isFun(listener.onEvent)) return;

								const methodeName = `_eventCallFun_${key}_`;
								this[methodeName] = listener.onEvent;

								listener.onEvent = (data) => {
									if (wx.$isUtils.isFun(this[methodeName])) this[methodeName](data);
								};

								this.$eventBusGroup?.registerEventListener(key, listener);
							});
						}
					},
					'$removeEventGroup': function () {
						if (this.$eventBusGroup) {
							wx.$eventBus.unregisterEventBusGroup(this.$eventBusGroup);
						}
					}
				}
			};

			Object.assign(defFields.methods, opt.methods);
		}
	}
} as WxBehavior.Options);

export const componentBehavior = Behavior({
	behaviors: [httpApiBehavior, eventBusBehavior],
	definitionFilter: (defFields: WxBehavior.Options, definitionFilterArr) => {
		const { $eventBusListeners } = defFields;
		if ($eventBusListeners) {
			if (wx.$isUtils.isArray(definitionFilterArr)) {
				definitionFilterArr[0](defFields);
			}
		}
	}
} as WxBehavior.Options);

export const componentTabPageBehavior = Behavior({
	properties: {
		show: Boolean
	},
	data: {
		firstShow: true
	},
	observers: {
		'show': function (show: boolean) {
			if (!show) return;

			if (wx.$isUtils.isFun(this.onShow)) this.onShow();
			if (this.data.firstShow) {
				this.setData({ firstShow: false });
				if (wx.$isUtils.isFun(this.onFirstShow)) this.onFirstShow();
			}
		}
	}
} as WxBehavior.Options);
