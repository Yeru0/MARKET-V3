import type { Product } from "$lib/prisma/client";
import { db } from "$lib/server/db";
import type { RequestEvent } from "@sveltejs/kit";
import type { RequestCreateJSONBody } from "$lib/types/api/product";
import { validateCreateRequestJSON } from "$lib/server/api/product";

export const POST = async ({ request }: RequestEvent): Promise<Response> => {
    const json: RequestCreateJSONBody = (await request.json()) as RequestCreateJSONBody;

    let response: Response = new Response(JSON.stringify("Database create product action could not be performed!"), {
        status: 500,
        statusText: "Database create product action could not be performed!"
    });

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
                supplyPrice: json.supplyPrice
            }
        })
        .then((result: Product) => {
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

    return response;
};
