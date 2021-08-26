Component({
	externalClasses: ['icon-class'],
	properties: {
		name: { type: String, value: '' },
		size: { type: Number, optionalTypes: [String], value: 0 },
		color: { type: String, value: '' },
		useIconClassFont: { type: Boolean, value: false },
		customFontStyle: { type: String, value: '' }
	},
	data: {
		iconName: '',
		iconFontStyle: ''
	},
	observers: {
		'name': function (name: string) {
			this.initIconName(name);
		},
		'size, color': function (size: string | number, color: string) {
			this.initIconStyle(size, color);
		}
	},
	lifetimes: {
		attached() {
			const { name, size, color } = this.properties;
			this.initIconName(name);
			this.initIconStyle(size, color);
		}
	},
	methods: {
		initIconName: function (name: string) {
			this.setData({
				iconName: 'my-icon__' + name
			});
		},
		initIconStyle: function (size: string | number, color: string) {
			let iconFontStyle = '';
			if (size) {
				iconFontStyle += 'font-size:' + wx.$viewHelper.disposeSizeStyle(size) + ';';
			}

			if (color) {
				iconFontStyle += 'color:' + color + ';';
			}

			this.setData({
				iconFontStyle
			});
		}
	}
});
