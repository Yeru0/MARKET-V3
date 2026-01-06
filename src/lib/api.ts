import { PUBLIC_API_PORT, PUBLIC_APP_IP_ADDRESS } from "$env/static/public";

export const api = async (
	endpoint: string,
	method: "POST" | "GET" | "PUT" | "DELETE" = "GET",
	data: {
		[key: string]:
			| string
			| number
			| string[]
			| number[]
			| {
					qty: number;
					id: string;
			  }[];
	} = {}
): Promise<Response> => {
	return await fetch(`http://${PUBLIC_APP_IP_ADDRESS}:${PUBLIC_API_PORT}/api/${endpoint}`, {
		method,
		body: JSON.stringify({ ...data })
	});
};
