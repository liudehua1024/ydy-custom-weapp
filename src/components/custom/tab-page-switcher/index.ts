Component({
	options: {
		multipleSlots: true,
		pureDataPattern: /^_/
	},
	relations: {
		'../tab-page-item/index': {
			type: 'child',
			linked(target) {
				const { name } = Object.assign({ name: '' }, target?.data);
				target?.setData({
					show: this.data.selectedName == name
				});
			}
		}
	},
	properties: {
		selectedName: { type: String, value: '', observer: 'switchTabItem' }
	},
	data: {},
	lifetimes: {},
	methods: {
		switchTabItem(selectedName: String) {
			const tabs = this.getRelationNodes('../tab-page-item/index');
			tabs?.forEach((vt) => {
				const { name } = Object.assign({ name: '' }, vt?.data);
				vt?.setData({
					show: selectedName === name
				});
			});
		}
	}
});
