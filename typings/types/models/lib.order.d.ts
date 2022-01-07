//确认订单信息
interface ConfirmOrderInfo {
	shopInfo: ShopInfo; // 店铺信息
	totalBuyCount: number; // 购买物品总数
	totalOriginPrice: number; // 总价格
	totalReducedPrice: number; // 优惠金额
	payAmount: number; // 实际价格
	goodsList: OrderGoodsInfo[]; // 选购商品列表
}


//订单包含的商品信息
interface OrderGoodsInfo {
	recordId: number;        	// 记录id
	orderId: number; 					// 所属订单id
	goodsId: number;          // 商品id
	buyCount: number;         // 购买数量
	goodsOriginPrice: number; // 原价,商品信息快照
	goodsSellPrice: number;   // 实际售价,商品信息快照
	goodsName: string;        // 商品名称,商品信息快照
	goodsCoverImg: string;    // 商品图片,商品信息快照
	goodsDesc: string;        // 商品描述,商品信息快照
	goodsSpec: string;        // 商品规格说明,商品信息快照
	createdTime: number;      // 下单时间
}

//订单信息
interface OrderInfo {
	orderId: number;                 // 订单主键id
	orderSn: string;                 // 唯一订单编号
	goodsList: OrderGoodsInfo[]; // 订单包含商品信息
	orderType: number;               // 订单类型:1:普通订单
	userInfo: UserInfo;        			 // 用户信息
	shopInfo: ShopInfo;        			 // 店铺信息
	serviceShopInfo: ShopInfo; 			 // 服务点(母店)信息
	status: number;                  // 订单状态 1:未付款 2:已付款 3:交易成功 4:交易取消 5:交易关闭
	endValidPaymentTime: number; 		 // 最后付款有效时间
	totalAmount: number;             // 总价
	discountAmount: number;          // 折扣优惠金额
	promotionAmount: number;         // 店铺促销减免金额(店铺满减)
	couponAmount: number;            // 优惠券减免金额
	payAmount: number;               // 应付金额
	payOrderSn: string;              // 第三方支付生成的交易订单号
	payTime: number;                 // 支付时间
	remarks: string;                 // 订单备注
	deliveryType: number;            // 配送类型 1:自提 2:送货上门
	deliveryStatus: number;          // 配送状态 1:配货中 2:服务点已收货 3:客户已收货
	receiverName: string;            // 接收人名称
	receiverPhone: string;           // 接收人电话
	receiverProvince: string;        // 省份
	receiverCity: string;            // 城市
	receiverDistrict: string;        // 区域
	receiverAddress: string;         // 详细地址
	receiverHomeAddress: string;         // 门牌号
	receiverLongitude: number;       // 配送地址经度
	receiverLatitude: number;        // 配送地址纬度
	receivedTime: number;            // 确认收货时间
	canceledTime: number;            // 取消订单时间
	canceledReason: string;          // 取消订单原因备注
	createdTime: number;             // 创建时间
	canPostSalesService: boolean;    // 是否还能进行售后服务
}
