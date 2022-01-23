Component({
	externalClasses: ['my-class'],
	properties: {
		maxLine: {
			type: Number,
			optionalTypes: [String],
			value: 1
		}
	},
	data: {
		line: 0
	},
	observers: {
		'maxLine': function(maxLine: number | string) {
			this.initLine(maxLine);
		}
	},
	lifetimes: {
		attached() {
			const { maxLine } = this.properties;
			this.initLine(maxLine);
		},
		ready() {

		}
	},
	methods: {
		initLine: function(maxLine: number | string) {
			if (wx.$isUtils.isNumber(maxLine)) {
				this.setData({
					line: Number(maxLine)
				});
			}
		}
	}
});
