import { db } from "$lib/server/db";
import type { RequestEvent } from "@sveltejs/kit";
import type { RequestCreateJSONBody } from "$lib/types/api/sale";
import { validateCreateRequestJSON } from "$lib/server/api/sale";
import type { SaleEvent } from "$lib/prisma/client";

export const POST = async ({ request }: RequestEvent): Promise<Response> => {
    let json: RequestCreateJSONBody
    let response: Response = new Response(JSON.stringify("Database register sale action could not be performed!"), {
        status: 500,
        statusText: "Database register sale action could not be performed!"
    });
    
    try {
    json = (await request.json()) as RequestCreateJSONBody;

    if (!validateCreateRequestJSON(json)) {
        response = new Response(
            JSON.stringify(
                "Database register sale action could not be performed, because body JSON is not formatted correctly."
            ),
            {
                status: 500,
                statusText:
                    "Database register sale action could not be performed, because body JSON is not formatted correctly."
            }
        );
        return response;
    }

    // Reformatting the input array from string[] to {id: string}[] for simplicity of input
    let connectableIDs: {id: string}[] = []

     for (let id of json.productIDs) {
        connectableIDs.push({id})
     }     

    await db.saleEvent
        .create({
            data: {
                products: {
                    connect: connectableIDs
                }
            },
            include: {
                products: true
            }
        })
        .then((result: SaleEvent) => {
            response = new Response(JSON.stringify(result), {
                status: 201,
                statusText: "Sale registered successfully!"
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
        console.error(error)
    }

    return response;
};
