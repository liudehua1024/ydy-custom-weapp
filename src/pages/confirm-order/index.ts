Page(
	wx.$handlePageOption({
		data: {
			defDeliveryType: 1,
			serviceShop: {} as ShopInfo, // 母店(服务点)
			shopInfo: {} as ShopInfo, // 购买商品的店铺
			aogDayStr: '',
			aogTimeStr: '',
			needConfirmOrderInfo: {} as ConfirmOrderInfo,
			expandGoodsList: false
		},
		$eventBusListeners: {
			// 需要确认的订单信息
			'needConfirmOrderInfo': function(evt: EventBusData<ConfirmOrderInfo>) {
				const needConfirmOrderInfo = evt.data;
				this.setData({
					shopInfo: needConfirmOrderInfo.shopInfo,
					needConfirmOrderInfo: evt.data
				});
			}
		},
		onLoad() {
			this.setData({ serviceShop: wx.$getAppGlobalData().serviceShop });
		},
		onReady(): void | Promise<void> {
			const { needConfirmOrderInfo } = this.data;
			console.log(needConfirmOrderInfo);
		},
		onUnload(): void | Promise<void> {
			wx.$eventBus.removeStickEventData('needConfirmOrderInfo');
		},
		onChooseDeliveryType(evt: TouchEvent) {
			const { type } = evt.currentTarget.dataset;
			this.setData({ defDeliveryType: type });
			console.log(type);
		},
		onToggleExpand() {
			const { expandGoodsList } = this.data;
			this.setData({ expandGoodsList: !expandGoodsList });
		},
		onSubmitOrder() {
			// const { serviceShop, needConfirmOrderInfo } = this.data;
			// const { shopInfo, totalOriginPrice, totalSellPrice, goodsList } = needConfirmOrderInfo;
			//
			// const req: CreateOrderReq = {
			// 	shopId: shopInfo.shopId,
			// 	serviceShopId: serviceShop.shopId,
			// 	totalAmount: totalOriginPrice,
			// 	payAmount: totalSellPrice,
			// 	goodsList: [],
			// 	payMethod: 1,
			// 	remarks: '测试',
			// 	deliveryType: 1,
			// 	receiverName: '鸡鸡',
			// 	receiverPhone: '13345678900'
			// };
			// req.goodsList = goodsList.map(val => {
			// 	return {
			// 		buyCount: val.buyCount,
			// 		goodsId: val.goodsId,
			// 		goodsName: val.name,
			// 		originPrice: val.originPrice,
			// 		sellPrice: val.sellPrice
			// 	} as BuyGoodsReq;
			// });
			// this.$api?.createOrder({
			// 	req,
			// 	callback: {
			// 		success: res => {
			// 			console.log(res);
			// 			this.toPay(res.data.paymentInfo)
			// 		},
			// 		fail: err => {
			// 			console.log(err);
			// 		}
			// 	}
			// });
		},
		toPay(payInfo: PaymentInfoResp) {
			wx.requestPayment({
				timeStamp: payInfo.timeStamp,
				nonceStr: payInfo.nonceStr,
				package: payInfo.package,
				signType: payInfo.signType,
				paySign: payInfo.paySign,
				success: res => {
					console.log('requestPayment>>success>', res);
				},
				fail: res => {
					console.log('requestPayment>>fail>', res);
				}
			});

		}
	})
);
