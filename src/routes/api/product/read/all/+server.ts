import type { Product } from "$lib/prisma/client";
import { db } from "$lib/server/db";
import type { RequestEvent } from "@sveltejs/kit";

export const GET = async (): Promise<Response> => {
	let response: Response = new Response(JSON.stringify("Database read product action could not be performed!"), {
		status: 500,
		statusText: "Database read all products action could not be performed!"
	});

	await db.product
		.findMany()
		.then((result: Product[]) => {
			response = new Response(JSON.stringify(result), {
				status: 200,
				statusText: "All products read successfully!"
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
