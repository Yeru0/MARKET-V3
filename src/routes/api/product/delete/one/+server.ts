import type { Product } from "$lib/prisma/client";
import { db } from "$lib/server/db";
import type { RequestEvent } from "@sveltejs/kit";
import type { RequestReadJSONBody } from "$lib/types/api";
import { validateReadRequestJSON } from "$lib/server/api";

export const DELETE = async ({ request }: RequestEvent): Promise<Response> => {
	const json: RequestReadJSONBody = (await request.json()) as RequestReadJSONBody;

	let response: Response = new Response(
		JSON.stringify("Database deleted single product action could not be performed!"),
		{
			status: 500,
			statusText: "Database deleted single product action could not be performed!"
		}
	);

	if (!validateReadRequestJSON(json)) {
		response = new Response(
			JSON.stringify(
				"Database delete single product action could not be performed, because body JSON is not formatted correctly."
			),
			{
				status: 500,
				statusText:
					"Database delete single product action could not be performed, because body JSON is not formatted correctly."
			}
		);
		return response;
	}

	await db.product
		.delete({
			where: {
				id: json.id
			}
		})
		.then((result: Product | null) => {
			if (!result) {
				response = new Response(JSON.stringify("No product found with the specified ID"), {
					status: 200,
					statusText: "No product found with the specified ID"
				});
			}
			response = new Response(JSON.stringify(result), {
				status: 200,
				statusText: "Product deleted successfully!"
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
