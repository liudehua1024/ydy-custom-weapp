import { customFormFiled } from '@/components/behavior';

Component({
	behaviors: [customFormFiled],
	relations: {
		'../form/index': {
			type: 'ancestor'
		}
	},
	properties: {
		filedStyle: { type: String, value: '' },
		type: { type: String, value: 'text' }, // text/number/idcard/digit
		password: { type: Boolean, value: false },
		placeholder: { type: String },
		placeholderStyle: { type: String },
		placeholderClass: { type: String, value: 'input-placeholder' },
		disabled: { type: Boolean, value: false },
		maxlength: { type: Number, value: 140 },
		cursorSpacing: { type: Number, value: 0 },
		focus: { type: Boolean, value: false },
		confirmType: { type: String, value: 'done' }, // send/search/next/go/done
		confirmHold: { type: Boolean, value: false },
		cursor: { type: Number },
		selectionStart: { type: Number, value: -1 },
		selectionEnd: { type: Number, value: -1 },
		adjustPosition: { type: Boolean, value: true },
		holdKeyboard: { type: Boolean, value: false }
	},
	data: {},
	methods: {
		onInput(evt: TouchEvent) {
			this.triggerEvent('input', evt.detail, {
				bubbles: true,
				capturePhase: true,
				composed: true
			});
		},
		onFocus(evt: TouchEvent) {
			this.triggerEvent('focus', evt.detail, {
				bubbles: true,
				capturePhase: true,
				composed: true
			});
		},
		onBlur(evt: TouchEvent) {
			this.triggerEvent('blur', evt.detail, {
				bubbles: true,
				capturePhase: true,
				composed: true
			});
		},
		onConfirm(evt: TouchEvent) {
			this.triggerEvent('confirm', evt.detail, {
				bubbles: true,
				capturePhase: true,
				composed: true
			});
		},
		onKeyboardHeightChange(evt: TouchEvent) {
			this.triggerEvent('keyboardheightchange', evt.detail, {
				bubbles: true,
				capturePhase: true,
				composed: true
			});
		}
	}
});
