export type ProductWA = { SaleEvents: SaleEventWP[] } & {
	id: string;
	name: string;
	markup: number;
	staffMarkup: number;
	allSupplies: number;
	supplyPrice: number;
	productCategory: ProductCategoryWP;
	productCategoryId: string;
};

export type SaleEventWP = {
	id: string;
	to: "n" | "s" | "t";
	timestamp: Date;
} & {
	Products: ProductWA[];
};

export type ProductCategoryWP = {
	id: string;
	Products: ProductWA[];
	name: string;
};
