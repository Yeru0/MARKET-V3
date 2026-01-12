import { PUBLIC_WEBSOCKET_PORT, PUBLIC_APP_IP_ADDRESS } from "$env/static/public";

class InvalidateC {
	private ws?: WebSocket;
	private functionList: (() => void)[] = [];

	constructor() {
		this.ws = new WebSocket(`ws://${PUBLIC_APP_IP_ADDRESS}:${PUBLIC_WEBSOCKET_PORT + 1}`);

		this.ws.onerror = (e) => {
			console.error('Opening of the websocket "priceListState" failed. \n', e);
		};

		this.ws.onmessage = () => {
			this.functionList.forEach(async (fn) => {
				await fn();
			});
		};
	}

	set() {
		this.ws?.send(JSON.stringify("inv"));
	}

	add(fn: () => void) {
		this.functionList.push(fn);
	}

	close() {
		this.ws?.close();
	}
}

export let invalid = new InvalidateC();
