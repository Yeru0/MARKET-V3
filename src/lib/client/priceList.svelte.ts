import { PUBLIC_WEBSOCKET_PORT, PUBLIC_WEBSOCKET_URL } from "$env/static/public";

class PriceListStateC {
	state: "org" | "par" = $state("par");
	isOrg: boolean = $state(this.state === "org" ? true : false);
	isPar: boolean = $state(this.state === "par" ? true : false);
	private ws?: WebSocket;
	private wsID: string = "";

	constructor() {
		this.ws = new WebSocket(`ws://${PUBLIC_WEBSOCKET_URL}:${PUBLIC_WEBSOCKET_PORT}`);

		this.ws.onerror = (e) => {
			console.error('Opening of the websocket "priceListState" failed. \n', e);
		};

		this.ws.onmessage = (message) => {
			switch (message.data) {
				case "org":
					this.state = "org";
					this.isOrg = true;
					this.isPar = false;
					break;
				case "par":
					this.state = "par";
					this.isOrg = false;
					this.isPar = true;
					break;
				default:
					this.wsID = message.data;
					this.ws?.send(JSON.stringify({ id: this.wsID, state: "set" }));
			}
		};
	}

	set(newState: "org" | "par") {
		this.state = newState;
		this.ws?.send(JSON.stringify({ id: this.wsID, state: newState }));

		this.isOrg = newState === "org" ? true : false;
		this.isPar = newState === "par" ? true : false;
	}

	switch() {
		switch (this.state) {
			case "org":
				this.set("par");
				break;
			case "par":
				this.set("org");
				break;
		}
	}

	close() {
		this.ws?.send(JSON.stringify({ id: this.wsID, state: "clo" }));
		this.ws?.close();
	}
}

export let priceList = new PriceListStateC();
