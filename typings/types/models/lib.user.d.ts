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
