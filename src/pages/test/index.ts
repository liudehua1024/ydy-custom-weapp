Page(
	wx.$handlePageOption({
		page: 1,
		data: {
			recordList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
			// recordList: [1, 2]
		},
		onLoad(_: Record<string, any>): void | Promise<void> {},
		onClick() {
			const goodsCard = this.selectComponent('#goods-card');
			goodsCard.startAnim(400, 300, 50);
		}
	})
);
