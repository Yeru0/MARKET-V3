import type { Product } from "$lib/prisma/browser";

export interface RequestCreateJSONBody {
	productIDs: string[];
	to: "n" | "s" | "t"
}

export interface RequestReadJSONBody {
	id: string;
}
