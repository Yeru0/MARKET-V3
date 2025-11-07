export const api = async (
	endpoint: string,
	method: "POST" | "GET" | "PUT" | "DELETE" = "GET",
	data: { [key: string]: string | number } = {}
): Promise<Response> => {
	return await fetch(endpoint, {
		method,
		body: JSON.stringify(data)
	});
};
