Component({
	options: {
		multipleSlots: true
	},
	externalClasses: ['my-class', 'nav-class', 'nav-back-class', 'nav-title-class'],
	properties: {
		useNavBar: {
			type: Boolean,
			value: true
		},
		title: {
			type: String,
			value: ''
		},
		titleAlign: {
			type: String,
			value: 'center',
			observer: 'obTitleAlign'
		},
		background: {
			type: String,
			value: 'red'
		},
		immerse: {
			type: Boolean,
			value: false
		},
		showBack: {
			type: Boolean,
			value: false
		},
		backMode: {
			type: String,
			value: 'default' // 默认返回上级页面
		},
		showMask: {
			type: Boolean,
			value: false
		}
	},
	data: {},
	lifetimes: {
		attached() {
			this.selectOwnerComponent().pageRoot = this;
		}
	},
	methods: {
		onNavBarClick(evt: TouchDetail) {
			this.triggerEvent('navBarClick', evt.detail, {
				bubbles: true,
				capturePhase: true,
				composed: true
			});
		},
		onMaskClick(evt: TouchDetail) {
			this.triggerEvent('maskClick', evt.detail, {
				bubbles: true,
				capturePhase: true,
				composed: true
			});
		}
	}
});
