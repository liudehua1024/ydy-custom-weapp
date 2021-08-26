Component({
	options: {
		pureDataPattern: /^_/
	},
	relations: {
		'../tab-page-switcher/index': {
			type: 'parent'
		}
	},
	properties: {
		name: { type: String, value: '' },
		show: { type: Boolean }
	},
	data: {}
});
