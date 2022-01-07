Page(
	wx.$handlePageOption({
		data: {
			remarks: '',
			editable: true
		},
		$eventBusListeners: {},
		onLoad(query) {
			this.setTitle('编辑备注');
			const { remarks, editable } = Object.assign({
				remarks: '',
				editable: true
			}, query);
			this.setData({ remarks, editable });
		},
		onInput(evt: TouchEvent) {
			const { value } = evt.detail;
			this.setData({
				remarks: value
			});
		},
		onKeep() {
			const { remarks } = this.data;
			wx.$eventBus.pushEvent('changeRemarks', remarks);
			wx.$router.pop().then();
		}
	})
);
