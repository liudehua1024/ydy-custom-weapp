export class RouterManager implements Router {
	private readonly routeNameMap: Map<string, Route>;
	private readonly routeUrlMap: Map<string, Route>;
	private mainPageInstance: WxPage.Instance | undefined;

	constructor(routes: Array<Route>) {
		this.routeNameMap = new Map<string, Route>();
		this.routeUrlMap = new Map<string, Route>();

		routes.forEach((value) => {
			this.routeNameMap.set(value.name, value);
			this.routeUrlMap.set(value.url, value);
		});
	}

	init(mainPage: WxPage.Instance): void {
		this.mainPageInstance = mainPage;
	}

	getMainPage(): WxPage.Instance | undefined {
		return this.mainPageInstance;
	}

	to(to: ToRouteOption | RouteName): Promise<any> {
		if (typeof to === 'string') {
			to = { name: to };
		}
		const route = this.getRoute(to);
		if (!route) {
			let errText;
			if (to.name || to.url) {
				errText = `路由 ${JSON.stringify({ name: to.name, url: to.url })} 未注册到router`;
			} else {
				errText = '跳转需指定RouteName或者RouteUrl';
			}
			return Promise.reject(errText);
		}

		let url = route.url;
		if (route.isTab) {
			return wx.switchTab({
				url
			});
		}
		const { params, jsonParams } = Object.assign({ jsonParams: true }, to);

		if (params) {
			let paramsStr = '';
			if (jsonParams) {
				paramsStr = `params=${JSON.stringify(params)}`;
			} else {
				Object.keys(params).forEach((key) => {
					const val = params[key];
					if (paramsStr.length > 0) {
						paramsStr += '&';
					}

					paramsStr += `${key}=${wx.$strUtils.toString(val)}`;
				});
			}
			if (paramsStr.length > 0) {
				url = url + `?${paramsStr}`;
			}
		}

		switch (to.toType) {
			case 'reLaunch':
				return wx.reLaunch({ url });
			case 'redirectTo':
				return wx.redirectTo({ url });
			default:
				return wx.navigateTo({ url });
		}
	}

	pop(delta: number = 1): Promise<any> {
		const len = this.getRouteStack().length;
		if (delta <= 0 || len <= 1) {
			return new Promise(() => {
			});
		} else if (delta > len) {
			delta = len;
		}

		return wx.navigateBack({ delta });
	}

	popTo(to: string | ToRouteOption, toBeforePage: boolean = false): Promise<any> {
		const route = this.getRoute(to);
		if (!route) return new Promise(() => {
		});
		const stack = this.getRouteStack();
		let index = stack.findIndex((value) => {
			return value.url === route?.url;
		});
		if (toBeforePage) {
			index++;
		}
		return this.pop(index + 1);
	}

	getRouteStack(): Route[] {
		const sysRouteStack = RouterManager.getSysRouteStack();
		return sysRouteStack.map<Route>((value) => {
			let url = value.route;
			if (!url.startsWith('/')) {
				url = `/${url}`;
			}
			const route = this.getRoute({ url });
			return route ? route : ({} as Route);
		});
	}

	getTopRoute(): Route | undefined {
		const stack = this.getRouteStack();
		if (stack.length > 0) {
			return stack[0];
		}
		return undefined;
	}

	toPlugin(to: ToPluginOption | string): void {
		if (typeof to === 'string') {
			to = { name: to };
		}

		if (!to.url && to.name) { // 只有名称,直接前往插件的index
			to.url = `plugin://${to.name}/index`;
		}

		if (!to.url) {
			return;
		}

		const { params } = to;
		if (params) {
			let paramsStr = '';
			Object.keys(params).forEach((key) => {
				const val = params[key];
				paramsStr += `${paramsStr.length > 0 ? '&' : ''}${key}=${wx.$strUtils.toString(val)}`;
			});
			to.url += `?${paramsStr}`;
		}
		wx.navigateTo({ url: to.url }).then();
	}

	private static getSysRouteStack(): Array<WxPage.Instance> {
		// 获取已打开的页面数组
		const pageArr = getCurrentPages();
		if (wx.$isUtils.isArray(pageArr)) {
			// 页面数组反序后才是页面堆栈
			return pageArr.reverse();
		}
		return [];
	}

	private getRoute(search: string | ToRouteOption): Route | undefined {
		if (typeof search === 'string') {
			search = { name: search } as ToRouteOption;
		}

		let route;
		if (search.name && this.routeNameMap.has(search.name)) {
			route = this.routeNameMap.get(search.name);
		} else if (search.url && this.routeUrlMap.has(search.url)) {
			route = this.routeUrlMap.get(search.url);
		}

		if (route) {
			return Object.assign({}, route);
		}

		return undefined;
	}
}
