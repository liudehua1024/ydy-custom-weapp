/**=====登录=====**/

//[请求]
interface LoginReq {
	code: string;
	nickName?: string;
	avatarUrl?: string;
	gender?: number;
	province?: string;
	city?: string;
	country?: string;
}

//[响应]
interface LoginResp extends UserInfo {
	token: string;
}

/**=====店铺信息=====**/

//[请求]
interface ShopInfoReq {
	shopId: number; // 店铺id
	getShopPageConfig?: number; // 是否获取店铺页面配置信息
}

//[响应]
interface ShopInfoResp extends ShopInfo {}

/**=====母店下子店列表=====**/

//[请求]
interface ShopListReq {
	shopId?: number; // 店铺id
	shopType?: number; // 店铺类型 0:全部 1:母店 2:子店
	status?: number; // 店铺状态 0:全部 1:上架 2:下架 3:待审核
	shopCategoryId?: number; // 店铺分类id
	likeShopTag?: string; // 标签(模糊匹配)
	likeShopName?: string; // 店铺名称(模糊匹配)
	likeShopOwnerName?: string; // 店铺经营人姓名(模糊匹配)
	likeProvince?: string; // 省(模糊匹配)
	likeCity?: string; // 市(模糊匹配)
	likeDistrict?: string; // 区(模糊匹配)
	likeStreet?: string; // 街道(模糊匹配)
	likeAddress?: string; // 详细地址(模糊匹配)
}

//[响应]
interface ShopListResp extends Pagination<Array<ShopInfo>> {}

/**=====母店下子店列表=====**/

//[请求]
interface SubShopListReq extends Omit<ShopListReq, 'shopType'>, PaginationReq {
	mId: number;
}

//[响应]
interface SubShopListResp extends ShopListResp {}

/**=====店铺商品=====**/
//[请求]
interface ShopGoodsListReq extends PaginationReq {
	shopId: number;
	cateId?: number;
}

//[响应]
interface GoodsListResp extends Pagination<Array<GoodsInfo>> {}

//[请求]
interface GetShopGoodsInfoReq {
	shopId: number;
	goodsId: number;
}

/**=====店铺商品分类列表=====**/
//[请求]
interface ShopGoodsCategoryListReq {
	shopId: number;
	level: number;
	parentId?: number;
	queryChildren?: number;
}

//[响应]
interface ShopGoodsCategoryListResp {
	categoryList: Array<GoodsCategoryInfo>;
}

/**=====用户在店铺的购物车=====**/

//[请求]
interface GetUserShopGoodsCarReq {
	shopId: number;
}

//[响应]
interface UserShopGoodsCarResp {
	totalBuyCount: number; // 总购买数量
	totalOriginPrice: number; // 总原价
	totalSellPrice: number; // 总实价
	totalReducedPrice: number; // 总优惠(减少)价
	recordList: Array<GoodsCarGoodsInfo>;
}

//[请求]
interface SyncUserShopGoodsCarGoodsReq {
	shopId: number;
	goodsId: number;
	buyCount: number; // 选购总数量,非增量
}

//[请求]
interface ClearUserShopGoodsCarReq {
	shopId: number;
}
