/// <reference path="./lib.wx.d.ts" />
/// <reference path="./lib.toast.d.ts" />
/// <reference path="./lib.dialog.d.ts" />
/// <reference path="./lib.tab.bar.d.ts" />

interface ViewRect {
	/** 宽度 */
	width: number;
	/** 高度 */
	height: number;
	/** 上边界坐标 */
	top: number;
	/** 下边界坐标 */
	bottom: number;
	/** 左边界坐标 */
	left: number;
	/** 右边界坐标 */
	right: number;
}

interface GoodsCarPosInfo {
	/** x坐标 */
	x: number;
	/** y坐标 */
	y: number;
	/** 宽度 */
	width: number;
	/** 高度 */
	height: number;
}

interface GoodsCarAnimOption {
	scrollTop: number;
	opacity: number;
	width: number;
	height: number;
	top: number;
	left: number;
}

interface CateGoodsListInfo {
	cateId: number;
	curPage: number;
	hasNextPage: boolean;
	scrollTop: number;
	goodsList: Array<GoodsInfo>;
}
