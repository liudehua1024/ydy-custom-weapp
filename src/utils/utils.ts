export const isUtils: IsUtils = {
	isNumber: function (num: any): num is number {
		switch (typeof num) {
			case 'number':
			case 'bigint':
				return true;
			case 'string':
				return !isNaN(Number(num));
		}
		return false;
	},
	isString: function (arg: any): arg is string {
		return typeof arg === 'string';
	},
	isObject: function (obj: any): obj is Object {
		return typeof obj === 'object';
	},
	isFun: function (fun: any): fun is Function {
		return typeof fun === 'function';
	},
	isArray: function (arr: any): arr is any[] {
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
	}
};

export const strUtils: StrUtils = {
	toString(arg: any): string {
		switch (typeof arg) {
			case 'undefined':
				return '';
			case 'string':
			case 'object':
			case 'symbol':
				return arg.toSting();
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
	sum(num1: number, num2: number, fractionDigits = 2): string {
		const numStr1 = numUtils.fixed(num1, fractionDigits).replace('.', '');
		const numStr2 = numUtils.fixed(num2, fractionDigits).replace('.', '');

		let sumStr = (Number(numStr1) + Number(numStr2)).toString();
		let len = sumStr.length;
		if (len > fractionDigits) {
			sumStr = strUtils.insertStr(sumStr, len - fractionDigits, '.');
			len = fractionDigits;
		} else {
			sumStr = '0.' + sumStr;
		}

		if (len < fractionDigits) {
			sumStr += strUtils.repeatStr('0', fractionDigits - len + 1);
		}

		return sumStr;
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

export const viewHelper: ViewHelper = {
	disposeSizeStyle: function (size: number | string, defUnit: 'px' | 'rpx' = 'rpx'): string {
		let sizeStr = size + '';
		if (isUtils.isNumber(size)) {
			sizeStr += defUnit;
		}
		return sizeStr;
	},
	toCssStyleString: function (styleObj: Record<string, string | number | undefined>): string {
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
