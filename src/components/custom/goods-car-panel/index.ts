import { componentBehavior } from '@/components/behavior';

Component({
	behaviors: [componentBehavior],
	properties: {
		shopId: { type: Number, value: 0 }
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
		'goodsCarGoodsList': function (evt: EventBusData<UserShopGoodsCarResp>) {
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
		ready() {}
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
		syncUserShopGoodsCarGoods(goodsId: number, buyCount: number, change: number) {
			const loadingTitle = change > 0 ? '加入购物车' : '移出购物车';
			const { shopId } = this.data;
			this.$api?.syncUserShopGoodsCarGoods({
				req: { shopId, goodsId, buyCount },
				custom: { isShowLoading: true, loadingOpt: { title: loadingTitle } },
				callback: {
					success: (res) => {
						wx.$eventBus.pushStickEvent('goodsCarGoodsList', res.data);
					}
				}
			});
		},
		clearUserShopGoodsCar() {
			const { shopId } = this.data;
			this.$api?.clearUserShopGoodsCar({
				req: { shopId },
				custom: {
					isShowLoading: true,
					loadingOpt: { title: '清空购物车...' },
					isShowErrMsgToast: true
				},
				callback: {
					success: () => {
						wx.$eventBus.pushStickEvent('goodsCarGoodsList', {
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
