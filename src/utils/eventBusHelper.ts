class EventData<T = any> implements EventBusData<T> {
	readonly eventName: string;
	readonly data: T;
	stick: boolean;
	bubbles: boolean;

	constructor(eventName: string, data: T, stick: boolean = false, bubbles: boolean = true) {
		this.bubbles = bubbles;
		this.data = data;
		this.eventName = eventName;
		this.stick = stick;
	}

	stop() {
		this.bubbles = false;
		this.stick = false;
	}

	removeStickTag() {
		this.stick = false;
	}
}

class EventBusGroup implements IEventBusGroup {
	private readonly eventMap: Map<string, Array<EventBusListener>>;
	private stickDataMap: Map<string, EventBusData> | undefined;

	constructor() {
		this.eventMap = new Map<string, Array<EventBusListener>>();
	}

	setGetStickDataFun(stickDataMap: Map<string, EventBusData>) {
		this.stickDataMap = stickDataMap;
	}

	registerEventListener(eventName: string, listener: EventBusListener | EventBusCallFun): void {
		if (wx.$isUtils.isFun(listener)) {
			listener = { onEvent: listener } as EventBusListener;
		}

		const arr = this.eventMap.get(eventName);
		if (!arr) {
			this.eventMap.set(eventName, [listener]);
		} else {
			arr.unshift(listener);
		}

		if (this.stickDataMap) {
			const stickData = this.stickDataMap.get(eventName);
			if (stickData && stickData.bubbles && stickData.stick) {
				if (wx.$isUtils.isFun(listener.onEvent)) listener.onEvent(stickData);
			}
		}
	}

	unregisterEventListener(eventName?: string): void {
		if (eventName) {
			this.eventMap.delete(eventName);
		} else {
			this.eventMap.clear();
		}
	}

	onEvent(eventData: EventBusData): void {
		const list = this.eventMap.get(eventData.eventName);
		if (!wx.$isUtils.isArray(list)) return;
		for (let i = 0; i < list.length; i++) {
			const listener = list[i];

			if (wx.$isUtils.isFun(listener.onEvent)) {
				listener.onEvent(eventData);
			}

			if (listener.once) {
				list.splice(i, 1);
				i--;
			}

			if (!eventData.bubbles) {
				return;
			}
		}
	}
}

export class EventBusManager implements IEventBusManager {
	private readonly eventGroup: Array<IEventBusGroup>;
	private readonly stickDataMap: Map<string, EventBusData>;

	constructor() {
		this.eventGroup = new Array<IEventBusGroup>();
		this.stickDataMap = new Map<string, EventBusData>();
	}

	createEventBusGroup(): IEventBusGroup {
		return new EventBusGroup();
	}

	registerEventBusGroup(group: IEventBusGroup): void {
		if (!group) return;
		group.setGetStickDataFun(this.stickDataMap);
		this.eventGroup.unshift(group);
	}

	unregisterEventBusGroup(group: IEventBusGroup): void {
		if (!group) return;
		group.unregisterEventListener();
		const index = this.eventGroup.indexOf(group);
		if (index !== -1) {
			this.eventGroup.splice(index, 1);
		}
	}

	pushEvent(eventName: string, data?: any): void {
		const eventData = new EventData(eventName, data);
		this.pushEventData(eventData);
	}

	pushStickEvent(eventName: string, data?: any): void {
		const eventData = new EventData(eventName, data, true);
		this.pushEventData(eventData);
		if (eventData && eventData.bubbles && eventData.stick) {
			this.stickDataMap.set(eventData.eventName, eventData);
		}
	}

	private pushEventData(eventData: EventBusData) {
		for (let i = 0; i < this.eventGroup.length; i++) {
			const group = this.eventGroup[i];
			group.onEvent(eventData);

			if (!eventData.bubbles) {
				return;
			}
		}
	}

	removeStickEventData(...eventNames: string[]): void {
		if (wx.$isUtils.isArray(eventNames)) {
			eventNames.forEach((eventName) => {
				const eventData = this.stickDataMap.get(eventName);
				if (eventData) {
					eventData.stop();
					this.stickDataMap.delete(eventName);
				}
			});
		}
	}
}
