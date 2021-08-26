Component({
	externalClasses: ['my-class', 'badge-align-class'],
	properties: {
		count: {
			type: Number,
			value: 0,
			observer: 'finalCountObserver'
		},
		overflowCount: {
			type: Number,
			value: 99
		},
		dot: {
			type: Boolean,
			value: false
		},
		align: String
	},
	data: {
		finalCount: ''
	},
	methods: {
		finalCountObserver() {
			const { count, overflowCount } = this.data;
			let finalCount = '';
			if (count > overflowCount) {
				finalCount += overflowCount + '+';
			} else if (count > 0) {
				finalCount += count;
			}
			this.setData({ finalCount });
		}
	}
});
