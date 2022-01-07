import { componentBehavior } from '@/components/behavior';

Component({
	behaviors: [componentBehavior],
	properties: {
		info: {
			type: Object,
			value: {} as UserAddressInfo,
			observer(newVal) {
				if (!newVal || !newVal.id) return;
				this.setData({
					defTagCheckState: newVal.defTag === 1
				});
			}
		}
	},
	data: {
		defTagCheckState: false,
		addrInfo: ''
	},
	methods: {
		onDefTagChange() {
			const { info, defTagCheckState } = this.data;
			if (!info || !info.id) return;
			info.defTag = defTagCheckState ? 1 : 2;
			this.triggerEvent('defTagChange', { info }, {
				bubbles: true,
				composed: true,
				capturePhase: true
			});
		},
		onModifyAddress() {
			const { info } = this.data;
			if (!info || !info.id) return;
			this.triggerEvent('modify', { info }, {
				bubbles: true,
				composed: true,
				capturePhase: true
			});
		},
		onDelAddress() {
			const { info } = this.data;
			if (!info || !info.id) return;
			this.triggerEvent('del', { info }, {
				bubbles: true,
				composed: true,
				capturePhase: true
			});
		},
		onClick() {}
	}
});
