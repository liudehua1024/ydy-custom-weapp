Component({
	options: {
		pureDataPattern: /^_/
	},
	externalClasses: ['my-class'],
	properties: {
		height: {
			// px
			type: Number,
			value: 60,
			observer: 'genContainerStyle'
		},
		animated: {
			type: Boolean,
			value: true
		},
		show: {
			type: Boolean,
			value: true,
			observer: 'obShow'
		},
		duration: {
			type: Number,
			value: 500
		},
		loadingTips: {
			type: String,
			value: '加载中'
		},
		loadingIconSize: {
			// px
			type: Number,
			value: 20,
			observer: 'genLoadingIconStyle'
		}
	},
	data: {
		containerStyle: '',
		loadingIconStyle: ''
	},
	lifetimes: {
		attached() {
			const { height, loadingIconSize } = this.data;
			this.genContainerStyle(height);
			this.genLoadingIconStyle(loadingIconSize);
		}
	},
	methods: {
		obShow(show: boolean) {
			if (!show) {
				this.hiddenView();
			} else {
				this.showView();
			}
		},
		genContainerStyle(height: number) {
			const containerStyle = wx.$viewHelper.toCssStyleString({
				height: `${height}px`
			});
			this.setData({ containerStyle });
		},
		genLoadingIconStyle(loadingIconSize: number | string) {
			const loadingIconStyle = wx.$viewHelper.toCssStyleString({
				width: `${loadingIconSize}px`,
				height: `${loadingIconSize}px`
			});
			this.setData({ loadingIconStyle });
		},
		showView() {
			const { animated, duration, height } = this.data;
			if (animated) {
				this.animate('#loading-view', [{ height: 0 }, { height: height + 'px' }], duration);
			} else {
				this.clearAnimation('#loading-view');
			}
		},
		hiddenView() {
			const { animated, duration, height } = this.data;
			this.animate(
				'#loading-view',
				[{ height: height }, { height: 0 }],
				animated ? duration : 1,
				() => {
					this.onHidden();
				}
			);
		},
		onHidden() {
			this.triggerEvent(
				'onHidden',
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
