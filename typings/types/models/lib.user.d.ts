interface UserInfo extends Record<string, any> {
	id: number;
	account: string;
	nick: string;
	headUrl: string;
	usertype: number;
	status: number;
	realName: string;
	gender: number;
	birthday: number;
	email: string;
	province: string;
	city: string;
	country: string;
	phoneNumber: string;
	createdTime: number;
}

interface AddressInfo {
	province?: string; // 省
	city?: string; // 市
	district?: string; // 区/县
	address?: string; // 详细地址
	homeAddress?: string; // 门牌号(具体房间)
	longitude?: number; // 经度
	latitude?: number; // 纬度
}

interface UserAddressInfo extends AddressInfo {
	id?: number; // 记录id
	receiverName: string; // 收件人姓名
	gender?: number; // 性别: 1男 2女
	phoneNumber: string;// 手机号码
	defTag?: number; // 1默认地址
}
