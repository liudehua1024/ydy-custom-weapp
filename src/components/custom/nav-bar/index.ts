Component({
	options: {
		pureDataPattern: /^_/
	},
	externalClasses: ['my-class', 'back-class', 'title-class'],
	properties: {
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
		}
	},
	data: {
		_navBarStyle: {},
		navBarStyleStr: '',
		statusBarStyleStr: '',
		_backStyle: {},
		backStyleStr: '',
		_titleStyle: {},
		titleStyleStr: '',
		_titleLeftStyleStr: '',
		_titleCenterStyleStr: ''
	},
	lifetimes: {
		attached() {
			const { background, immerse } = this.data;
			const { navBarConfig, screenConfig } = wx.$getAppGlobalData();

			const navBarStyle: Record<string, any> = {
				'height': navBarConfig.navBarHeight + navBarConfig.statusBarHeight + 'px',
				'position': immerse ? 'fixed' : 'relative',
				'background': background ? background : ''
			};

			const statusBarStyle: Record<string, any> = {
				'height': navBarConfig.statusBarHeight + 'px',
				'background': 'rgba(0,0,0,0.3)'
			};

			const marginRight = screenConfig.windowWidth - navBarConfig.capsuleMenuRect.right;

			const backStyle = {
				'width': navBarConfig.capsuleMenuRect.height + 'px',
				'height': navBarConfig.capsuleMenuRect.height + 'px',
				'top': navBarConfig.capsuleMenuRect.top + 'px',
				'margin-left': immerse ? marginRight + 'px' : '',
				'border-radius': immerse ? '50%' : '',
				'background': immerse ? 'rgba(0,0,0,0.3)' : ''
			};

			const titleLeftStyle: Record<string, any> = {
				'width': navBarConfig.capsuleMenuRect.left - navBarConfig.capsuleMenuRect.height + 'px',
				'height': navBarConfig.navBarHeight + 'px',
				'left': navBarConfig.navBarHeight + 'px'
			};

			const titleCenterStyle: Record<string, any> = {
				width:
					navBarConfig.capsuleMenuRect.left -
					navBarConfig.capsuleMenuRect.width -
					marginRight +
					'px',
				height: navBarConfig.navBarHeight + 'px',
				left: navBarConfig.capsuleMenuRect.width + marginRight + 'px',
				'justify-content': 'center'
			};

			this.setData({
				_navBarStyle: navBarStyle,
				navBarStyleStr: wx.$viewHelper.toCssStyleString(navBarStyle),
				statusBarStyleStr: wx.$viewHelper.toCssStyleString(statusBarStyle),
				_backStyle: backStyle,
				backStyleStr: wx.$viewHelper.toCssStyleString(backStyle),
				_titleLeftStyleStr: wx.$viewHelper.toCssStyleString(titleLeftStyle),
				_titleCenterStyleStr: wx.$viewHelper.toCssStyleString(titleCenterStyle)
			});

			const { titleAlign } = this.data;
			this.obTitleAlign(titleAlign);
		}
	},
	methods: {
		obTitleAlign(titleAlign: string) {
			if (!titleAlign) {
				titleAlign = 'left';
			}

			if (titleAlign?.toLowerCase() === 'left') {
				this.setData({ titleStyleStr: this.data._titleLeftStyleStr });
			} else {
				this.setData({ titleStyleStr: this.data._titleCenterStyleStr });
			}
		},
		onBack() {
			const { backMode } = this.data;
			if (backMode === 'default') {
				wx.$router.pop(1).then();
			} else {
				this.triggerEvent('onBack');
			}
		}
	}
});
