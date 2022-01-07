Page(
	wx.$handlePageOption({
		nextPage: 1,
		$jsonParams: true,
		data: {
			showGoodsCarBtn: false,
			scrollTop: 0,
			goodsCarPos: { x: 1000, y: 1000, width: 0, height: 0 } as GoodsCarPosInfo,
			shopId: 0,
			cateId: 0,
			totalBuyCount: 0,
			recordList: [] as Array<GoodsCarGoodsInfo>,
			showGoodsCarPanel: false,
			buyCountMap: {} as Record<number, number>,
			goodsList: [] as Array<GoodsInfo>,
			anim: {} as WechatMiniprogram.AnimationExportResult,
			refreshState: false,
			hasNextPage: false,
			isLoadEnd: false
		},
		$eventBusListeners: {
			'goodsCarPosChange': function (evt: EventBusData<GoodsCarPosInfo>) {
				const { data } = evt;
				this.setData({
					goodsCarPos: data
				});
			},
			'goodsCarGoodsList': function (evt: EventBusData<UserShopGoodsCarResp>) {
				if (!wx.$loginHelper.checkLogin()) return;
				const { totalBuyCount, recordList } = evt.data;
				const buyCountMap: Record<number, number> = {};
				recordList.forEach((value) => {
					buyCountMap[value.goodsId] = value.buyCount;
				});

				this.setData({ totalBuyCount, recordList, buyCountMap });
			},
			'loginStateChange': function (evt: EventBusData<boolean>) {
				if (evt.data) {
					this.setData({ showGoodsCarBtn: true });
				} else {
					this.setData({
						showGoodsCarBtn: false,
						totalBuyCount: 0,
						buyCountMap: {},
						showGoodsCarPanel: false
					});
				}
			},
		},
		onLoad(query) {
			if (!query || !query.hasOwnProperty('shopId') || !query.shopId) {
				wx.$toastUtils.showMsgToast('缺少店铺信息');
				wx.$router.pop(1).then();
				return;
			}

			const { title, shopId, cateId } = Object.assign({ title: '', cateId: 0 }, query);
			this.setTitle(title);

			this.setData({
				shopId: shopId,
				cateId: cateId
			});

			this.createSelectorQuery().select('');
			this.onRefresh({}, true);
		},
		toGoodsInfoPage(evt: TouchEvent) {
			const { item } = evt.currentTarget.dataset;
			wx.$router.to({ name: 'goods-info', params: item }).then();
		},
		onGoodsCarPosChange: function (goodsCarPos: GoodsCarPosInfo) {
			wx.$eventBus.pushStickEvent('goodsCarPosChange', goodsCarPos);
		},
		onGoodsCarBtnClick() {
			if (wx.$loginHelper.checkLogin()) {
				const { totalBuyCount } = this.data;
				this.setData({ showGoodsCarPanel: totalBuyCount > 0 });
			} else {
				wx.$dialogUtils.showNoLoginDialog();
			}
		},
		closeGoodsCarPanel() {
			this.setData({ showGoodsCarPanel: false });
		},
		onCountChange(evt: TouchEvent) {
			if (!wx.$loginHelper.checkLogin()) {
				wx.$dialogUtils.showNoLoginDialog();
				return;
			}
			const { item } = evt.currentTarget.dataset;
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
			this.syncUserShopGoodsCarGoods(item.goodsId, count, change);
		},
		onRefresh(_: any, showLoading = false) {
			this.nextPage = 1;
			this.getShopGoodsList(showLoading);
		},
		onLoadMore() {
			this.getShopGoodsList();
		},
		getShopGoodsList(showLoading = false) {
			const { shopId, cateId } = this.data;
			this.$api?.getShopGoodsList({
				req: { shopId: shopId, cateId: cateId, page: this.nextPage },
				custom: {
					isShowLoading: showLoading
				},
				callback: {
					success: (res) => {
						const { data, meta } = res.data;
						let goodsList;
						if (meta.currentPage > 1) {
							goodsList = this.data.goodsList;
							goodsList.push(...data);
						} else {
							goodsList = data;
						}

						this.nextPage = meta.currentPage + 1;
						this.setData({
							hasNextPage: meta.hasNext,
							isLoadEnd: !meta.hasNext,
							goodsList: goodsList
						});
					},
					complete: () => {
						this.setData({
							refreshState: false
						});
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
						this.doAnim(goodsId, change, res.data);
					}
				}
			});
		},
		doAnim(goodsId: number, change: number, countInfo: UserShopGoodsCarResp) {
			const { scrollTop, goodsCarPos } = this.data;
			const goodsCard = this.selectComponent('#goods-' + goodsId);
			const top = goodsCarPos.y + goodsCarPos.height / 2;
			const left = goodsCarPos.x + goodsCarPos.width / 2;

			const opt = {
				scrollTop: scrollTop,
				opacity: change > 0 ? 0 : 1,
				top: top,
				left: left,
				width: goodsCarPos.width,
				height: goodsCarPos.height
			} as GoodsCarAnimOption;

			goodsCard.startAnim(opt, () => {
				wx.$eventBus.pushStickEvent('goodsCarGoodsList', countInfo);
			});
		}
	})
);
