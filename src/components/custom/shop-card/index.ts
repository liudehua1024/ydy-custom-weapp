Component({
	options: {
		multipleSlots: true
	},
	externalClasses: ['my-class', 'click-class'],
	properties: {
		shopInfo: {
			type: Object,
			value: {} as ShopInfo,
			observer: 'obShopInfo'
		}
	},
	data: {
		monthSales: 0,
		tagArr: [] as string[],
		isTouchDown: false
	},
	methods: {
		obShopInfo(info: ShopInfo) {
			const { shopSalesInfo, shopTags } = info;

			let monthSales = 0;
			if (shopSalesInfo) {
				monthSales = shopSalesInfo.monthSales;
			}

			const tagArr = wx.$arrayUtils.strToArray(shopTags);

			this.setData({
				monthSales,
				tagArr
			});
		},
		onTouchDown() {
			this.setData({ isTouchDown: true });
		},
		onTouchUp() {
			this.setData({ isTouchDown: false });
		}
	}
});
