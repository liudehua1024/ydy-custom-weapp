import { componentBehavior } from '@/components/behavior';

Component({
	behaviors: [componentBehavior],
	properties: {
		shopInfo: { type: Object, value: {} as ShopInfo }
	},
	data: {
		listHeight: '',
		totalBuyCount: 0,
		totalOriginPrice: 0.0,
		totalSellPrice: 0.0,
		totalReducedPrice: 0.0,
		recordList: [] as Array<GoodsCarGoodsInfo>
	},
	$eventBusListeners: {
		'enterShop': function(evt: EventBusData<ShopInfo>) {
			this.setData({ shopInfo: evt.data });
		},
		'goodsCarGoodsList': function(evt: EventBusData<UserShopGoodsCarResp>) {
			if (!wx.$loginHelper.checkLogin()) return;
			const { recordList } = evt.data;
			let len = recordList.length;
			if (len > 4) len = 4;
			const height = len * 180 + (len - 1) * 2;
			const data = {
				...evt.data,
				listHeight: wx.$viewHelper.disposeSizeStyle(height)
			};
			this.setData(data);
		}
	},
	lifetimes: {
		ready() {
		}
	},
	methods: {
		onClearGoods(_: TouchEvent) {
			this.clearUserShopGoodsCar();
		},
		onCountChange(evt: TouchEvent) {
			const { item } = evt.currentTarget.dataset;
			const { count, oldCount, change } = evt.detail;
			if (count === oldCount) {
				// 没有改变
				wx.$toastUtils.showMsgToast('库存不足或已达到限购数量');
				return;
			}
			this.syncUserShopGoodsCarGoods(item.goodsId, count, change);
		},
		toGoodsInfoPage(evt: TouchEvent) {
			const { item } = evt.currentTarget.dataset;
			wx.$router.to({ name: 'goods-info', params: item }).then();
		},
		toConfirmOrderPage(_: TouchEvent) {
			const { shopInfo, totalBuyCount, totalOriginPrice, totalSellPrice, totalReducedPrice, recordList } = this.data;

			const goodsList = recordList.map(value => {
				return {
					goodsId: value.goodsId,
					goodsName: value.name,
					goodsCoverImg: value.coverImg,
					goodsSpec: value.goodsSpec,
					goodsDesc: value.goodsDesc,
					goodsOriginPrice: value.originPrice,
					goodsSellPrice: value.sellPrice,
					buyCount: value.buyCount
				} as OrderGoodsInfo;
			});


			wx.$eventBus.pushStickEvent('needConfirmOrderInfo', {
				shopInfo,
				totalBuyCount,
				totalOriginPrice,
				totalSellPrice,
				totalReducedPrice,
				goodsList
			} as ConfirmOrderInfo);

			wx.$router.to({ name: 'confirm-order' }).then();
		},
		syncUserShopGoodsCarGoods(goodsId: number, buyCount: number, change: number) {
			const loadingTitle = change > 0 ? '加入购物车' : '移出购物车';
			const { shopInfo } = this.data;
			this.$api?.syncUserShopGoodsCarGoods({
				req: { shopId: shopInfo.shopId, goodsId, buyCount },
				custom: { isShowLoading: true, loadingOpt: { title: loadingTitle } },
				callback: {
					success: (res) => {
						wx.$eventBus.pushStickEvent('goodsCarGoodsList', res.data);
					}
				}
			});
		},
		clearUserShopGoodsCar() {
			const { shopInfo } = this.data;
			this.$api?.clearUserShopGoodsCar({
				req: { shopId: shopInfo.shopId },
				custom: {
					isShowLoading: true,
					loadingOpt: { title: '清空购物车...' },
					isShowErrMsgToast: true
				},
				callback: {
					success: () => {
						wx.$eventBus.pushStickEvent('goodsCarGoodsList', {
							shopInfo,
							totalBuyCount: 0,
							totalOriginPrice: 0.0,
							totalSellPrice: 0.0,
							totalReducedPrice: 0.0,
							recordList: [] as Array<GoodsCarGoodsInfo>
						});
					}
				}
			});
		}
	}
});
