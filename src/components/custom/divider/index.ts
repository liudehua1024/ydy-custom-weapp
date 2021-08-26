Component({
	externalClasses: ['my-class', 'line-class'],
	properties: {
		content: { type: String, value: '' },
		height: { type: Number, optionalTypes: [String], value: 48 },
		color: { type: String, value: '#80848f' },
		size: { type: Number, optionalTypes: [String], value: 28 },
		lineColor: { type: String, value: '#e9eaec' },
		lineHeight: { type: Number, optionalTypes: [String], value: 1 }
	},
	data: {
		heightStyle: '',
		fontStyle: '',
		lineStyle: ''
	},
	observers: {
		'height': function (height) {
			const heightStyleObj = {
				height: height ? wx.$viewHelper.disposeSizeStyle(height) : undefined
			};
			this.setData({
				heightStyle: wx.$viewHelper.toCssStyleString(heightStyleObj)
			});
		},
		'color,size': function (color, size) {
			const fontStyleObj = {
				'color': color ? color : undefined,
				'font-size': size ? wx.$viewHelper.disposeSizeStyle(size) : undefined
			};

			this.setData({
				fontStyle: wx.$viewHelper.toCssStyleString(fontStyleObj)
			});
		},
		'lineColor,lineHeight': function (lineColor, lineHeight) {
			const lineStyleObj = {
				'background': lineColor ? lineColor : undefined,
				'height': lineHeight ? wx.$viewHelper.disposeSizeStyle(lineHeight) : undefined
			};

			this.setData({
				lineStyle: wx.$viewHelper.toCssStyleString(lineStyleObj)
			});
		}
	}
});
