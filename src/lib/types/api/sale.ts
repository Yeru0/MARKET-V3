export interface RequestCreateJSONBody {
	products: { id: string; qty: number }[];
	to: "n" | "s" | "t";
}

export interface RequestReadJSONBody {
	id: string;
}

export interface RequestReadNextJSONBody {
	skip: number;
	limit: number;
}
