Component({
	options: {
		multipleSlots: true,
		pureDataPattern: /^_/
	},
	externalClasses: ['my-class'],
	properties: {
		background: { type: String, value: 'none' },
		customStyle: { type: String, value: '' },
		enableScroll: { type: Boolean, value: true },
		showScrollBar: { type: Boolean, value: false },
		enableRefresher: { type: Boolean, value: false },
		refreshState: { type: Boolean, value: false },
		refresherThreshold: { type: Number, value: 60 },
		upperThreshold: { type: Number, value: 50 }, // 尽量大于20,不然有bug
		enableLoadMore: { type: Boolean, value: false },
		lowerThreshold: { type: Number, value: 80 }, // 尽量大于20,不然有bug
		scrollTop: { type: Number, value: 0 }
	},
	data: {
		scrollTop_: 0,
		pullArrowDeg: 0,
		pullTip: '下拉刷新',
		showPullTip: true,
		loadMoreProp: { enable: false, threshold: 0 }
	},
	observers: {
		'enableLoadMore,lowerThreshold': function(enableLoadMore, lowerThreshold) {
			this.setData({
				loadMoreProp: {
					enable: enableLoadMore,
					threshold: lowerThreshold
				}
			});
		}
	},
	lifetimes: {
		attached() {
			const query = this.createSelectorQuery();
			query.select('#container').boundingClientRect((result) => {
				if (!result) return;
				this.clientRect = result;
			});
			query.exec();
		}
	},
	methods: {
		onPullCancel(_: TouchEvent) {
			this.resetPullTip();
		},
		onPulling(evt: TouchEvent) {
			console.log('onPulling', evt);
			const { dy } = evt.detail;
			const { refresherThreshold } = this.data;
			const turnThreshold = refresherThreshold / 3;
			let deg = 0;
			if (dy - turnThreshold > 0) {
				deg = wx.$numUtils.toInt(
					((dy - turnThreshold) / (refresherThreshold - turnThreshold)) * 180
				);
			}

			let tip = '下拉刷新';
			if (deg >= 180) {
				deg = 180;
				tip = '松开刷新';
			} else if (deg < 0) {
				deg = 0;
			}
			this.setData({
				showPullTip: true,
				pullArrowDeg: wx.$numUtils.toInt(deg),
				pullTip: tip
			});
		},
		onPullRefresh(_: TouchEvent) {
			this.resetPullTip(false);
			this.triggerEvent('onRefresh', {}, { bubbles: true, capturePhase: true, composed: true });
		},
		resetPullTip(showPullTip: boolean = true) {
			this.setData({
				refreshState: !showPullTip,
				showPullTip: showPullTip,
				pullArrowDeg: 0,
				pullTip: '下拉刷新'
			});
		},
		onScroll(evt: TouchEvent) {
			const { scrollTop } = evt.detail;
			this.setData({ scrollTop, scrollTop_: scrollTop });
			const { width, height } = Object.assign({ width: 0, height: 0 }, this.clientRect);
			this.triggerEvent('scroll', Object.assign({ width, height }, evt.detail), {});
		},
		onScrollToUpper(evt: TouchEvent) {
			const { width, height } = Object.assign({ width: 0, height: 0 }, this.clientRect);
			this.triggerEvent('scrollToUpper', Object.assign({ width, height }, evt.detail), {
				composed: true
			});
		},
		onScrollToLower(evt: TouchEvent) {
			const { width, height } = Object.assign({ width: 0, height: 0 }, this.clientRect);
			this.triggerEvent('scrollToLower', Object.assign({ width, height }, evt.detail), {});
			this.onLoadMore();
		},
		onLoadMore() {
			const { refreshState, enableLoadMore } = this.data;
			// 正在刷新或者未启用下拉加载时无法触发加载更多
			if (refreshState || !enableLoadMore) return;
			this.triggerEvent(
				'onLoadMore',
				{},
				{
					bubbles: true,
					capturePhase: true,
					composed: true
				}
			);
		}
	}
});
