Page(
	wx.$handlePageOption({
		$main: true,
		data: {
			loginState: false,
			selectedName: '',
			items: [] as Array<TabBarItem>
		},
		$enableEventBusGroup: true,
		$eventBusListeners: {
			'loginStateChange': function(evt: EventBusData<boolean>) {
				this.init(evt.data);
			}
		},
		onLoad(_: Record<string, string | undefined>): void | Promise<void> {
			wx.$loginHelper.autoLogin();
		},
		init(loginState: boolean) {
			this.setData({ loginState });
			if (loginState) {
				this.$api?.getShopInfo({
					req: { shopId: wx.constants.serviceShopId },
					callback: {
						success: (res) => {
							const globalData = wx.$getAppGlobalData();
							Object.assign(globalData, { serviceShop: res.data });
							this.initTabBar(loginState);
						}
					}
				});
			} else {
				this.initTabBar(loginState);
			}
		},
		initTabBar(loginState: boolean) {
			const tabBarData = {
				selectedName: 'personal-center',
				items: [
					{
						name: 'index',
						text: '首页',
						imgUrl: '/assets/tab-bar-icon/home-line.png',
						selectedImgUrl: '/assets/tab-bar-icon/home-solid.png'
					},
					{
						name: 'shop-index',
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
			};

			if (loginState) {
				tabBarData.selectedName = 'index';
			}

			this.setData(Object.assign(tabBarData));
		},
		onSwitch(evt: TouchEvent) {
			const { curSelectedName, oldSelectedName } = evt.detail;
			if (!oldSelectedName) return;
			const { loginState } = this.data;
			if (!loginState) {
				if (curSelectedName !== 'personal-center') {
					this.setData({ selectedName: oldSelectedName });
					wx.$dialogUtils.showNoLoginDialog();
				}
				return;
			}

			if (curSelectedName === 'shop-index') {
				this.toGoodsListPage(wx.$getAppGlobalData().serviceShop);
				setTimeout(() => {
					// 跳转界面不
					this.setData({
						selectedName: oldSelectedName
					});
				}, 500);
			} else {
				this.setData({ selectedName: curSelectedName });
			}
		},
		toGoodsListPage(shopInfo: ShopInfo) {
			if (!shopInfo || !shopInfo.shopId) return;
			wx.$router
				.to({
					name: 'shop-index',
					params: shopInfo
				})
				.then();
		}
	})
);
