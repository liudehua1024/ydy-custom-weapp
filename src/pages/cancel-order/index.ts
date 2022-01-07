Page(
	wx.$handlePageOption({
		data: {
			orderId: 0,
			chooseIndex: 0,
			reasonArr: [
				'不想要了',
				'买错了/买多了/买少了',
				'地址/电话错误',
				'忘记写备注',
				'支付遇到问题',
				'其它原因'
			],
			inputReason: '' // 追加原因
		},
		$eventBusListeners: {},
		onLoad(query) {
			const { orderId } = query;
			if (!orderId) {
				wx.$toastUtils.showMsgToast('订单信息错误!');
				wx.$router.pop().then();
				return;
			}
			this.setData({ orderId });
		},
		onChange(evt: TouchEvent) {
			const chooseIndex = Number(evt.detail.value);
			this.setData({ chooseIndex });
		},
		onInput(evt: TouchEvent) {
			const { value } = evt.detail;
			this.setData({ inputReason: value });
		},
		onSubmit() {
			const { orderId, reasonArr, chooseIndex, inputReason } = this.data;
			let reason = reasonArr[chooseIndex]
			switch (reason) {
				case "其它原因":
					if (inputReason) {
						reason = inputReason;
					}
					break;
			}
			this.cancelOrder(orderId, reason);
		},
		cancelOrder(orderId: number, reason: string) {
			this.$api?.cancelOrder({
				req: { orderId, reason },
				custom: { isShowLoading: true },
				callback: {
					success() {
						wx.$eventBus.pushEvent('refreshOrderInfo', orderId);
						wx.$router.pop().then();
					}
				}
			});
		}
	})
);
