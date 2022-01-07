Page(
	wx.$handlePageOption({
		$main: true,
		data: {
			selectedName: '',
			items: [] as Array<TabBarItem>
		},
		$enableEventBusGroup: true,
		$eventBusListeners: {},
		onLoad(_: Record<string, string | undefined>): void | Promise<void> {
			this.init();
		},
		init() {
			this.$api?.getShopInfo({
				req: { shopId: wx.constants.serviceShopId },
				callback: {
					success: (res) => {
						const globalData = wx.$getAppGlobalData();
						Object.assign(globalData, { serviceShop: res.data });
						this.initTabBar();
					}
				}
			});
		},
		initTabBar() {
			this.setData({
				selectedName: 'index',
				items: [
					{
						name: 'index',
						text: '首页',
						imgUrl: '/assets/tab-bar-icon/home-line.png',
						selectedImgUrl: '/assets/tab-bar-icon/home-solid.png'
					},
					{
						name: 'goods-category-list',
						text: '点单',
						imgUrl: '/assets/tab-bar-icon/shopping-line.png',
						selectedImgUrl: '/assets/tab-bar-icon/shopping-solid.png'
					},
					{
						name: 'personal-center',
						text: '我的',
						imgUrl: '/assets/tab-bar-icon/personal-line.png',
						selectedImgUrl: '/assets/tab-bar-icon/personal-solid.png'
					}
				] as Array<TabBarItem>
			});
		},
		onSwitch(evt: TouchEvent) {
			const { curSelectedName, oldSelectedName } = evt.detail;
			if (curSelectedName === 'goods-category-list') {
				this.toGoodsListPage(wx.$getAppGlobalData().serviceShop);
				setTimeout(() => {
					// 跳转界面不
					this.setData({
						selectedName: oldSelectedName
					});
				}, 500);
			}
		},
		toGoodsListPage(shopInfo: ShopInfo) {
			if (!shopInfo || !shopInfo.shopId) return;
			wx.$router
				.to({
					name: 'goods-category-list',
					params: shopInfo
				})
				.then();
		}
	})
);
