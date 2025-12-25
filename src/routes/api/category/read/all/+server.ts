import type { ProductCategory } from "$lib/prisma/client";
import { db } from "$lib/server/db";

export const POST = async (): Promise<Response> => {
	let response: Response = new Response(
		JSON.stringify("Database read all categories action could not be performed!"),
		{
			status: 500,
			statusText: "Database read all categories action could not be performed!"
		}
	);

	await db.productCategory
		.findMany({
			include: {
				Products: true
			},
			orderBy: {
				name: "asc"
			}
		})
		.then((result: ProductCategory[]) => {
			response = new Response(JSON.stringify(result), {
				status: 200,
				statusText: "All categories read successfully!"
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
