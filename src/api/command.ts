import { RequestManager } from '@/api/request-manager';

export class ApiCommand extends RequestManager implements ApiRequest {
	private readonly defPaginationReq: PaginationReq = {
		page: 1,
		pageSize: 10
	};

	constructor() {
		super();
	}

	private sendRequest<T>(method: HttpMethod, url: string, config: CustomConfigReq<any, T>) {
		this.request<T>(
			{
				method: method,
				url: url,
				data: config.req,
				custom: config.custom
			},
			config.callback
		);
	}

	/**授权登录*/
	wxAuthLogin(config: CustomConfigReq<LoginReq, LoginResp>): void {
		this.sendRequest('POST', '/api/login/user/wx', config);
	}

	/**获取店铺信息*/
	getShopInfo(config: CustomConfigReq<ShopInfoReq, ShopInfoResp>): void {
		config.custom = Object.assign({}, config.custom, { useToken: true });
		this.sendRequest('GET', '/api/shop/info', config);
	}

	/**获取子店列表*/
	getSubShopList(config: CustomConfigReq<SubShopListReq, SubShopListResp>): void {
		config.req = this.handlePaginationReq(config.req);
		this.sendRequest('GET', '/api/shop/sub/list', config);
	}

	/**获取店铺商品列表*/
	getShopGoodsList(config: CustomConfigReq<ShopGoodsListReq, GoodsListResp>): void {
		config.req = this.handlePaginationReq(config.req);
		this.sendRequest('GET', '/api/shop/goods/list', config);
	}

	/**获取店铺商品信息*/
	getShopGoodsInfo(config: CustomConfigReq<GetShopGoodsInfoReq, GoodsInfo>): void {
		config.custom = Object.assign({}, config.custom, { useToken: true });
		this.sendRequest('GET', '/api/shop/goods/info', config);
	}

	/**获取店铺商品分类列表*/
	getShopGoodsCategoryList(
		config: CustomConfigReq<ShopGoodsCategoryListReq, ShopGoodsCategoryListResp>
	): void {
		this.sendRequest('GET', '/api/shop/goods/category/list', config);
	}

	/**获取购物车商品列表*/
	getGoodsCarGoodsList(
		config: CustomConfigReq<GetUserShopGoodsCarReq, UserShopGoodsCarResp>
	): void {
		config.custom = Object.assign({}, config.custom, { useToken: true });
		this.sendRequest('GET', '/api/auth/buyer/shop/goodsCar/list', config);
	}

	/**同步购物车商品信息*/
	syncUserShopGoodsCarGoods(
		config: CustomConfigReq<SyncUserShopGoodsCarGoodsReq, UserShopGoodsCarResp>
	): void {
		config.custom = Object.assign({}, config.custom, { useToken: true });
		this.sendRequest('POST', '/api/auth/buyer/shop/goodsCar/syncGoods', config);
	}

	/**清除购物车*/
	clearUserShopGoodsCar(config: CustomConfigReq<ClearUserShopGoodsCarReq, void>): void {
		config.custom = Object.assign({}, config.custom, { useToken: true });
		this.sendRequest('POST', '/api/auth/buyer/shop/goodsCar/clear', config);
	}

	/**提交订单*/
	submitOrder(config: CustomConfigReq<SubmitOrderReq, SubmitOrderResp>): void {
		config.custom = Object.assign({}, config.custom, { useToken: true });
		this.sendRequest('POST', '/api/auth/buyer/order/submit', config);
	}

	/**支付订单(生成订单预支付信息)*/
	genOrderPaymentInfo(config: CustomConfigReq<GenOrderPaymentInfoReq, PaymentInfoResp>): void {
		config.custom = Object.assign({}, config.custom, { useToken: true });
		this.sendRequest('POST', '/api/auth/buyer/order/payment', config);
	}

	/**获取订单列表*/
	getOrderList(config: CustomConfigReq<GetOrderListReq, GetOrderListResp>): void {
		config.req = this.handlePaginationReq(config.req);
		config.custom = Object.assign({}, config.custom, { useToken: true });
		this.sendRequest('GET', '/api/auth/buyer/order/list', config);
	}

	/**获取订单信息*/
	getOrderInfo(config: CustomConfigReq<GetOrderInfoReq, OrderInfo>): void {
		config.custom = Object.assign({}, config.custom, { useToken: true });
		this.sendRequest('GET', '/api/auth/buyer/order/info', config);
	}

	/**取消订单*/
	cancelOrder(config: CustomConfigReq<CancelOrderReq, void>): void {
		config.custom = Object.assign({}, config.custom, { useToken: true });
		this.sendRequest('POST', '/api/auth/buyer/order/cancel', config);
	}

	/**获取地址列表*/
	getUserAddressList(config: CustomConfigReq<void, GetUserAddressListResp>): void {
		config.custom = Object.assign({}, config.custom, { useToken: true });
		this.sendRequest('GET', '/api/auth/buyer/address/list', config);
	}

	/**获取默认地址*/
	getUserDefAddress(config: CustomConfigReq<void, UserAddressInfo>): void {
		config.custom = Object.assign({}, config.custom, { useToken: true });
		this.sendRequest('GET', '/api/auth/buyer/address/def', config);
	}

	/**添加地址*/
	addUserAddress(config: CustomConfigReq<UserAddressInfo, UserAddressInfo>): void {
		config.custom = Object.assign({}, config.custom, { useToken: true });
		this.sendRequest('POST', '/api/auth/buyer/address/add', config);
	}

	/**修改地址*/
	modifyUserAddress(config: CustomConfigReq<UserAddressInfo, UserAddressInfo>): void {
		config.custom = Object.assign({}, config.custom, { useToken: true });
		this.sendRequest('POST', '/api/auth/buyer/address/edit', config);
	}

	/**删除地址*/
	delUserAddress(config: CustomConfigReq<DelUserAddressReq, void>): void {
		config.custom = Object.assign({}, config.custom, { useToken: true });
		this.sendRequest('DELETE', '/api/auth/buyer/address/del', config);
	}

	private handlePaginationReq<T extends PaginationReq>(params: T): T {
		return Object.assign(this.defPaginationReq, params);
	}
}
