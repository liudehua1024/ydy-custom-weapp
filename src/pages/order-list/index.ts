Page(
	wx.$handlePageOption({
		searchStatus: 0,
		nextPage: 1,
		data: {
			serviceShopId: 0,
			orderList: [] as Array<OrderInfo>,
			refreshState: false,
			hasNextPage: false,
			isLoadEnd: false
		},
		$eventBusListeners: {
			'orderInfoChange': function(evt: EventBusData<OrderInfo>) {
				const newInfo = evt.data;
				const { orderList } = this.data;
				for (let i = 0; i < orderList.length; i++) {
					const info = orderList[i];
					if (info.orderId === newInfo.orderId) {
						Object.assign(info, newInfo);
						this.setData({ orderList });
						break;
					}
				}
			}
		},
		onLoad(query) {
			if (!query.serviceShopId) {
				wx.$toastUtils.showMsgToast('缺少服务点信息');
				wx.$router.pop().then();
				return;
			}
			this.setTitle('订单管理');

			const { serviceShopId, searchStatus } = query;
			if (searchStatus > 0) this.searchStatus = searchStatus;
			this.setData({ serviceShopId });
		},
		onReady(): void | Promise<void> {
			this.onRefresh({}, true);
		},
		onRefresh(_: any, showLoading = false) {
			this.nextPage = 1;
			this.getOrderList(showLoading);
		},
		onLoadMore() {
			this.getOrderList();
		},
		onToOrderInfo(evt: TouchEvent) {
			const { info } = Object.assign({}, evt.mark);
			wx.$router.to({ name: 'order-info', params: info }).then();
		},
		onToShopInfo(evt: TouchEvent) {
			const { info } = Object.assign({}, evt.mark);
			wx.$router.to({ name: 'goods-category-list', params: info?.shopInfo }).then();
		},
		getOrderList(showLoading = false) {
			const { serviceShopId } = this.data;
			// 只查询距离今天30天的记录
			const startTime = wx.$dateUtils.getZeroTimestamp() - 29 * 24 * 60 * 60; // 29天前的凌晨
			const endTime = wx.$dateUtils.getZeroTimestamp() + 24 * 60 * 60 - 1;// 当天结束时间
			const req: GetOrderListReq = {
				serviceShopId,
				status: this.searchStatus,
				startTime,
				endTime,
				page: this.nextPage
			};

			this.$api?.getOrderList({
				req,
				custom: {
					isShowLoading: showLoading
				},
				callback: {
					success: res => {
						const { data, meta } = res.data;
						let { orderList } = this.data;
						if (meta.currentPage > 1) {
							orderList.push(...data);
						} else {
							orderList = data;
						}

						this.nextPage = meta.currentPage + 1;
						this.setData({
							hasNextPage: meta.hasNext,
							isLoadEnd: !meta.hasNext,
							orderList: orderList
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
	})
);
