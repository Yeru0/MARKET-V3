import type { RequestReadJSONBody,RequestCreateJSONBody } from "$lib/types/api/sale";

export const validateCreateRequestJSON = (json: RequestCreateJSONBody) => {
    if (!json.productIDs || typeof json.productIDs !== "object" || json.productIDs.length === 0) {
        return false;
    }

    return true;
};

export const validateReadRequestJSON = (json: RequestReadJSONBody) => {
    if (!json.id || typeof json.id !== "string" || json.id === "") {
        return false;
    }

    return true;
};