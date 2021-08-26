Component({
	externalClasses: ['my-class', 'load-end-class', 'load-end-line-class'],
	properties: {
		height: {
			// px
			type: Number,
			value: 60
		},
		loadingState: {
			type: Boolean,
			value: true
		},
		loadingTips: {
			type: String,
			value: '正在加载'
		},
		loadingIconSize: {
			// px
			type: Number,
			value: 20
		},
		loadEndTips: {
			type: String,
			value: '我也是有底线的'
		},
		// 是否已经到底
		loadEndState: {
			type: Boolean,
			value: false
		},
		useCustomLoadEnd: {
			type: Boolean,
			value: false
		}
	},
	data: {}
});
