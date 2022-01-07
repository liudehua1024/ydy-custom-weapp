Component({
	properties: {
		info: { type: Object }
	},
	data: {},
	methods: {
		onToOrderInfo() {
			this.triggerEvent('toOrderInfo', {}, {
				bubbles: true,
				composed: true,
				capturePhase: true
			});
		},
		onToShopInfo() {
			this.triggerEvent('toShopInfo', {}, {
				bubbles: true,
				composed: true,
				capturePhase: true
			});
		},
		onClick() {
		}
	}
});
