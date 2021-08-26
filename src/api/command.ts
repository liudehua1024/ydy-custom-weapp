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

	private handlePaginationReq<T extends PaginationReq>(params: T): T {
		return Object.assign(this.defPaginationReq, params);
	}
}
