import { httpRequest } from '@/api/request';

export class RequestManager {
	private readonly taskMap: Record<string, HttpRequestTask | undefined>;
	private state = true;

	constructor() {
		this.taskMap = {};
	}

	private addTask(key: string, task: HttpRequestTask): void {
		if (!task || !task.req) return;
		this.taskMap[key] = task;
	}

	private removeTask(key: string): void {
		const task = this.taskMap[key];
		if (task && task.wxTask) {
			task.wxTask.abort();
		}
		this.taskMap[key] = undefined;
	}

	stopTask(key?: string): void {
		if (key) {
			this.removeTask(key);
		} else {
			this.stopAll();
		}
	}

	private stopAll(): void {
		this.state = false;
		Object.keys(this.taskMap).forEach((key) => {
			this.removeTask(key);
		});
		this.state = true;
	}

	protected request<T>(reqConfig: RequestConfig, callback?: RequestCallback<T>): void {
		if (!this.state) return;
		const key = reqConfig.method + '_' + reqConfig.url;
		httpRequest.request(reqConfig, {
			ready: (config, task) => {
				this.addTask(key, task);
				if (callback && wx.$isUtils.isFun(callback.ready)) callback.ready(config, task);
			},
			success: (res) => {
				this.removeTask(key);
				if (callback && wx.$isUtils.isFun(callback.success)) callback.success(res);
			},
			fail: (err) => {
				this.removeTask(key);
				if (callback && wx.$isUtils.isFun(callback.fail)) callback.fail(err);
			},
			complete: () => {
				if (callback && wx.$isUtils.isFun(callback.complete)) callback.complete();
			}
		} as RequestCallback<T>);
	}
}
