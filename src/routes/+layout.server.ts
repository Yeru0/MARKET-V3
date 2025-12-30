import { PUBLIC_WEBSOCKET_PORT } from "$env/static/public";
import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: parseInt(PUBLIC_WEBSOCKET_PORT) });

let clients: {
	id: string;
	ws: WebSocket;
}[] = [];

let currentState: "org" | "par" = "par";

wss.on("connection", (ws) => {
	const id: string = crypto.randomUUID();
	clients.push({ id, ws });
	ws.send(id);
	console.log(id, " connected");

	ws.on("message", (message) => {
		//Org: Selling to staff
		//Par: Selling to participants
		//Set: Connection established, waiting for current state
		//Clo: Closing connection
		const msg: { id: string; state: "org" | "par" | "clo" | "set" } = JSON.parse(`${message}`);

		if (msg.state === "set") {
			ws.send(currentState);
			return;
		}

		for (let c of clients) {
			if (c.id === msg.id) {
				if (msg.state === "clo") {
					clients.splice(clients.indexOf(c), 1);
					console.log(id, " disconnected");
					return;
				}
				continue;
			}

			c.ws.send(msg.state);
		}

		switch (msg.state) {
			case "par":
				currentState = "par";
				break;
			case "org":
				currentState = "org";
				break;
		}
		// ---- About this piece of code and the "set" state in general ---
		//
		// When a new device is connected it is unaware of the current
		// state of the price list, at least until the next time it
		// changes, so after the new device receives its own ID
		// upon connection, it sends a message with the "set" state.
		// To the "set" message the server simply responds with the
		// current state. The code lines above are responsible to
		// keep the current state up to date in the server as well.
	});
});
