Component({
	options: {
		pureDataPattern: /^_/
	},
	externalClasses: ['my-class'],
	properties: {
		buyCount: { type: Number, value: 0 },
		goodsInfo: {
			type: Object,
			value: { coverImg: '', originPrice: 0, sellPrice: 0 } as GoodsInfo,
			observer: 'obGoodsInfo'
		}
	},
	data: {
		maxCount: 0,
		_goodsLogoRect: { top: 0, left: 0, width: 0, height: 0 }
	},
	lifetimes: {
		ready() {
			this.createSelectorQuery()
				.select('#goods-logo-block')
				.boundingClientRect((result) => {
					if (result) this.setData({ _goodsLogoRect: result });
				})
				.exec();
		}
	},
	methods: {
		obGoodsInfo(goodsInfo: GoodsInfo) {
			let maxCount = 0;
			if (goodsInfo.limitNum > 0 && goodsInfo.limitNum < goodsInfo.stock) {
				maxCount = goodsInfo.limitNum;
			} else {
				maxCount = goodsInfo.stock;
			}
			this.setData({ maxCount });
		},
		startAnim(opt: GoodsCarAnimOption, callback?: () => void) {
			const { top, left, width, height } = this.data._goodsLogoRect;
			const r1 = wx.$numUtils.toInt((opt.top - top) / 100);
			const r2 = wx.$numUtils.toInt((opt.left - left) / 100);
			let time = 100;
			if (r1 > 0 || r2 > 0) {
				if (r1 >= r2) time = r1 * 100;
				else time = r2 * 100;
			}

			let keyFrames = [
				{
					opacity: opt.opacity === 1 ? 0 : 1,
					top: top + 'px',
					left: left + 'px',
					width: width + 'px',
					height: height + 'px'
				},
				{
					opacity: opt.opacity,
					top: opt.top + 'px',
					left: opt.left + 'px',
					width: opt.width + 'px',
					height: opt.height + 'px'
				}
			];

			if (opt.opacity === 1) {
				keyFrames = keyFrames.reverse();
			}

			this.animate(
				'#anim-goods-logo',
				keyFrames,
				time,
				function () {
					if (wx.$isUtils.isFun(callback)) {
						callback();
					}
				}.bind(this)
			);
		},
		ignoreClick() {
			//拦截counter的点击事件,防止误触
		}
	}
});
