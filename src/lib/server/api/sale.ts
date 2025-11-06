import type { RequestCreateJSONBody } from "$lib/types/api/sale";

export const validateCreateRequestJSON = (json: RequestCreateJSONBody) => {
    if (!json.products || typeof json.products !== "object" || json.products.length === 0) {
        return false;
    }

    return true;
};