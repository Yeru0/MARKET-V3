import { db } from "$lib/server/db";
import type { RequestEvent } from "@sveltejs/kit";
import type { RequestCreateJSONBody } from "$lib/types/api/product";
import { validateCreateRequestJSON } from "$lib/server/api/product";
import type { ProductWA } from "$lib/types/db";

export const POST = async ({ request }: RequestEvent): Promise<Response> => {
	let json: RequestCreateJSONBody;
	let response: Response = new Response(JSON.stringify("Database create product action could not be performed!"), {
		status: 500,
		statusText: "Database create product action could not be performed!"
	});
	try {
		json = (await request.json()) as RequestCreateJSONBody;

		if (!validateCreateRequestJSON(json)) {
			response = new Response(
				JSON.stringify(
					"Database create product action could not be performed, because body JSON is not formatted correctly."
				),
				{
					status: 500,
					statusText:
						"Database create product action could not be performed, because body JSON is not formatted correctly."
				}
			);
			return response;
		}

		await db.product
			.create({
				data: {
					name: json.name,
					markup: json.markup,
					staffMarkup: json.staffMarkup,
					allSupplies: json.allSupplies,
					supplyPrice: json.supplyPrice,
					productCategory: {
						connectOrCreate: {
							where: {
								name: json.category
							},
							create: {
								name: json.category
							}
						}
					}
				},
				include: {
					SaleEvents: true
				}
			})
			.then((result: ProductWA) => {
				response = new Response(JSON.stringify(result), {
					status: 201,
					statusText: "Product created successfully!"
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
