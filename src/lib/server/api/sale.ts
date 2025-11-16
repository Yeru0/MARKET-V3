import type { RequestReadJSONBody, RequestCreateJSONBody, RequestReadNextJSONBody } from "$lib/types/api/sale";

export const validateCreateRequestJSON = (json: RequestCreateJSONBody) => {
	if (!json.productIDs || typeof json.productIDs !== "object" || json.productIDs.length === 0) {
		return false;
	}

	return true;
};

export const validateReadOneRequestJSON = (json: RequestReadJSONBody) => {
	if (!json.id || typeof json.id !== "string" || json.id === "") {
		return false;
	}

	return true;
};

export const validateReadNextRequestJSON = (json: RequestReadNextJSONBody) => {
	if (typeof json.skip !== "number" || json.skip < 0) {
		return false;
	} else if (!json.limit || typeof json.limit !== "number" || json.limit <= 0) {
		return false;
	}

	return true;
};
