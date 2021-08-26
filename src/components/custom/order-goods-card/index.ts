Component({
	externalClasses: ['my-class'],
	properties: {},
	data: {
		monthSales: 0,
		counterSize: 40,
		byCount: 0,
		price: 10.99
	},
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
