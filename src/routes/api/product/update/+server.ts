import type { Product } from "$lib/prisma/client";
import { db } from "$lib/server/db";
import type { RequestEvent } from "@sveltejs/kit";
import type { RequestUpdateJSONBody } from "$lib/types/api/product";
import { validateUpdateRequestJSON } from "$lib/server/api/product";

export const PUT = async ({ request }: RequestEvent): Promise<Response> => {
	let json: RequestUpdateJSONBody;

	let response: Response = new Response(JSON.stringify("Database update product action could not be performed!"), {
		status: 500,
		statusText: "Database update product action could not be performed!"
	});

	try {
		json = (await request.json()) as RequestUpdateJSONBody;
		if (!validateUpdateRequestJSON(json)) {
			response = new Response(
				JSON.stringify(
					"Database update product action could not be performed, because body JSON is not formatted correctly."
				),
				{
					status: 500,
					statusText:
						"Database update product action could not be performed, because body JSON is not formatted correctly."
				}
			);
			return response;
		}

		await db.product
			.update({
				where: {
					id: json.id
				},
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
					saleEventProducts: {
						include: {
							saleEvent: true
						}
					},
					productCategory: true
				}
			})
			.then(async (result: Product) => {
				response = new Response(JSON.stringify(result), {
					status: 201,
					statusText: "Product updated successfully!"
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
	} catch (error) {
		console.error(error);
	}

	return response;
};
