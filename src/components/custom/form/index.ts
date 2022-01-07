import { customFormButton, customFormFiled } from '@/components/behavior';

Component({
	relations: {
		'customFormFiled': {
			type: 'descendant', // 关联的目标节点应为祖先节点
			target: customFormFiled,
			linked(target: WxComponent.Instance) {
				const { name } = target.data as Record<string, any>;
				if (!this.formFiled) {
					this.formFiled = {};
				}
				target.formCtx = this;
				this.formFiled[name] = target;

				const { formData } = this.data;
				if (formData && formData[name]) {
					target.setData({ value: formData[name] });
				}
			}
		},
		'customFormButton': {
			type: 'descendant', // 关联的目标节点应为祖先节点
			target: customFormButton,
			linked(target: WxComponent.Instance) {
				target.formCtx = this;
			}
		}
	},
	properties: {
		formData: {
			type: Object,
			value: {} as Record<string, any>,
			observer: 'onFormDataChange'
		}
	},
	lifetimes: {
		ready() {
			this.t;
		}
	},
	methods: {
		onFormDataChange(formData: Record<string, any>) {
			if (!this.formFiled) return;
			Object.keys(this.formData).forEach(key => {
				const filed = this.formFiled[key];
				if (filed) {
					filed.setData({ value: formData[key] });
				}
			});
		},
		onReset() {
			this.setData({ formData: {} as Record<string, any> });
			this.triggerEvent('reset', { formData: {} }, { bubbles: true, capturePhase: true, composed: true });
		},
		onSubmit() {
			const { formData } = this.data;
			const formFiled = this.formFiled as Record<string, WxComponent.Instance>;
			if (formFiled) {
				Object.keys(formFiled).forEach(key => {
					const filed = this.formFiled[key];
					if (filed) {
						const { value } = filed.data;
						formData[key] = value;
					}
				});
			}
			this.setData({ formData });
			this.triggerEvent('submit', { formData }, { bubbles: true, capturePhase: true, composed: true });
		}
	}
} as WxComponent.Options);
