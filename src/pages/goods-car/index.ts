Page(
	wx.$handlePageOption({
		data: {
			isLoad: false,
			shopId: 0,
			totalBuyCount: 0,
			recordList: [] as Array<GoodsCarGoodsInfo>
		},
		$eventBusListeners: {
			'goodsCarGoodsList': function (evt: EventBusData<UserShopGoodsCarResp>) {
				if (!wx.$loginHelper.getLoginState()) {
					this.setData({ totalBuyCount: 0 });
					// 未登录
					return;
				}
				const { totalBuyCount, recordList } = evt.data;
				if (totalBuyCount) {
					this.setData({ isLoad: true, totalBuyCount, recordList });
				} else {
					this.setData({ isLoad: true, totalBuyCount: 0 });
				}
			}
		},
		onLoad(query) {
			if (!query || !query.hasOwnProperty('shopId')) {
				wx.$router.pop(1).then(() => {
					wx.$toastUtils.showMsgToast('缺少店铺信息');
				});
				return;
			}
		},
		onReady(): void | Promise<void> {
			const { isLoad } = this.data;
			if (!isLoad) {
				this.getGoodsCarGoodsList();
			}
		},
		getGoodsCarGoodsList() {
			const { shopId } = this.data;
			this.$api?.getGoodsCarGoodsList({
				req: { shopId },
				custom: { isShowErrMsgToast: false },
				callback: {
					success: (res) => {
						wx.$eventBus.pushStickEvent('goodsCarGoodsList', res.data);
					}
				}
			});
		},
		syncUserShopGoodsCarGoods(goodsId: number, buyCount: number, change: number) {
			const loadingTitle = change > 0 ? '加入购物车' : '移出购物车';
			const { shopId } = this.data;
			this.$api?.syncUserShopGoodsCarGoods({
				req: { shopId, goodsId, buyCount },
				custom: { isShowLoading: true, loadingOpt: { title: loadingTitle } },
				callback: {
					success: (res) => {
						console.log(res);
					}
				}
			});
		}
	})
);
