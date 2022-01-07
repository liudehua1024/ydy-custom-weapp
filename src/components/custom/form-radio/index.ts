import { customFormRadio } from '@/components/behavior';

Component({
	behaviors: [customFormRadio],
	relations: {
		'../form-radio-group/index': {
			type: 'ancestor'
		}
	},
	properties: {
		disabled: { type: String },
		iconSize: { type: String, optionalTypes: [Number], value: '' },
		iconColor: { type: String }
	},
	data: {},
	methods: {}
});
