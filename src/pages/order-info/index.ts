Page(
	wx.$handlePageOption({
		popDelta: 1,
		paymentInfo: {} as WxPaymentInfoResp,
		data: {
			expandGoodsList: false,
			orderInfo: {} as OrderInfo,
			endPaymentSecond: 0,
			createOrderTimeStr: '',
			payOrderTimeStr: ''
		},
		$eventBusListeners: {
			'changeRemarks': function(evt: EventBusData<string>) {
				const { orderInfo } = this.data;
				orderInfo.remarks = evt.data;
				this.setData({ orderInfo });
			},
			'refreshOrderInfo': function(evt: EventBusData<number>) {
				const orderId = evt.data;
				const { orderInfo } = this.data;
				if (orderId !== orderInfo.orderId) return;
				this.getOrderInfo();
			},
			'orderInfoChange': function(evt: EventBusData<OrderInfo>) {
				const newInfo = evt.data;
				const { orderInfo } = this.data;
				if (orderInfo.orderId === newInfo.orderId) {
					Object.assign(orderInfo, newInfo);
					this.setData({ orderInfo });
					this.initData();
				}
			}
		},
		onLoad(query) {
			this.setTitle('订单详情');
			if (!query || !query.orderId) {
				wx.$toastUtils.showMsgToast('订单信息错误!');
				wx.$router.pop().then();
				return;
			}

			const orderInfo = query as OrderInfo;
			this.setData({ orderInfo });
			this.initData();
		},
		initData() {
			const { orderInfo } = this.data;
			const createOrderTimeStr = wx.$dateUtils.format(orderInfo.createdTime);
			const payOrderTimeStr = wx.$dateUtils.format(orderInfo.payTime);
			this.setData({ createOrderTimeStr, payOrderTimeStr });
			if (orderInfo.status === 1) {
				const curTimestamp = wx.$numUtils.toInt(Date.now() / 1000);
				let endPaymentSecond = orderInfo.endValidPaymentTime - curTimestamp;
				if (endPaymentSecond > 0) {
					this.setData({ endPaymentSecond });
				} else {
					this.onValidTimeCountEnd();
				}
			}
		},
		onReady(): void | Promise<void> {
			// const routeStack = wx.$router.getRouteStack();
			// if (routeStack.length > 1) {
			// 	switch (routeStack[1].name) {
			// 		case 'confirm-order':
			//
			// 	}
			// }
		},
		onShow(): void | Promise<void> {
		},
		onCancelOrder() {
			const { orderInfo } = this.data;
			wx.$router.to({
				name: 'cancel-order',
				params: { orderId: orderInfo.orderId }
			}).then();
		},
		onPayment() {
			const { orderInfo } = this.data;
			this.$api?.genOrderPaymentInfo({
				req: { orderId: orderInfo.orderId, payMethod: 1, payAmount: orderInfo.payAmount },
				custom: { isShowLoading: true },
				callback: {
					success: res => {
						const { payMethod, paymentInfo } = res.data;
						if (payMethod === 1) {
							this.paymentInfo = paymentInfo;
							this.toPay();
						} else {
							wx.$toastUtils.showMsgToast('获取支付信息失败');
						}
					}
				}
			});
		},
		onToggleExpand() {
			const { expandGoodsList } = this.data;
			this.setData({ expandGoodsList: !expandGoodsList });
		},
		onValidTimeCountEnd() {
			const { orderInfo } = this.data;
			if (orderInfo.status !== 1) return;
			orderInfo.status = 4;
			orderInfo.canceledTime = orderInfo.endValidPaymentTime + 1;
			orderInfo.canceledReason = '未能在规定时间内，完成订单支付';
			wx.$eventBus.pushEvent('orderInfoChange', orderInfo);
		},
		onChangeRemarks() {
			const { orderInfo } = this.data;
			wx.$router.to({
				name: 'edit-remarks',
				params: { remarks: orderInfo.remarks, editable: false }
			}).then();
		},
		getOrderInfo() {
			const { orderInfo } = this.data;
			this.$api?.getOrderInfo({
				req: { orderId: orderInfo.orderId },
				custom: { isShowLoading: true },
				callback: {
					success: res => {
						wx.$eventBus.pushEvent('orderInfoChange', res.data);
						// this.setData({ orderInfo: res.data });
					}
				}
			});
		},
		toPay() {
			const paymentInfo = this.paymentInfo;
			if (!paymentInfo || !paymentInfo.signType) return;
			wx.requestPayment({
				timeStamp: paymentInfo.timeStamp,
				nonceStr: paymentInfo.nonceStr,
				package: paymentInfo.package,
				signType: paymentInfo.signType,
				paySign: paymentInfo.paySign,
				success: (_) => {
					this.getOrderInfo();
				},
				fail: (res) => {
					console.log(res);
					wx.$dialogUtils.showDialog({
						content: '未完成支付，是否放弃支付？',
						cancelText: '放弃支付',
						cancelColor: '#999999',
						confirmText: '继续支付',
						success: res => {
							if (res.confirm) { // 继续支付
								this.toPay();
							} else { // 取消支付
								this.onBack();
							}
						}
					});
				}
			});
		},
		onBack() {
			wx.$router.pop(this.popDelta).then();
		}
	})
);
