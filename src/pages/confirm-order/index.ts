Page(
	wx.$handlePageOption({
		orderInfo: {} as OrderInfo,
		data: {
			inputPhoneNumberFocus: false,
			inputPhoneNumber: '',
			serviceShop: {} as ShopInfo, // 母店(服务点)
			shopInfo: {} as ShopInfo, // 购买商品的店铺
			aogDayStr: '',
			aogTimeStr: '',
			needConfirmOrderInfo: {} as ConfirmOrderInfo,
			expandGoodsList: false,
			deliveryType: 2,
			remarks: '',
			addressInfo: {} as UserAddressInfo
		},
		$eventBusListeners: {
			// 需要确认的订单信息
			'needConfirmOrderInfo': function(evt: EventBusData<ConfirmOrderInfo>) {
				const needConfirmOrderInfo = evt.data;
				this.setData({
					shopInfo: needConfirmOrderInfo.shopInfo,
					needConfirmOrderInfo: evt.data
				});
			},
			'chooseAddress': function(evt: EventBusData<UserAddressInfo>) {
				const addressInfo = evt.data;
				this.setData({
					addressInfo: addressInfo
				});
			},
			'changeRemarks': function(evt: EventBusData<string>) {
				let remarks = evt.data;
				this.setData({ remarks });
			}
		},
		onLoad() {
			this.setData({ serviceShop: wx.$getAppGlobalData().serviceShop });
		},
		onReady(): void | Promise<void> {
			this.getUserDefAddress();
		},
		onUnload(): void | Promise<void> {
			wx.$eventBus.removeStickEventData('needConfirmOrderInfo');
		},
		onChooseDeliveryType(evt: TouchEvent) {
			const { type } = evt.currentTarget.dataset;
			this.setData({ deliveryType: type });
		},
		onInputPhoneNumberFocusChange(evt: TouchEvent) {
			this.setData({
				inputPhoneNumberFocus: evt.type === 'focus'
			});
		},
		onChooseAddress() {
			// wx.$router.to({
			// 	name: 'address-list',
			// 	params: { isChooseAddress: true }
			// }).then();

			const { addressInfo } = this.data;
			if (addressInfo?.phoneNumber) {
				wx.$router.to({ name: 'edit-address', params: addressInfo }).then();
			} else {
				wx.$router.to({ name: 'edit-address' }).then();
			}
		},
		onToggleExpand() {
			const { expandGoodsList } = this.data;
			this.setData({ expandGoodsList: !expandGoodsList });
		},
		onChangeRemarks() {
			const { remarks } = this.data;
			wx.$router.to({
				name: 'edit-remarks',
				params: { remarks }
			}).then();
		},
		getUserDefAddress() {
			this.$api?.getUserDefAddress({
				custom: { isShowLoading: true, isShowErrMsgToast: false },
				callback: {
					success: res => {
						let { inputPhoneNumber } = this.data;
						if (!inputPhoneNumber) {
							inputPhoneNumber = res.data.phoneNumber;
						}
						this.setData({ addressInfo: res.data, inputPhoneNumber });
					}
				}
			});
		},
		onSubmitOrder() {
			const {
				serviceShop,
				needConfirmOrderInfo,
				deliveryType,
				inputPhoneNumber,
				remarks,
				addressInfo
			} = this.data;

			const { shopInfo, totalOriginPrice, payAmount, goodsList } = needConfirmOrderInfo;

			const req: CreateOrderReq = {
				shopId: shopInfo.shopId,
				serviceShopId: serviceShop.shopId,
				totalAmount: totalOriginPrice,
				payAmount: payAmount,
				goodsList: [],
				payMethod: 1,
				deliveryType: deliveryType,
				remarks: remarks,
				receiverAddress: '',
				receiverCity: '',
				receiverDistrict: '',
				receiverLatitude: 0,
				receiverLongitude: 0,
				receiverName: '',
				receiverPhone: '',
				receiverProvince: ''
			};

			if (deliveryType === 1) {
				req.receiverPhone = inputPhoneNumber;
			} else {
				req.receiverName = addressInfo.receiverName;
				req.receiverPhone = addressInfo.phoneNumber;
				req.receiverProvince = addressInfo.province;
				req.receiverCity = addressInfo.city;
				req.receiverDistrict = addressInfo.district;
				req.receiverAddress = addressInfo.address;
				req.receiverLongitude = addressInfo.longitude;
				req.receiverLatitude = addressInfo.latitude;
			}

			req.goodsList = goodsList.map(val => {
				return {
					buyCount: val.buyCount,
					goodsId: val.goodsId,
					goodsName: val.goodsName,
					originPrice: val.goodsOriginPrice,
					sellPrice: val.goodsSellPrice
				} as BuyGoodsReq;
			});

			this.$api?.submitOrder({
				req,
				custom: { isShowLoading: true },
				callback: {
					success: res => {
						wx.$router.to({
							name: 'order-info',
							toType: 'redirectTo',
							params: res.data
						}).then();
					}
				}
			});
		}
	})
);
