Component({
	externalClasses: ['my-class'],
	properties: {
		mode: { type: String, value: 'aspectFill' },
		defaultSrc: { type: String, value: '' },
		src: { type: String, value: '' },
		webp: { type: Boolean, value: false },
		loadState: { type: Boolean, value: false }
	},
	data: {
		loadSuccess: false
	},
	observers: {
		'loadSuccess': function (loadSuccess: boolean) {
			this.setData({
				loadState: loadSuccess
			});
		}
	},
	methods: {
		onLoadError(_: TouchDetail) {
			this.setData({
				loadSuccess: false
			});
		},
		onLoadSuccess(_: TouchDetail) {
			this.setData({
				loadSuccess: true
			});
		}
	}
});
