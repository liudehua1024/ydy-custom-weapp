/// <reference path="./lib.base.d.ts" />
/// <reference path="./lib.config.d.ts" />
/// <reference path="./lib.api.d.ts" />

type HttpHeader = Record<string, any>;
type HttpData = string | Record<string, any>;
type HttpMethod = 'OPTIONS' | 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT';

interface HttpRequestManager {
	stopTask(key?: string): void;
}

interface ApiRequest extends HttpRequestManager {
	/**授权登录*/
	wxAuthLogin(config: CustomConfigReq<LoginReq, LoginResp>): void;

	/**获取店铺信息*/
	getShopInfo(config: CustomConfigReq<ShopInfoReq, ShopInfoResp>): void;

	/**获取子店列表*/
	getSubShopList(config: CustomConfigReq<SubShopListReq, SubShopListResp>): void;

	/**获取店铺商品列表*/
	getShopGoodsList(config: CustomConfigReq<ShopGoodsListReq, GoodsListResp>): void;

	/**获取店铺商品信息*/
	getShopGoodsInfo(config: CustomConfigReq<GetShopGoodsInfoReq, GoodsInfo>): void;

	/**获取店铺商品分类列表*/
	getShopGoodsCategoryList(
		config: CustomConfigReq<ShopGoodsCategoryListReq, ShopGoodsCategoryListResp>
	): void;

	/**获取购物车商品列表*/
	getGoodsCarGoodsList(config: CustomConfigReq<GetUserShopGoodsCarReq, UserShopGoodsCarResp>): void;

	/**同步购物车商品信息*/
	syncUserShopGoodsCarGoods(
		config: CustomConfigReq<SyncUserShopGoodsCarGoodsReq, UserShopGoodsCarResp>
	): void;

	/**清除购物车*/
	clearUserShopGoodsCar(config: CustomConfigReq<ClearUserShopGoodsCarReq, void>): void;

	/**提交订单*/
	submitOrder(config: CustomConfigReq<SubmitOrderReq, SubmitOrderResp>): void;

	/**支付订单(获取订单预支付信息)*/
	genOrderPaymentInfo(config: CustomConfigReq<GenOrderPaymentInfoReq, PaymentInfoResp>): void;

	/**获取订单列表*/
	getOrderList(config: CustomConfigReq<GetOrderListReq, GetOrderListResp>): void;

	/**获取订单信息*/
	getOrderInfo(config: CustomConfigReq<GetOrderInfoReq, OrderInfo>): void;

	/**取消订单*/
	cancelOrder(config: CustomConfigReq<CancelOrderReq, void>): void;

	/** 获取用户地址 */
	getUserAddressList(config: CustomConfigReq<void, GetUserAddressListResp>): void;

	/** 获取用户默认地址 */
	getUserDefAddress(config: CustomConfigReq<void, UserAddressInfo>): void;

	/**添加地址*/
	addUserAddress(config: CustomConfigReq<UserAddressInfo, void>): void;

	/**修改地址*/
	modifyUserAddress(config: CustomConfigReq<UserAddressInfo, void>): void;

	/**删除地址*/
	delUserAddress(config: CustomConfigReq<DelUserAddressReq, void>): void;
}
