export interface RequestCreateJSONBody {
	name: string;
	markup: number;
	staffMarkup: number;
	allSupplies: number;
	supplyPrice: number;
}

export interface RequestReadJSONBody {
	id: string;
}

export interface RequestUpdateJSONBody {
	id: string;
	name: string;
	markup: number;
	staffMarkup: number;
	allSupplies: number;
	supplyPrice: number;
}
