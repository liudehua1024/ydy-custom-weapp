import { componentBehavior, componentTabPageBehavior } from '@/components/behavior';

Component({
	options: {
		pureDataPattern: /^_/
	},
	behaviors: [componentBehavior, componentTabPageBehavior],
	properties: {},
	data: {
		loginInfo: {} as LoginResp,
		isLogin: false
	},
	$eventBusListeners: {
		'loginStateChange': function() {
			this.showUserInfo();
		}
	},
	lifetimes: {
		created() {
		}
	},
	methods: {
		onShow() {
			this.showUserInfo();
		},
		showUserInfo() {
			const loginInfo = wx.$loginHelper.getLoginState();
			this.setData({
				loginInfo: loginInfo,
				isLogin: !!loginInfo && !!loginInfo.token
			});
		},
		authLogin() {
			if (!wx.$loginHelper.checkLogin()) {
				wx.$loginHelper.authLogin();
			} else {
				const loginInfo = wx.$loginHelper.getLoginState();
				this.setData({
					loginInfo: loginInfo,
					isLogin: !!loginInfo && !!loginInfo.token
				});
			}
		},
		onToOrderList(evt: TouchEvent) {
			const { status } = Object.assign({ status: 0 }, evt.mark);
			const { shopId } = wx.$getAppGlobalData().serviceShop;
			wx.$router.to({
				name: 'order-list', params: {
					serviceShopId: shopId,
					searchStatus: status
				}
			}).then();
		},
		onManagerAddress() {
			wx.$router.to('address-list').then();
		}
	}
});
