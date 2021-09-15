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
interface ShopInfoResp extends ShopInfo {
}

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
interface ShopListResp extends Pagination<Array<ShopInfo>> {
}

/**=====母店下子店列表=====**/

//[请求]
interface SubShopListReq extends Omit<ShopListReq, 'shopType'>, PaginationReq {
	mId: number;
}

//[响应]
interface SubShopListResp extends ShopListResp {
}

/**=====店铺商品=====**/
//[请求]
interface ShopGoodsListReq extends PaginationReq {
	shopId: number;
	cateId?: number;
}

//[响应]
interface GoodsListResp extends Pagination<Array<GoodsInfo>> {
}

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

//[请求]购买商品
interface BuyGoodsReq {
	goodsId: number;
	goodsName: string;
	buyCount: number;
	originPrice: number;
	sellPrice: number;
}

//[请求]创建订单
interface CreateOrderReq {
	shopId: number; // 店铺id
	serviceShopId: number;// 服务点id(母店id)
	goodsList: BuyGoodsReq[];// 购买商品列表
	totalAmount: number;// 订单总金额
	payAmount: number;// 订单应付金额
	payMethod: number;// 支付方式: 1微信
	remarks?: string;// 备注
	deliveryType: number;// 配送类型: 1服务点自提 2送货上门
	receiverName: string;// 接收人名称
	receiverPhone: string;// 接收人手机号
	receiverProvince?: string;// 省份,deliveryType=2时,为必传
	receiverCity?: string;// 城市,deliveryType=2时,为必传
	receiverDistrict?: string;// 区域,deliveryType=2时,为必传
	receiverAddress?: string;// 详细地址,deliveryType=2时,为必传
	receiverLongitude?: number;// 经度,deliveryType=2时,为必传
	receiverLatitude?: number;// 纬度,deliveryType=2时,为必传
}

//[响应]发起支付需要的信息
interface PaymentInfoResp {
	timeStamp: string;
	nonceStr: string;
	package: string;
	signType: 'MD5' | 'HMAC-SHA256' | 'RSA';
	paySign: string;
}

//[响应]创建的订单信息
interface CreateOrderResp extends OrderInfo {
	paymentInfo: PaymentInfoResp;
}
