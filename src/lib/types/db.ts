export type ProductWA = { saleEventProducts: saleEventProductsWA[] } & {
	id: string;
	name: string;
	markup: number;
	staffMarkup: number;
	allSupplies: number;
	supplyPrice: number;
	productCategory: string;
	productCategoryId: string;
};

export type saleEventProductsWA = {
	id: string;
	product: ProductWA;
	productId: string;
	saleEvent: SaleEventWP;
	saleEventId: string;
	amount: number;
};

export type SaleEventWP = {
	id: string;
	to: "n" | "s" | "t";
	timestamp: Date;
	tip: number;
} & {
	saleEventProducts: saleEventProductsWA[];
};

export type ProductCategoryWP = {
	id: string;
	Products: ProductWA[];
	name: string;
};
