Component({
	properties: {
		textImgPadding: { type: Number, value: 0 }, // 图和文字的间距,rpx
		text: { type: String },
		textSize: { type: Number, value: 0 },
		color: { type: String },
		selectedColor: { type: String },
		imgSize: { type: Number, value: 0 }, // rpx
		imgUrl: { type: String },
		selectedImgUrl: { type: String },
		selected: { type: Boolean, value: false },
		tipCount: { type: Number, value: 0 },
		showDot: { type: Boolean, value: false }
	},
	data: {},
	methods: {}
});
