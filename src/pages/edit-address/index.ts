Page(
	wx.$handlePageOption({
		chooseLocation: requirePlugin('chooseLocation'),
		mapCtx: {} as WechatMiniprogram.MapContext,
		data: {
			mapSetting: {
				skew: 0,
				rotate: 0,
				scale: 18,
				showLocation: false, // 不显示带有方向的当前定位点,虽然默认是false但是也必须有此设置,不然坑逼的微信map组件无法改变经纬度.
				enableZoom: false, // 不允许缩放
				enableScroll: false, // 不允许拖动
				enableRotate: false, // 不允许旋转
				enablePoi: true,// 展示POI点
				longitude: 116.397497,
				latitude: 39.906888
			},
			mapMarker: {
				id: 1,
				title: '',
				iconPath: '../../assets/location-point.png',
				width: '48rpx',
				height: '48rpx',
				longitude: undefined,
				latitude: undefined
			},
			addressId: 0,
			inputLocation: {
				province: '',
				city: '',
				district: '',
				address: '',
				longitude: undefined,
				latitude: undefined
			} as AddressInfo,
			genderManChecked: true,
			genderWomanChecked: false,
			inputHomeAddress: '',
			inputReceiverName: '',
			genderCheckStates: [true, false],
			inputPhoneNumber: '',
			defTagCheckState: true
		},
		onLoad(query) {
			// @ts-ignore
			// this.mapCtx = wx.createMapContext('mapId', this);
			const {
				id,
				province,
				city,
				district,
				address,
				longitude,
				latitude,
				homeAddress,
				receiverName,
				gender,
				phoneNumber,
				defTag
			} = query;

			if (longitude !== undefined && latitude !== undefined) {
				this.setTitle('编辑地址');
				const { mapSetting, mapMarker, genderCheckStates } = this.data;

				mapSetting.longitude = longitude;
				mapSetting.latitude = latitude;
				mapMarker.longitude = longitude;
				mapMarker.latitude = latitude;

				genderCheckStates[0] = gender !== 2;
				genderCheckStates[1] = gender === 2;

				this.setData({
					mapSetting,
					mapMarker,
					addressId: id,
					inputHomeAddress: homeAddress,
					inputReceiverName: receiverName,
					inputPhoneNumber: phoneNumber,
					genderCheckStates: genderCheckStates,
					defTagCheckState: defTag === 1,
					inputLocation:
						{
							province: province,
							city: city,
							district: district,
							address: address,
							longitude: longitude,
							latitude: latitude
						}
				});
			} else {
				const {
					defProvince,
					defCity,
					defDistrict,
					defAddress,
					defLatitude,
					defLongitude
				} = wx.constants;

				this.setData({
					inputLocation:
						{
							province: defProvince,
							city: defCity,
							district: defDistrict,
							address: defAddress,
							longitude: defLongitude,
							latitude: defLatitude
						}
				});


				this.setTitle('新增地址');
			}
		},
		onShow(): void | Promise<void> {
			const locationInfo = this.chooseLocation.getLocation();
			if (locationInfo &&
				locationInfo.longitude !== undefined &&
				locationInfo.latitude !== undefined) {

				this.setData({
					inputLocation: {
						province: locationInfo.province,
						city: locationInfo.city,
						district: locationInfo.district,
						address: locationInfo.name,
						longitude: locationInfo.longitude,
						latitude: locationInfo.latitude
					}
				});
				this.resetMap();
			}
		},
		resetMap() {
			const { inputLocation, mapMarker } = this.data;
			const { longitude, latitude } = inputLocation;
			Object.assign(mapMarker, { longitude, latitude });
			// this.mapCtx.moveToLocation({
			// 	longitude,
			// 	latitude
			// });
			this.setData({ mapMarker });
		},
		onChooseLocation() {
			// const chooseLocationConfig = {
			// 	key: 'NFIBZ-53JWI-EJ3GX-5YKNZ-AHZMO-VGFCL', //使用在腾讯位置服务申请的key
			// 	referer: '云店员', //调用插件的app的名称
			// 	scale: 18
			// } as Record<string, any>;
			//
			// const { longitude, latitude } = this.data.inputLocation;
			// if (longitude !== undefined && latitude !== undefined) {
			// 	Object.assign(chooseLocationConfig, { longitude, latitude });
			// }
			//
			// wx.$router.toPlugin({
			// 	name: 'chooseLocation',
			// 	params: chooseLocationConfig
			// });
		},
		onRadioChange(evt: TouchEvent) {
			const { value } = evt.detail;
			const genderCheckStates = [false, false];
			genderCheckStates[value - 1] = true;

			this.setData({ inputGender: value, genderCheckStates });
		},
		onClear(evt: TouchEvent) {
			const { id } = evt.currentTarget;
			switch (id) {
				case 'homeAddressClear':
					this.setData({ inputHomeAddress: '' });
					break;
				case 'receiverNameClear':
					this.setData({ inputReceiverName: '' });
					break;
				case 'phoneNumberClear':
					this.setData({ inputPhoneNumber: '' });
					break;
			}
		},
		onSubmit(evt: TouchDetail) {
			const { value } = evt.detail;
			value.id = Number(value.id);
			value.gender = Number(value.gender) === 2 ? 2 : 1;
			value.defTag = Number(value.defTag) === 1 ? 1 : 2;

			const { inputLocation } = this.data;
			Object.assign(value, inputLocation);

			if (value.longitude === undefined || value.latitude === undefined) {
				wx.$toastUtils.showMsgToast('请选择收货地址');
				return;
			} else if (!value.receiverName) {
				wx.$toastUtils.showMsgToast('请选填写收货人名称');
				return;
			} else if (!wx.$isUtils.isPhoneNumber(value.phoneNumber)) {
				wx.$toastUtils.showMsgToast('请选填写正确的手机号');
				return;
			}

			if (value.id) {
				this.modifyAddress(value);
			} else {
				delete value.id;
				this.addAddress(value);
			}
		},
		modifyAddress(info: UserAddressInfo) {
			this.$api?.modifyUserAddress({
				req: info,
				callback: {
					success(res) {
						wx.$toastUtils.showMsgToast('修改地址成功');
						// wx.$eventBus.pushEvent('refreshAddressList');

						wx.$eventBus.pushEvent('chooseAddress', res.data);
						wx.$router.pop().then();
					}
				}
			});
		},
		addAddress(info: UserAddressInfo) {
			this.$api?.addUserAddress({
				req: info,
				callback: {
					success(res) {
						wx.$toastUtils.showMsgToast('增加地址成功');
						// wx.$eventBus.pushEvent('refreshAddressList');
						wx.$eventBus.pushEvent('chooseAddress', res.data);
						wx.$router.pop().then();
					}
				}
			});
		}
	})
);
