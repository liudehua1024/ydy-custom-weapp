interface GoodsInfo {
	goodsId: number; // 商品id
	shopId: number; // 商品属于的店铺id
	cateId: number; // 分类id
	cateName: string; // 分类名称
	name: string; // 商品名称
	coverImg: string; // 商品图片
	goodsDesc: string; // 商品描述
	goodsSpec: string; // 商品规格说明
	limitNum: number; // 限购数量	0:表示不限购
	costPrice: number; // 进价
	originPrice: number; // 原价
	sellPrice: number; // 当前售价
	discount: number; // 折扣	98=9.8折
	stock: number; // 当前库存
	dayStock: number; // 每日总库存
	autoFullStock: number; // 每日凌晨自动补充库存 1:开启 2:关闭
	monthSales: number; // 月销量
	totalSales: number; // 总销量
	createdTime: number; // 添加时间
}

interface GoodsCarGoodsInfo extends GoodsInfo {
	buyCount: number;
	isValid: boolean;
}
