Page(
	wx.$handlePageOption({
		data: {
			needConfirmOrderInfo: {} as ConfirmOrderInfo
		},
		$eventBusListeners: {
			// 需要确认的订单信息
			'needConfirmOrderInfo': function(evt: EventBusData<ConfirmOrderInfo>) {
				this.setData({
					needConfirmOrderInfo: evt.data
				});
			}
		},
		onLoad() {
		},
		onReady(): void | Promise<void> {
			const { needConfirmOrderInfo } = this.data;
			console.log(needConfirmOrderInfo);
		},
		onUnload(): void | Promise<void> {
			wx.$eventBus.removeStickEventData('needConfirmOrderInfo');
		},
		onSubmitOrder() {
			const { needConfirmOrderInfo } = this.data;
			const { curShopInfo } = wx.$getAppGlobalData();

			const req: CreateOrderReq = {
				shopId: needConfirmOrderInfo.shopId,
				serviceShopId: curShopInfo.shopId,
				totalAmount: needConfirmOrderInfo.totalOriginPrice,
				payAmount: needConfirmOrderInfo.totalSellPrice,
				goodsList: [],
				payMethod: 1,
				remarks: '测试',
				deliveryType: 1,
				receiverName: '鸡鸡',
				receiverPhone: '13345678900'
			};
			req.goodsList = needConfirmOrderInfo.goodsList.map(val => {
				return {
					buyCount: val.buyCount,
					goodsId: val.goodsId,
					goodsName: val.name,
					originPrice: val.originPrice,
					sellPrice: val.sellPrice
				} as BuyGoodsReq;
			});
			this.$api?.createOrder({
				req,
				callback: {
					success: res => {
						console.log(res);
						this.toPay(res.data.paymentInfo)
					},
					fail: err => {
						console.log(err);
					}
				}
			});
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
