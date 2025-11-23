import type { RequestRegisterJSONBody } from "$lib/types/api/category";

export const validateRegisterRequestJSON = (json: RequestRegisterJSONBody) => {
	if (typeof json.productIDs !== "object" || json.productIDs.length === 0) {
		return false;
	} else if (!json.name || typeof json.name !== "string" || json.name.length === 0) {
		return false;
	}

	return true;
};
