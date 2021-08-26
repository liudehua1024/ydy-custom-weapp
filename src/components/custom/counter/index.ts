Component({
	externalClasses: ['my-class'],
	properties: {
		size: { type: Number, value: 38 },
		padding: { type: Number, value: 2 },
		minNum: { type: Number, value: 0 },
		startNum: { type: Number, value: 1 },
		maxNum: { type: Number, value: 9999 },
		step: { type: Number, value: 1 },
		value: { type: Number, value: 0 },
		mode: { type: String, value: 'hidden-zero' }, // zero:展示0 hidden-zero:不展示0
		enableInnerChange: { type: Boolean, value: false } // 为false时,只能通过外部传入value值,内部不能更改value
	},
	data: {
		width: 0,
		height: 0,
		iconSize: 0,
		btnWidth: 0,
		countNumMinWidth: 0,
		countNumSize: 0,
		spaceWidth: 0
	},
	observers: {
		'size, padding': function (size: number, padding: number) {
			this.initStyle(size, padding);
		}
	},
	lifetimes: {
		attached() {
			const { size, padding } = this.properties;
			this.initStyle(size, padding);
		}
	},
	methods: {
		initStyle: function (size: number, padding: number) {
			if (!wx.$isUtils.isNumber(size)) {
				size = 60;
			}

			if (!wx.$isUtils.isNumber(padding)) {
				padding = 5;
			}

			const countNumSize = wx.$numUtils.toInt(size);
			const countNumMinWidth = wx.$numUtils.toInt(countNumSize * 1.8);
			this.setData({
				height: size,
				btnWidth: size,
				iconSize: size,
				countNumMinWidth: countNumMinWidth,
				countNumSize: countNumSize,
				spaceWidth: padding
			});
		},
		/** type=1加 type=-1减 **/
		counter: function (evt: TouchEvent) {
			const { type } = evt.currentTarget.dataset;
			const { minNum, maxNum, startNum, step, value, enableInnerChange } = this.data;

			let change = step * type;
			if (value === 0 && change > 0) {
				change = Math.max(startNum, change);
			}

			let newValue = value + change;

			if (newValue < minNum) {
				newValue = minNum;
			} else if (newValue > maxNum) {
				newValue = maxNum;
			}

			if (enableInnerChange) {
				this.setData({
					value: newValue
				});
			}
			this.triggerEvent(
				'countChange',
				{ count: newValue, oldCount: value, change: change, minNum: minNum, maxNum: maxNum },
				{
					bubbles: true,
					composed: true,
					capturePhase: true
				}
			);
		}
	}
});
