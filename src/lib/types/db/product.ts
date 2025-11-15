import type { SaleEventWP } from "./sale";

export type ProductWE = { SaleEvents: SaleEventWP[] } & {
	id: string;
	name: string;
	markup: number;
	staffMarkup: number;
	allSupplies: number;
	supplyPrice: number;
};
