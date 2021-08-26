import { componentBehavior } from '@/components/behavior';

Component({
	externalClasses: ['my-class'],
	behaviors: [componentBehavior],
	properties: {
		goodsInfo: { type: Object, value: {} as GoodsCarGoodsInfo }
	},
	data: {
		monthSales: 0,
		counterSize: 40,
		byCount: 0,
		price: 10.99
	},
	$eventBusListeners: {},
	lifetimes: {
		attached() {}
	},
	methods: {
		onChange: function (e: TouchEvent) {
			console.log(e);
			this.setData({
				price: this.data.price + 89
			});
		}
	}
});
