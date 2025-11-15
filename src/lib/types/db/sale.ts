import type { ProductWE } from "./product";

export type SaleEventWP = {
	id: string;
	to: string;
	timestamp: Date;
} & {
	Products: ProductWE[];
};
