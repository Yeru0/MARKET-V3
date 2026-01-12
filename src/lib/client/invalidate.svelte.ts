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
			// In theory everything is awaited and should run sequentially
			// In theory
			// In practice, though, sometimes it works sometimes it doesn't
			// This supposed to account for the times when it doesn't
			setTimeout(() => {
				this.functionList.forEach(async (fn) => {
					await fn();
				});
			}, 100);
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
