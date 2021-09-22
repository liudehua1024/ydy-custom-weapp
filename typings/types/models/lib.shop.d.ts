interface BusinessTimeInfo {
	startTime: number;
	endTime: number;
}

interface ShopSalesInfo {
	shopId: number;
	yesterdaySales: number;
	monthSales: number;
	yearSales: number;
}

// 店铺到货时间
interface ShopAogInfo {
	aogIntervalDay?: number;
	aogTime?: number;
}

interface ShopBaseInfo {
	shopId: number; // 店铺Id
	shopName: string; // 店铺名称
	shopImgUrl: string; // 店铺图片链接
	shopType: number; // 店铺类型 1:母店2:子店
	shopStatus: number; // 店铺状态 1:上加2:下架
	businessTimeList: BusinessTimeInfo[]; // 营业时间
	psTimeType: number; // 配送时间类型1当日达2次日达
	psTime: number; // 配送时间(秒)
	genListTime: number; // 生成清单时间(秒),超过生成清单时间的订单算次日订单
	shopCategoryId: number; // 店铺分类id
	shopCategoryName: string; // 店铺分类名称
	shopTags: string; // 标签,多个用逗号隔开
	shopNotice: string; // 公告
	shopOwnerName: string; // 店铺经营人真实姓名
	shopPhoneNumbers: string; // 联系电话,多个逗号隔开
	province: string; // 省
	city: string; // 市
	district: string; // 区
	street: string; // 街道
	address: string; // 详细地址
	latitude: string; // 经度(最多20位)
	longitude: string; // 纬度(最多20位)
	shopTitleImgUrl: string; // 店面招牌图片地址
}

interface ShopInfo extends ShopBaseInfo, ShopAogInfo {
	shopSalesInfo?: ShopSalesInfo; // 店铺销量信息
	shopPageConfigList?: Array<ShopPageConfig>; // 店铺页面配置信息
}
