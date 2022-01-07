import { customFormButton } from '@/components/behavior';

Component({
	behaviors: [customFormButton],
	relations: {
		'../form/index': {
			type: 'ancestor'
		}
	},
	properties: {
		size: { type: String, value: 'default' }, // default/mini
		type: { type: String, value: 'default' }, // primary/default/warn
		plain: { type: Boolean, value: false },
		disabled: { type: Boolean, value: false },
		loading: { type: Boolean, value: false },
		hoverClass: { type: String, value: 'button-hover' },
		hoverStopPropagation: { type: Boolean, value: false },
		hoverStartTime: { type: Number, value: 20 },
		hoverStayTime: { type: Number, value: 70 },
		lang: { type: String, value: 'en' } // en/zh_CN/zh_TW
	},
	data: {},
	methods: {
		onClick() {
			if (!this.formCtx) return;
			const { formType } = this.data as Record<string, any>;
			switch (formType) {
				case 'reset':
					if (wx.$isUtils.isFun(this.formCtx.onReset)) this.formCtx.onReset();
					break;
				case 'submit':
					if (wx.$isUtils.isFun(this.formCtx.onSubmit)) this.formCtx.onSubmit();
					break;
			}
		}
	}
});
