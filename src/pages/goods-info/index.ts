Page(
	wx.$handlePageOption({
		$jsonParams: true,
		data: {
			maxCount: 0,
			buyCount: 0,
			goodsInfo: { name: '', coverImg: '', originPrice: 0, sellPrice: 0 } as GoodsInfo
		},
		$eventBusListeners: {
			'goodsCarGoodsList': function (evt: EventBusData<UserShopGoodsCarResp>) {
				if (!wx.$loginHelper.getLoginState()) {
					// 未登录
					return;
				}
				const { recordList } = evt.data;
				const { goodsInfo } = this.data;

				for (const record of recordList) {
					if (record.goodsId === goodsInfo.goodsId) {
						this.setData({ buyCount: record.buyCount });
						break;
					}
				}
			}
		},
		onLoad(query) {
			if (!query || !query.hasOwnProperty('shopId') || !query.hasOwnProperty('goodsId')) {
				wx.$toastUtils.showMsgToast('缺少商品信息');
				wx.$router.pop(1).then();
				return;
			}
			const goodsInfo = Object.assign(
				{ name: '', coverImg: '', originPrice: 0, sellPrice: 0 } as GoodsInfo,
				query
			);

			this.setData({ goodsInfo });

			if (query.hasOwnProperty('stock') && query.hasOwnProperty('limitNum')) {
				let maxCount = 0;
				if (goodsInfo.limitNum > 0 && goodsInfo.limitNum < goodsInfo.stock) {
					maxCount = goodsInfo.limitNum;
				} else {
					maxCount = goodsInfo.stock;
				}

				this.setData({ maxCount });
			}

			this.getShopGoodsInfo();
		},
		onCountChange(evt: TouchEvent) {
			if (!wx.$loginHelper.checkLogin()) {
				wx.$dialogUtils.showNoLoginDialog();
				return;
			}
			const { count, oldCount, change } = evt.detail;
			// 没有改变
			if (count === oldCount) {
				if (change > 0) {
					wx.$toastUtils.showMsgToast('库存不足或已达到限购数量');
					return;
				} else if (count === 0) {
					return;
				}
			}
			this.syncUserShopGoodsCarGoods(count, change);
		},
		getShopGoodsInfo() {
			const { goodsInfo } = this.data;
			this.$api?.getShopGoodsInfo({
				req: { shopId: goodsInfo.shopId, goodsId: goodsInfo.goodsId },
				custom: { isShowLoading: true },
				callback: {
					success: (res) => {
						this.setData({ goodsInfo: res.data });
					}
				}
			});
		},
		syncUserShopGoodsCarGoods(buyCount: number, change: number) {
			const loadingTitle = change > 0 ? '加入购物车' : '移出购物车';
			const { goodsInfo } = this.data;
			this.$api?.syncUserShopGoodsCarGoods({
				req: { shopId: goodsInfo.shopId, goodsId: goodsInfo.goodsId, buyCount },
				custom: { isShowLoading: true, loadingOpt: { title: loadingTitle } },
				callback: {
					success: (res) => {
						wx.$eventBus.pushStickEvent('goodsCarGoodsList', res.data);
					}
				}
			});
		}
	})
);
