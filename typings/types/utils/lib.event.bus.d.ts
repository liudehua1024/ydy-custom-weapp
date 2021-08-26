interface EventBusData<T = any> {
	readonly eventName: string;
	/** 是否是粘性 **/
	readonly stick: boolean;
	/** 是否向继续上冒泡 **/
	readonly bubbles: boolean;
	/** 传递的数据 **/
	readonly data: T;

	/** 停止 **/
	stop(): void;
	/** 仅移除粘性标识,如果bubbles为true,可以继续冒泡 **/
	removeStickTag(): void;
}

/** EventBus触发后回调的方法 **/
type EventBusCallFun = (event: EventBusData) => void;

/** EventBus监听事件 **/
interface EventBusListener {
	/**是否只触发一次**/
	once?: boolean;
	onEvent: EventBusCallFun;
}

/** 事件监测组 **/
interface IEventBusGroup {
	/** 设置粘性事件数据map **/
	setGetStickDataFun(stickDataMap: Map<string, EventBusData>): void;

	/** 注册事件监听 **/
	registerEventListener(name: string, listener: EventBusListener | EventBusCallFun): void;

	/** 根据eventName移除监听,如果没有eventName则移除所有 **/
	unregisterEventListener(eventName?: string): void;

	/** 触发 **/
	onEvent(eventData: EventBusData): void;
}

interface IEventBusManager {
	/** 生成并自动注册事件监测组 **/
	createEventBusGroup(): IEventBusGroup;

	/** 注册事件监测组 **/
	registerEventBusGroup(group: IEventBusGroup): void;

	/** 移除事事件监测组 **/
	unregisterEventBusGroup(group: IEventBusGroup): void;

	/** 发送事件数据 **/
	pushEvent(eventName: string, data?: any): void;

	/** 发送粘性事件数据 **/
	pushStickEvent(eventName: string, data?: any): void;

	/** 移除粘性事件数据 **/
	removeStickEventData(...eventNames: string[]): void;
}
