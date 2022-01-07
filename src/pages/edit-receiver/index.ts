Page(
	wx.$handlePageOption({
		data: {
			inputReceiverName: '',
			inputPhoneNumber: '',
			defReceiverSwitch: false
		},
		onLoad(query) {
			const { receiverName, phoneNumber } = query;
			let inputReceiverName = '';
			if (receiverName) {
				inputReceiverName = receiverName;
			}

			let inputPhoneNumber = '';
			if (phoneNumber) {
				inputPhoneNumber = phoneNumber;
			}

			this.setData({
				inputReceiverName,
				inputPhoneNumber
			});
		},
		onClear(evt: TouchEvent) {
			const { id } = evt.currentTarget;
			const data = {} as Record<string, string>;
			switch (id) {
				case 'receiverNameClear':
					data.inputReceiverName = '';
					break;
				case 'phoneNumberClear':
					data.inputPhoneNumber = '';
					break;
			}
			this.setData(data);
		},
		onSubmit(formData: TouchDetail) {
			const { receiverName, phoneNumber } = formData.detail.value;
			if (!receiverName) {
				wx.$toastUtils.showMsgToast('请填写正确的收货人名称!');
				return;
			}
			if (!phoneNumber || !wx.$isUtils.isPhoneNumber(phoneNumber)) {
				wx.$toastUtils.showMsgToast('请填写正确的收货人手机号!');
				return;
			}

			const receiverInfo = {
				receiverName,
				phoneNumber
			} as UserAddressInfo;

			const { defReceiverSwitch } = this.data;

			if (defReceiverSwitch) {
				wx.setStorage({ key: 'defReceiver', data: receiverInfo }).then();
			}
			wx.$eventBus.pushEvent('changeReceiver', receiverInfo);

			wx.$router.pop().then();
		}
	})
);
