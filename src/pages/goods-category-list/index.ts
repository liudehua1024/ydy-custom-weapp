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
			curTabId: 'cate-block', // 当前TAB页面id
			shopId: 0,
			shopInfo: {} as ShopInfo,
			shopPhoneNumberArr: [] as Array<string>,
			monthSales: 0,
			tagArr: [] as string[],
			firstCategoryList: [] as Array<GoodsCategoryInfo>,
			secondCategoryListRecord: {} as Record<string, Array<GoodsCategoryInfo>>,
			checkedFirstCategory: {} as GoodsCategoryInfo,
			totalBuyCount: 0,
			showGoodsCarPanel: false,
			showChoosePhoneNumberPanel: false
		},
		$eventBusListeners: {
			'goodsCarPosChange': function(evt: EventBusData<GoodsCarPosInfo>) {
				const { data } = evt;
				this.setData({
					goodsCarPos: data
				});
			},
			'goodsCarGoodsList': function(evt: EventBusData<UserShopGoodsCarResp>) {
				if (!wx.$loginHelper.checkLogin()) return;
				const { showGoodsCarPanel } = this.data;
				let { totalBuyCount } = evt.data;
				this.setData({
					totalBuyCount,
					showGoodsCarPanel: showGoodsCarPanel && !totalBuyCount
				});
			},
			'loginStateChange': function(evt: EventBusData<boolean>) {
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
			wx.$eventBus.removeStickEventData('enterShop', 'goodsCarPosChange', 'goodsCarGoodsList');
		},
		initData(shopInfo: ShopInfo) {
			this.setData({ shopId: shopInfo.shopId, shopInfo });
			this.initShopInfo(shopInfo);

			if (shopInfo.shopId !== wx.constants.serviceShopId) { // 子店
				this.getShopInfo();
			} else { // 母店
				// 发送进入店铺事件消息
				wx.$eventBus.pushStickEvent('enterShop', shopInfo);
				this.getGoodsCategoryList({ level: 1 });
			}
		},
		initShopInfo(shopInfo: ShopInfo) {
			const { shopSalesInfo, shopTags, shopPhoneNumbers } = Object.assign(
				{ shopSalesInfo: {}, shopTags: '', shopPhoneNumbers: '' },
				shopInfo
			);

			let monthSales = shopSalesInfo && shopSalesInfo.monthSales ? shopSalesInfo.monthSales : 0;
			const tagArr = wx.$arrayUtils.strToArray(shopTags);
			const shopPhoneNumberArr = shopPhoneNumbers.split(',');

			this.setData({ shopInfo, monthSales, tagArr, shopPhoneNumberArr });
		},
		onGoodsCarBtnClick() {
			if (wx.$loginHelper.checkLogin()) {
				if (this.data.totalBuyCount) this.setData({ showGoodsCarPanel: true });
			} else {
				wx.$dialogUtils.showNoLoginDialog();
			}
		},
		changeTab(evt: TouchEvent) {
			const { id } = evt.currentTarget;
			this.setData({ curTabId: id });
		},
		closePageContainerPanel() {
			this.setData({ showGoodsCarPanel: false, showChoosePhoneNumberPanel: false });
		},
		onGoodsCarPosChange: function(goodsCarPos: GoodsCarPosInfo) {
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
		onLookShopAddr() {
			const { shopInfo } = this.data;
			wx.openLocation({
				latitude: shopInfo.latitude,
				longitude: shopInfo.longitude,
				scale: 18,
				name: shopInfo.shopName
			}).then();
		},
		onCallShopPhone() {
			const { shopPhoneNumberArr } = this.data;
			if (shopPhoneNumberArr.length === 1) {
				this.callPhone(shopPhoneNumberArr[0]);
			} else { // 需要选择拨打的号码
				this.setData({ showChoosePhoneNumberPanel: true });
			}
		},
		onPhoneNumberClick(evt: TouchEvent) {
			this.setData({ showChoosePhoneNumberPanel: false });
			const { phoneNumber } = Object.assign({ phoneNumber: '' }, evt.mark);
			this.callPhone(phoneNumber);
		},
		callPhone(phoneNumber: string) {
			if (!phoneNumber) return;
			wx.makePhoneCall({
				phoneNumber,
				fail(err) {
					const { errMsg } = err;
					if (errMsg.endsWith('cancel')) return; // 手动取消
					wx.setClipboardData({
						data: phoneNumber,
						complete() {
							wx.$dialogUtils.showTipDialog({
								title: '温馨提示',
								content: '当前手机不支持拨号，已复制号码到您的剪切板。'
							});
						}
					});
				}
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
		onChooseSecondCategory(evt: TouchEvent) {
			const { item } = evt.currentTarget.dataset;
			console.log(item);
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
				req: { shopId: shopId, serviceShopId: wx.constants.serviceShopId },
				callback: {
					success: (res: ResponseResult<ShopInfoResp>) => {
						const shopInfo = res.data;
						this.initShopInfo(shopInfo);
						// 发送进入店铺事件消息
						wx.$eventBus.pushStickEvent('enterShop', shopInfo);
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
