export const api = async (
	endpoint: string,
	method: "POST" | "GET" | "PUT" | "DELETE" = "GET",
	data: { [key: string]: string | number } = {}
): Promise<Response> => {
	return await fetch(`http://localhost:5173/api/${endpoint}`, {
		method,
		body: JSON.stringify(data)
	});
};
