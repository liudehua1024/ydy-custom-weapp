Component({
	options: {
		pureDataPattern: /^_/
	},
	properties: {
		height: { type: Number, value: wx.constants.tabBarHeight },
		background: { type: String, value: '#FFFFFF' },
		borderStyle: { type: String, value: '#F0F0F0' },
		textImgPadding: { type: Number, value: 8 },
		textSize: { type: Number, value: 28 },
		color: { type: String, value: '#595959' },
		selectedColor: { type: String, value: '#F55938' },
		imgSize: { type: Number, value: 46 }, // rpx
		showDot: { type: Boolean },
		selectedName: { type: String, observer: 'selectChange' }, // 默认选中
		items: { type: Array, value: [] as Array<TabBarItem> }
	},
	data: {},
	lifetimes: {
		attached() {
			// const { selectedName, items } = this.data;
			// if (!selectedName && items?.length > 0) {
			// 	const { name } = items[0];
			// 	this.setData({
			// 		selectedName: name
			// 	});
			// }
		}
	},
	methods: {
		selectChange(selectedName: string, oldSelectedName: string) {
			this.callOnSwitch(selectedName, oldSelectedName);
		},
		itemClick(e: TouchEvent) {
			const { name } = e.currentTarget.dataset;
			this.setData({
				selectedName: name
			});
		},
		callOnSwitch(name: string, old: string) {
			this.triggerEvent(
				'onSwitch',
				{ curSelectedName: name, oldSelectedName: old },
				{
					bubbles: true,
					composed: true,
					capturePhase: true
				}
			);
		}
	}
});
