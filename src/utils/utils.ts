export const isUtils: IsUtils = {
	isNumber: function(num: any): num is number {
		switch (typeof num) {
			case 'number':
			case 'bigint':
				return true;
			case 'string':
				return !isNaN(Number(num));
		}
		return false;
	},
	isString: function(arg: any): arg is string {
		return typeof arg === 'string';
	},
	isObject: function(obj: any): obj is Object {
		return typeof obj === 'object';
	},
	isFun: function(fun: any): fun is Function {
		return typeof fun === 'function';
	},
	isArray: function(arr: any): arr is any[] {
		return Array.isArray(arr);
	},
	isEmpty(arg: any): boolean {
		switch (typeof arg) {
			case 'undefined':
				return true;
			case 'string':
				return arg.length === 0;
			case 'object':
				if (this.isArray(arg)) {
					return arg.length === 0;
				}
				return Object.keys(arg).length === 0;
			case 'number':
				return isNaN(arg);
			default:
				return false;
		}
	},
	isPhoneNumber(str: string): boolean {
		return /^1[3|4|5|6|7|8|9]\d{9}$/.test(str);
	}
};

export const strUtils: StrUtils = {
	toString(arg: any): string {
		switch (typeof arg) {
			case 'undefined':
				return '';
			case 'string':
				return arg;
			case 'object':
				return JSON.stringify(arg);
			default:
				return arg + '';
		}
	},
	repeatStr(str: string, count: number = 1): string {
		const arr = [];
		for (let i = 0; i < count; i++) {
			arr.push(str);
		}
		return arr.join('');
	},
	insertStr(src: string, index: number, str: string): string {
		const len = src.length;
		if (index >= len) {
			return src + str;
		}

		return src.substring(0, index) + str + src.substring(index, len);
	},
	contains(src: string, ...subs: string[]): boolean {
		if (subs && subs.length > 0) {
			for (const sub in subs) {
				if (sub && src.indexOf(sub) != -1) {
					return true;
				}
			}
		}
		return false;
	},
	padStart(src: string, len: number, padStr = ' '): string {
		for (let srcLen = src.length; srcLen < len; srcLen = src.length) {
			src = `${padStr.substring(0, len - srcLen)}${src}`;
		}
		return src;
	},
	padEnd(src: string, len: number, padStr = ' '): string {
		for (let srcLen = src.length; srcLen < len; srcLen = src.length) {
			src = `${src}${padStr.substring(0, len - srcLen)}`;
		}
		return src;
	}
};

export const numUtils: NumberUtils = {
	toInt(num: number): number {
		if (isNaN(num)) return num;
		return parseInt(num + '');
	},
	fixed(num: number, fractionDigits: number = 2): string {
		return num.toFixed(fractionDigits);
	},
	strToNumber(numStr: string): number {
		return Number(numStr);
	},
	strToInt(numStr: string): number {
		return this.toInt(Number(numStr));
	},
	decimalsLen(num: number): number {
		const numStr = String(num);
		const dotIndex = numStr.indexOf('.');
		if (dotIndex === -1) {
			return 0;
		}

		let i = numStr.length - 1;
		for (; i > dotIndex; i--) {
			if (numStr.charAt(i) !== '0') {
				break;
			}
		}

		return i - dotIndex;
	},
	sum(num1: number, num2: number): number {
		const maxDecimalsLen = Math.max(this.decimalsLen(num1), this.decimalsLen(num2));
		const numStr1 = numUtils.fixed(num1, maxDecimalsLen).replace('.', '');
		const numStr2 = numUtils.fixed(num2, maxDecimalsLen).replace('.', '');

		let sumStr = (Number(numStr1) + Number(numStr2)).toString();
		let len = sumStr.length;
		if (len < maxDecimalsLen) { // 位数不足,需要前补0
			sumStr = strUtils.insertStr(sumStr, 0, strUtils.repeatStr('0', maxDecimalsLen - len));
			len = maxDecimalsLen;
		}

		// 插入小数点,还原为小数
		sumStr = strUtils.insertStr(sumStr, len - maxDecimalsLen, '.');
		len += 1;

		return Number(sumStr);
	},
	multiplication(num1: number, num2: number): number {
		let maxDecimalsLen = Math.max(this.decimalsLen(num1), this.decimalsLen(num2));
		const numStr1 = numUtils.fixed(num1, maxDecimalsLen).replace('.', '');
		const numStr2 = numUtils.fixed(num2, maxDecimalsLen).replace('.', '');
		maxDecimalsLen = maxDecimalsLen * 2; // 乘法位数会变双倍

		let productStr = (Number(numStr1) * Number(numStr2)).toString();
		let len = productStr.length;

		if (len < maxDecimalsLen) { // 位数不足,需要前补0
			productStr = strUtils.insertStr(productStr, 0, strUtils.repeatStr('0', maxDecimalsLen - len));
			len = maxDecimalsLen;
		}

		// 插入小数点,还原为小数
		productStr = strUtils.insertStr(productStr, len - maxDecimalsLen, '.');

		return Number(productStr);
	}
};

export const arrayUtils: ArrayUtils = {
	strToArray(str: string, separator: string = ','): string[] {
		if (!str || separator === undefined) return [];

		if (str.startsWith(separator)) str = str.substring(separator.length);
		if (str.endsWith(separator)) str = str.substring(0, str.length - separator.length);

		return str.split(separator);
	},
	strToNumberArray(str: string, separator: string = ','): number[] {
		const strArr = this.strToArray(str, separator);

		return strArr.map<number>((val) => {
			return wx.$numUtils.strToNumber(val);
		});
	}
};

export const dateUtils: DateUtils = {
	getCurTimestamp(): number {
		return numUtils.toInt(Date.now() / 1000);
	},
	getZeroTimestamp(timestamp?: number): number {
		let date: Date;
		if (timestamp) {
			date = this.toDate(timestamp);
		} else {
			date = new Date();
		}

		date.setHours(0, 0, 0, 0);
		return this.toTimestamp(date);
	},
	getMothStartAndEnd(timestamp?: number): { startTime: number, endTime: number } {
		const ret = { startTime: 0, endTime: 0 };

		let date: Date;
		if (timestamp) {
			date = this.toDate(timestamp);
		} else {
			date = new Date();
		}

		date.setDate(1);
		date.setHours(0, 0, 0, 0);
		ret.startTime = this.toTimestamp(date);

		const moth = date.getMonth();

		// 获取下个月的开始时间
		if (moth < 11) {
			date.setMonth(moth + 1, 1);
		} else { // 跨年
			const year = date.getFullYear();
			date.setFullYear(year + 1, 1, 1);
		}

		// 下个月开始时间(秒)-1,为上个月的结束时间
		ret.endTime = this.toTimestamp(date) - 1;

		return ret;
	},
	toDate(timestamp: number): Date {
		return new Date(timestamp * 1000);
	},
	toTimestamp(date: Date): number {
		return numUtils.toInt(date.valueOf() / 1000);
	},
	format(time: number | Date, formatStr = 'yyyy-MM-dd HH:mm:ss'): string {
		if (typeof time === 'number') {
			time = this.toDate(time);
		}

		const opt: Record<string, string> = {
			'y+': time.getFullYear().toString(),        // 年
			'M+': (time.getMonth() + 1).toString(),     // 月
			'd+': time.getDate().toString(),            // 日
			'H+': time.getHours().toString(),           // 时,24小时制
			'h+': (time.getHours() % 12).toString(),    // 时,12小时制
			'm+': time.getMinutes().toString(),         // 分
			's+': time.getSeconds().toString()          // 秒
		};

		let ret;
		for (let k in opt) {
			ret = new RegExp('(' + k + ')').exec(formatStr);
			if (ret) {
				formatStr = formatStr.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (strUtils.padStart(opt[k], ret[1].length, '0')));
			}
		}

		return formatStr;
	}

};

export const viewHelper: ViewHelper = {
	disposeSizeStyle: function(size: number | string, defUnit: 'px' | 'rpx' = 'rpx'): string {
		let sizeStr = size + '';
		if (isUtils.isNumber(size)) {
			sizeStr += defUnit;
		}
		return sizeStr;
	},
	toCssStyleString: function(styleObj: Record<string, string | number | undefined>): string {
		let styleStr = '';
		Object.keys(styleObj).forEach((key) => {
			const val = styleObj[key];
			if (val) {
				styleStr += `${key}:${val};`;
			}
		});
		return styleStr;
	}
};

export const privacyHelper: PrivacyHelper = {
	filterName(name: string): string {
		if (!name) {
			return '';
		}
		return name.charAt(0) + '**';
	},
	filterPhoneNumber(phoneNumber: string): string {
		if (!phoneNumber) {
			return '';
		}
		const ln = phoneNumber.length;
		if (ln > 6) {
			return phoneNumber.substring(0, 2) + '*****' + phoneNumber.substring(ln - 4, ln);
		}
		return phoneNumber;
	}
};
