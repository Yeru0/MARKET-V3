import type { BatchPayload } from "$lib/prisma/internal/prismaNamespace";
import { db } from "$lib/server/db";

export const DELETE = async (): Promise<Response> => {
	let response: Response = new Response(JSON.stringify("Database read product action could not be performed!"), {
		status: 500,
		statusText: "Database delete all products action could not be performed!"
	});

	let sales = await db.saleEventProduct.findMany()

	if (sales.length > 0) return response

	await db.product
		.deleteMany()
		.then(async (result: BatchPayload) => {
			response = new Response(JSON.stringify(result), {
				status: 200,
				statusText: "All products deleted successfully!"
			});
			await db.productCategory.deleteMany({
				where: {
					Products: {
						none: {}
					}
				}
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
