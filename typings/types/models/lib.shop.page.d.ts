// 公告组件
interface NoticeComponent {
	content: string; // 公告内容	最多50字
}

// 图文项
interface ImageTextItemComponent {
	title?: string; // 标题
	imgUrl: string; // 图片链接
	hrefType: number; // 跳转类型	1图文广告2商品3子店
	hrefUrl?: string; // "注意:该参数为空时,表明不需要跳转
}

// 滚动图
interface BannerComponent {
	subItems: Array<ImageTextItemComponent>; // 图文子项
}

// 宫格导航
interface CellNavigationComponent {
	title: string; // 标题
	titleIcon: string; // 标题图标
	rowCount: number; // 一行展示数量,可选范围3~6
	subItems: Array<ImageTextItemComponent>; // 子组件,最多3行
}

// 店铺首页组件
interface ShopPageComponent {
	componentType: number; // 1轮播图2图文导航3公告
	component: NoticeComponent | BannerComponent | CellNavigationComponent; // 具体模块数据
}

// 店铺页面配置信息
interface ShopPageConfig {
	shopId: number; // 店铺id
	pageType: number; // 页面配置
	status: number; // 1启用 2未启用
	config: string; // 配置信息
}
