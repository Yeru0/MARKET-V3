import type { SaleEvent } from "$lib/prisma/client";
import { db } from "$lib/server/db";
import type { RequestEvent } from "@sveltejs/kit";
import type { RequestReadJSONBody } from "$lib/types/api/sale";
import { validateReadRequestJSON } from "$lib/server/api/sale";

export const POST = async ({ request }: RequestEvent): Promise<Response> => {	
	let json: RequestReadJSONBody
	let response: Response = new Response(
		JSON.stringify("Database read single sale event action could not be performed!"),
		{
			status: 500,
			statusText: "Database read single sale event action could not be performed!"
		}
	);	
	try {
	json = (await request.json()) as RequestReadJSONBody;

	if (!validateReadRequestJSON(json)) {
		response = new Response(
			JSON.stringify(
				"Database read single sale event action could not be performed, because body JSON is not formatted correctly."
			),
			{
				status: 500,
				statusText:
					"Database read single sale event action could not be performed, because body JSON is not formatted correctly."
			}
		);
		return response;
	}

	await db.saleEvent
		.findFirst({
			where: {
				id: json.id
			},
			include: {
				products: true
			}
		})
		.then((result: SaleEvent | null) => {
			if (!result) {
				response = new Response(JSON.stringify("No sale event found with the specified ID"), {
					status: 200,
					statusText: "No sale event found with the specified ID"
				});
			}
			response = new Response(JSON.stringify(result), {
				status: 200,
				statusText: "Sale event returned successfully!"
			});
		})
		.catch((err: Error) => {
			console.error(err);
			response = new Response(JSON.stringify(err.message), {
				status: 500,
				statusText: err.message
			});
		});

		
	} catch (error) {
		console.error(error);
	}
	return response;
};
