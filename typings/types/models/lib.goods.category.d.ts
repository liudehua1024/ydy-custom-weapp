interface GoodsCategoryInfo {
	categoryId: number;
	shopId: number;
	level: number;
	parentId: number;
	name: string;
	IconImg: string; // 小图标
	coverImg: string; // 封面大图
	sortOrder: number;
	canAddSub: boolean;
	children?: Array<GoodsCategoryInfo>;
}
