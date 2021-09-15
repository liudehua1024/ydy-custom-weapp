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

	/**创建订单*/
	createOrder(config: CustomConfigReq<CreateOrderReq, CreateOrderResp>): void;
}
