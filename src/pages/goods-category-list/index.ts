Page(
	wx.$handlePageOption({
		name: 'goods-category-list',
		$jsonParams: true,
		data: {
			showGoodsCarBtn: false,
			goodsCarPos: { width: 0, height: 0, x: 1000, y: 1000 } as GoodsCarPosInfo,
			listRootEnableScroll: true,
			subListEnableScroll: false,
			shopBarTop: 0,
			shopId: 0,
			shopInfo: {} as ShopInfo,
			monthSales: 0,
			tagArr: [] as string[],
			firstCategoryList: [] as Array<GoodsCategoryInfo>,
			secondCategoryListRecord: {} as Record<string, Array<GoodsCategoryInfo>>,
			checkedFirstCategory: {} as GoodsCategoryInfo,
			totalBuyCount: 0,
			showGoodsCarPanel: false
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
				const { showGoodsCarPanel } = this.data;
				let { totalBuyCount } = evt.data;
				this.setData({
					totalBuyCount,
					showGoodsCarPanel: showGoodsCarPanel && !totalBuyCount
				});
			},
			'loginStateChange': function (evt: EventBusData<boolean>) {
				if (evt.data) {
					this.setData({ showGoodsCarBtn: true });
					this.getGoodsCarGoodsList();
				} else {
					wx.$eventBus.removeStickEventData('goodsCarGoodsList');
					this.setData({
						showGoodsCarBtn: false,
						totalBuyCount: 0,
						showGoodsCarPanel: false
					});
				}
			}
		},
		onLoad(query) {
			this.setTitle('点单');
			if (!query || !query.hasOwnProperty('shopId') || !query.shopId) {
				wx.$router.pop(1).then(() => {
					wx.$toastUtils.showMsgToast('缺少店铺信息');
				});
				return;
			}

			this.initData(Object.assign({} as ShopInfo, query));
		},
		onUnload(): void | Promise<void> {
			wx.$eventBus.removeStickEventData('goodsCarPosChange', 'goodsCarGoodsList');
		},
		initData(shopInfo: ShopInfo) {
			const { shopId, shopSalesInfo, shopTags } = Object.assign(
				{ shopSalesInfo: {}, shopTags: '' },
				shopInfo
			);

			let monthSales = shopSalesInfo && shopSalesInfo.monthSales ? shopSalesInfo.monthSales : 0;
			const tagArr = wx.$arrayUtils.strToArray(shopTags);

			this.setData({ shopId, shopInfo, monthSales, tagArr });

			if (shopId !== wx.constants.curShopId) {
				this.getShopInfo();
			} else {
				this.getGoodsCategoryList({ level: 1 });
			}
		},
		onGoodsCarBtnClick() {
			if (wx.$loginHelper.checkLogin()) {
				if (this.data.totalBuyCount) this.setData({ showGoodsCarPanel: true });
			} else {
				wx.$dialogUtils.showNoLoginDialog();
			}
		},
		closeGoodsCarPanel() {
			this.setData({ showGoodsCarPanel: false });
		},
		onGoodsCarPosChange: function (goodsCarPos: GoodsCarPosInfo) {
			wx.$eventBus.pushStickEvent('goodsCarPosChange', goodsCarPos);
		},
		onListRootScroll(evt: TouchEvent) {
			if (evt.detail.deltaY > 0) {
				this.setData({
					subListEnableScroll: false
				});
			}
		},
		onListRootScrollToLower() {
			this.setData({
				subListEnableScroll: true
			});
		},
		onCheckedFirstCategory(evt: TouchEvent) {
			const { item } = evt.currentTarget.dataset;
			this.chooseFirstCategory(item);
		},
		chooseFirstCategory(firstCategory: GoodsCategoryInfo) {
			if (!firstCategory || !firstCategory.categoryId) return;
			this.setData({
				checkedFirstCategory: Object.assign({}, firstCategory)
			});

			this.getGoodsCategoryList({
				level: 2,
				parentId: firstCategory.categoryId,
				queryChildren: 1
			} as ShopGoodsCategoryListReq);
		},
		onChooseThirdCategory(evt: TouchEvent) {
			const { item } = evt.currentTarget.dataset;
			wx.$router
				.to({
					name: 'goods-list',
					params: {
						title: item.name,
						shopId: item.shopId,
						cateId: item.categoryId
					}
				})
				.then();
		},
		getShopInfo() {
			const { shopId } = this.data;
			this.$api?.getShopInfo({
				req: { shopId: shopId },
				callback: {
					success: (res: ResponseResult<ShopInfoResp>) => {
						const shopInfo = res.data;
						this.setData({ shopInfo });
						this.getGoodsCategoryList({ level: 1 });
					}
				}
			});
		},
		getGoodsCategoryList(req: Omit<ShopGoodsCategoryListReq, 'shopId'>) {
			const { shopId } = this.data;
			this.$api?.getShopGoodsCategoryList({
				req: { shopId, ...req },
				callback: {
					success: (res) => {
						const { categoryList } = res.data;
						switch (req.level) {
							case 1:
								this.setData({
									firstCategoryList: categoryList ? categoryList : []
								});
								if (categoryList && categoryList.length > 0) {
									this.chooseFirstCategory(categoryList[0]);
								}
								break;
							case 2:
								const { secondCategoryListRecord } = this.data;
								secondCategoryListRecord[`2-${req.parentId}`] = categoryList;
								this.setData({
									secondCategoryListRecord
								});
								break;
						}
					}
				}
			});
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
		}
	})
);
