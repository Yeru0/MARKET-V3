import type { SaleEvent } from "$lib/prisma/client";
import { db } from "$lib/server/db";

export const POST = async (): Promise<Response> => {
	let response: Response = new Response(
		JSON.stringify("Database read all sale events action could not be performed!"),
		{
			status: 500,
			statusText: "Database read all sale events action could not be performed!"
		}
	);

	await db.saleEvent
		.findMany({
			include: {
				products: true
			}
		})
		.then((result: SaleEvent[]) => {
			response = new Response(JSON.stringify(result), {
				status: 200,
				statusText: "All sale events read successfully!"
			});
		})
		.catch((err: Error) => {
			console.error(err);
			response = new Response(JSON.stringify(err.message), {
				status: 500,
				statusText: err.message
			});
		});

	return response;
};
