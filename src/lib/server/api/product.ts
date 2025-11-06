import type { RequestCreateJSONBody, RequestReadJSONBody, RequestUpdateJSONBody } from "$lib/types/api/product";

export const validateCreateRequestJSON = (json: RequestCreateJSONBody) => {
	if (!json.name || typeof json.name !== "string" || json.name === "") {
		return false;
	} else if (!json.markup || typeof json.markup !== "number" || json.markup <= 0) {
		return false;
	} else if (!json.staffMarkup || typeof json.staffMarkup !== "number" || json.staffMarkup < 0) {
		return false;
	} else if (!json.allSupplies || typeof json.allSupplies !== "number" || json.allSupplies <= 0) {
		return false;
	} else if (!json.supplyPrice || typeof json.supplyPrice !== "number" || json.supplyPrice <= 0) {
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

export const validateUpdateRequestJSON = (json: RequestUpdateJSONBody) => {
	if (!json.id || typeof json.id !== "string" || json.id === "") {
		return false;
	} else if (!json.name || typeof json.name !== "string" || json.name === "") {
		return false;
	} else if (!json.markup || typeof json.markup !== "number" || json.markup <= 0) {
		return false;
	} else if (!json.staffMarkup || typeof json.staffMarkup !== "number" || json.staffMarkup < 0) {
		return false;
	} else if (!json.allSupplies || typeof json.allSupplies !== "number" || json.allSupplies <= 0) {
		return false;
	} else if (!json.supplyPrice || typeof json.supplyPrice !== "number" || json.supplyPrice <= 0) {
		return false;
	}

	return true;
};
