import type { SaleEvent } from "$lib/prisma/browser";

export type ProductWE = { SaleEvents: { id: string; to: string; timestamp: Date }[] } & {
	id: string;
	name: string;
	markup: number;
	staffMarkup: number;
	allSupplies: number;
	supplyPrice: number;
};
