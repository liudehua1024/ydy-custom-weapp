import { componentBehavior, componentTabPageBehavior } from '@/components/behavior';

Component({
	options: {
		pureDataPattern: /^_/
	},
	behaviors: [componentBehavior, componentTabPageBehavior],
	data: {
		shopInfo: {} as ShopInfo,
		subShopList: [] as Array<ShopInfo>,
		refreshState: false,
		hasNextPage: false,
		isLoadEnd: false
	},
	methods: {
		onShow() {
			this.setData({ shopInfo: wx.$getAppGlobalData().serviceShop });
		},
		// 被第一次展示时
		onFirstShow() {
			this.onRefresh({}, true);
		},
		toGoodsListPage(_: TouchEvent) {
			const { shopInfo } = this.data;
			if (!shopInfo || !shopInfo.shopId) return;
			wx.$router
				.to({
					name: 'shop-index',
					params: shopInfo
				})
				.then();
		},
		onShopCardClick(evt: TouchEvent) {
			const { shopInfo } = evt.target.dataset;
			if (!shopInfo || !shopInfo.shopId) return;
			wx.$router
				.to({
					name: 'shop-index',
					params: shopInfo
				})
				.then();
		},
		onRefresh(_: any, showLoading = false) {
			this.nextPage = 1;
			this.getSubShopList(showLoading);
		},
		onLoadMore() {
			this.getSubShopList();
		},
		getSubShopList(showLoading = false) {
			const req: SubShopListReq = {
				mId: wx.constants.serviceShopId,
				page: this.nextPage
			};

			this.$api?.getSubShopList({
				req,
				custom: {
					isShowLoading: showLoading
				},
				callback: {
					success: (res) => {
						const { data, meta } = res.data;
						this.nextPage = meta.currentPage + 1;
						this.setData({
							hasNextPage: meta.hasNext,
							isLoadEnd: !meta.hasNext,
							subShopList: data
						});
					},
					complete: () => {
						this.setData({
							refreshState: false
						});
					}
				}
			});
		}
	}
});
