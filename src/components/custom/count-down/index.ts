Component({
	countState: false,
	countIntervalId: 0,
	externalClasses: ['my-class'],
	properties: {
		endTime: {
			type: Number,
			optionalTypes: [Object]
		},
		value: {
			type: Number,
		},
		format: {
			type: String,
			value: 'mm:ss' // hh:mm:ss mm:ss ss auto
		}
	},
	data: {
		countSecond: 0,
		showCountTimeStr: ''
	},
	observers: {
		'endTime,value': function(endTime: number | object, value: number) {
			console.log('startCountTime');
			if (value) {
				this.setData({ countSecond: value });
			} else {
				let endTimestamp = 0;
				if (endTime instanceof Date) {
					endTimestamp = wx.$numUtils.toInt(endTime.valueOf() / 1000);
				} else if (typeof endTime === 'number') {
					endTimestamp = endTime;
				}
				let countSecond = endTimestamp - wx.$numUtils.toInt(Date.now() / 1000);
				if (countSecond < 0) countSecond = 0;
				this.setData({ countSecond });
			}

			this.startCountTime();

		},
		'countSecond,format': function(countSecond: number, format: string) {
			const h = wx.$numUtils.toInt(countSecond / 3600);
			countSecond = countSecond % 3600;
			const m = wx.$numUtils.toInt(countSecond / 60);
			const s = countSecond % 60;

			let hh = `${h > 9 ? '' : '0'}${h}`;
			let mm = `${m > 9 ? '' : '0'}${m}`;
			let ss = `${s > 9 ? '' : '0'}${s}`;

			let showCountTimeStr = '';
			switch (format) {
				case 'hh:mm:ss':
					showCountTimeStr = `${hh}:${mm}:${ss}`;
					break;
				case 'hh:mm':
					showCountTimeStr = `${hh}:${mm}`;
					break;
				case 'mm:ss':
					showCountTimeStr = `${mm}:${ss}`;
					break;
				case 'ss':
					showCountTimeStr = `${ss}`;
					break;
				default:
					if (h > 0) {
						showCountTimeStr += hh;
					}

					if (h > 0 || m > 0) {
						showCountTimeStr += `${showCountTimeStr ? ':' : ''}${mm}`;
					}

					showCountTimeStr += `${showCountTimeStr ? ':' : ''}${ss}`;
					break;
			}

			this.setData({ showCountTimeStr });

		}
	},
	methods: {
		startCountTime() {
			console.log('startCountTime');
			this.stopCountTime();

			this.countState = true;
			this.countIntervalId = setInterval(() => {
				if (this.countState) {
					let { countSecond } = this.data;
					if (countSecond > 0) {
						countSecond--;
					}

					if (countSecond <= 0) {
						this.stopCountTime();
						this.countEnd();
					}

					this.setData({ countSecond });
				}
			}, 1000, 1000);
		},
		stopCountTime() {
			this.countState = false;
			if (this.countIntervalId) clearInterval(this.countIntervalId);
		},
		countEnd() {
			this.triggerEvent('countEnd', {}, {
				bubbles: true, composed: true, capturePhase: true
			});
		}
	}
} as WxComponent.Options);
