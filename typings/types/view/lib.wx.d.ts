type IAnyObject = Record<string, any>;

type SelectorQuery = WechatMiniprogram.SelectorQuery;
type TouchEvent = WechatMiniprogram.TouchEvent;
type TouchDetail = { detail: WechatMiniprogram.IAnyObject };

interface EventWxOptions {
	/**使用$handlePageOption会自动在onLoad执注入*/
	$eventBusGroup?: IEventBusGroup;
	/**使用$handlePageOption会自动在onLoad执行后注册*/
	$eventBusListeners?: Record<string, EventBusCallFun | EventBusListener>;

	$initBusGroup?(): void;

	$removeEventGroup?(): void;
}

interface ApiOption {
	$api?: ApiRequest;
}

declare namespace WxComponent {
	type AllProperty = WechatMiniprogram.Component.AllProperty;
	type DataOption = IAnyObject;
	type PropertyOption = Record<string, AllProperty>;
	type MethodOption = Record<string, Function>;

	type Instance<
		TData extends DataOption = DataOption,
		TProperty extends PropertyOption = PropertyOption,
		TMethod extends MethodOption = MethodOption,
		TCustomInstanceProperty extends IAnyObject = IAnyObject,
		TIsPage extends boolean = false
	> = WechatMiniprogram.Component.Instance<
		TData,
		TProperty,
		TMethod,
		TCustomInstanceProperty,
		TIsPage
	> &
		EventWxOptions &
		ApiOption;

	type BasicsOption<
		TData extends DataOption = DataOption,
		TProperty extends PropertyOption = PropertyOption,
		TMethod extends MethodOption = MethodOption
	> = Partial<WechatMiniprogram.Component.Data<TData>> &
		Partial<WechatMiniprogram.Component.Property<TProperty>> &
		Partial<WechatMiniprogram.Component.Method<TMethod>> &
		Partial<WechatMiniprogram.Component.Lifetimes> &
		Partial<EventWxOptions> &
		Partial<ApiOption>;

	type Options<
		TData extends DataOption = DataOption,
		TProperty extends PropertyOption = PropertyOption,
		TMethod extends MethodOption = MethodOption,
		TCustomInstanceProperty extends IAnyObject = IAnyObject,
		TIsPage extends boolean = false
	> = BasicsOption<TData, TProperty, TMethod> &
		Partial<WechatMiniprogram.Component.OtherOption> &
		ThisType<Instance<TData, TProperty, TMethod, TCustomInstanceProperty, TIsPage> & IAnyObject>;
}

declare namespace WxBehavior {
	type Instance = WxComponent.Instance;
	type Options = WxComponent.BasicsOption &
		Partial<Omit<WechatMiniprogram.Component.OtherOption, 'options'>> &
		ThisType<Instance>;
}

declare namespace WxPage {
	type DataOption = IAnyObject;
	type CustomOption = IAnyObject;

	interface OtherCreateOption {
		/**是否是首页**/
		$main?: boolean;
		$jsonParams?: boolean;
	}

	interface OtherInstanceOption extends OtherCreateOption {
		$jsonParams: boolean;
		setTitle(title: string): void;
		setBackState(state: boolean): void;
	}

	type OtherOption<TOther> = TOther & EventWxOptions & ApiOption;

	type OptionalInterface<T> = { [K in keyof T]: Optional<T[K]> };

	type Instance<
		TData extends DataOption = DataOption,
		TCustom extends CustomOption = CustomOption
	> = OptionalInterface<WechatMiniprogram.Page.ILifetime> &
		WechatMiniprogram.Page.InstanceProperties &
		WechatMiniprogram.Page.InstanceMethods<TData> &
		WechatMiniprogram.Page.Data<TData> &
		OtherOption<OtherInstanceOption> &
		TCustom;

	type BasicsOption = Partial<WechatMiniprogram.Page.ILifetime> & OtherOption<OtherCreateOption>;

	type Options<TData extends DataOption = DataOption, TCustom extends CustomOption = CustomOption> =
		Partial<WechatMiniprogram.Page.Data<TData>> &
			BasicsOption &
			TCustom &
			ThisType<Instance<TData, TCustom>>;
}
