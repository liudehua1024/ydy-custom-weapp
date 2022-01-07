Component({
	externalClasses: ['my-class'],
	properties: {
		value: { type: Number, value: 0 },
		fixed: { type: Number, value: 2 },
		size: { type: Number, value: 28 },
		decimalMode: { type: String, value: '' }, // 可选值:small、top,多个用-连接
		unit: { type: String, value: '' },
		unitMode: { type: String, value: '' }, // 可选值:small、top|center|bottom、left|right,多个用-连接,默认bottom
		unitInterval: { type: String, value: '2rpx' },
		delLine: { type: Boolean, value: false },
		color: { type: String, value: '' },
		smallRate: { type: Number, value: 0.6 },
		smallSize: { type: Number, value: 0 }
	},
	data: {
		prefixPrice: '0', //整数位
		suffixPrice: '00', //小数位
		prefixPriceStyle: '',
		suffixPriceStyle: '',
		unitAlign: 'left', // left right
		unitIntervalStyle: '',
		unitStyle: ''
	},
	observers: {
		'value, fixed': function(value: number, fixed: number) {
			this.initPrice(value, fixed);
		},
		'size, decimalMode, unitMode, unitInterval, smallSize, smallRate': function(
			size,
			decimalMode,
			unitMode,
			unitInterval,
			smallSize,
			smallRate
		) {
			this.initPriceStyle(size, decimalMode, smallSize, smallRate);
			this.initUnitStyle(size, unitMode, unitInterval, smallSize, smallRate);
		}
	},
	lifetimes: {
		attached() {
			const { value, fixed, size, decimalMode, unitMode, unitInterval, smallSize, smallRate } = this.properties;
			this.initPrice(value, fixed);
			this.initPriceStyle(size, decimalMode, smallSize, smallRate);
			this.initUnitStyle(size, unitMode, unitInterval, smallSize, smallRate);
		}
	},
	methods: {
		initPrice: function(value: number, fixed: number) {
			const priceArr = wx.$numUtils.fixed(value, fixed).split(/\./);

			this.setData({
				prefixPrice: priceArr[0],
				suffixPrice: priceArr.length > 1 ? priceArr[1] : ''
			});
		},
		initPriceStyle: function(
			size: number,
			decimalMode: string,
			smallSize: number,
			smallRate: number
		) {
			let prefixPriceStyle = '';
			let textSize = size;
			prefixPriceStyle += 'font-size:' + wx.$viewHelper.disposeSizeStyle(textSize) + ';';
			prefixPriceStyle += 'line-height:' + wx.$viewHelper.disposeSizeStyle(textSize) + ';';

			let suffixPriceStyle = '';
			if (decimalMode.length > 0) {
				const mode = decimalMode.toLowerCase();

				if (mode.includes('top')) {
					suffixPriceStyle += 'align-self:flex-start;';
				}

				if (mode.includes('small')) {
					if (smallSize > 0) {
						textSize = smallSize;
					} else {
						textSize = textSize * smallRate;
					}
				}
			}

			suffixPriceStyle += 'font-size:' + wx.$viewHelper.disposeSizeStyle(textSize) + ';';
			suffixPriceStyle += 'line-height:' + wx.$viewHelper.disposeSizeStyle(textSize) + ';';
			this.setData({
				prefixPriceStyle,
				suffixPriceStyle
			});
		},
		initUnitStyle: function(size: number, unitMode: string, unitInterval: string, smallSize: number, smallRate: number) {
			let unitAlign = '';
			let unitStyle = '';
			let unitIntervalStyle = '';
			let textSize = size;
			if (unitMode.length > 0) {
				const mode = unitMode.toLowerCase();
				if (mode.includes('right')) {
					unitAlign = 'right';
				} else {
					unitAlign = 'left';
				}
				if (mode.includes('top')) {
					unitStyle += 'align-self:flex-start;';
				} else if (mode.includes('center')) {
					unitStyle += 'align-self:center;';
				}

				if (mode.includes('small')) {
					if (smallSize > 0) {
						textSize = smallSize;
					} else {
						textSize = textSize * smallRate;
					}
				}
			}

			unitStyle += 'font-size:' + wx.$viewHelper.disposeSizeStyle(textSize) + ';';
			unitStyle += 'line-height:' + wx.$viewHelper.disposeSizeStyle(textSize) + ';';
			unitIntervalStyle = 'width:' + wx.$viewHelper.disposeSizeStyle(unitInterval) + ';';
			this.setData({
				unitAlign,
				unitStyle,
				unitIntervalStyle
			});
		}
	}
});
