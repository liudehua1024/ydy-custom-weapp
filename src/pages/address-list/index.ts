Page(
	wx.$handlePageOption({
		data: {
			refreshState: false,
			isChooseAddress: false,
			addressList: [] as Array<UserAddressInfo>
		},
		$eventBusListeners: {
			'refreshAddressList': function() {
				this.getUserAddressList();
			}
		},
		onLoad(query) {
			const { isChooseAddress } = query;
			if (isChooseAddress) {
				this.setTitle('选择地址');
			} else {
				this.setTitle('地址管理');
			}
			this.setData({ isChooseAddress });
		},
		onReady(): void | Promise<void> {
			this.getUserAddressList();
		},
		onAddAddress() {
			wx.$router.to('edit-address').then();
		},
		onDefTagChange(evt: TouchEvent) {
			const { info } = evt.detail;
			this.$api?.modifyUserAddress({
				req: info,
				custom: { isShowLoading: true },
				callback: {
					success() {
						wx.$toastUtils.showMsgToast('修改地址成功');
						wx.$eventBus.pushEvent('refreshAddressList');
					}
				}
			});
		},
		onModifyAddress(evt: TouchEvent) {
			const { info } = evt.detail;
			wx.$router.to({ name: 'edit-address', params: info }).then();
		},
		onDelAddress(evt: TouchEvent) {
			const { info } = evt.detail;
			wx.$dialogUtils.showTipDialog({
				title: '温馨提示',
				content: '地址删除后无法恢复，是否确认删除？',
				confirmText: '确认删除',
				success: res => {
					if (!res.confirm) return;
					this.$api?.delUserAddress({
						req: { id: info.id },
						custom: { isShowLoading: true },
						callback: {
							success() {
								wx.$toastUtils.showMsgToast('删除地址成功');
								wx.$eventBus.pushEvent('refreshAddressList');
							}
						}
					});
				}
			});
		},
		onChooseAddress(evt: TouchEvent) {
			const { isChooseAddress } = this.data;
			if (!isChooseAddress) return;
			const { info } = Object.assign({}, evt.mark);
			wx.$eventBus.pushEvent('chooseAddress', info);
			wx.$router.pop().then();
		},
		onRefresh() {
			this.getUserAddressList(true);
		},
		getUserAddressList(isRefresh = false) {
			this.$api?.getUserAddressList({
				custom: { isShowLoading: !isRefresh },
				callback: {
					success: res => {
						const { addressList } = res.data;
						this.setData({ addressList });
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
