import { customFormRadio } from '@/components/behavior';

Component({
	relations: {
		'customFormRadio': {
			type: 'descendant', // 关联的目标节点应为祖先节点
			target: customFormRadio,
			linked(target: WxComponent.Instance) {
				console.log(target);
			}
		}
	},
	properties: {
	},
	data: {
		iconSizeStyle: ''
	},
	methods: {}
});
