import type { ProductWE } from "./product";

export type SaleEventWP = {
	id: string;
	to: "n" | "s" | "t";
	timestamp: Date;
} & {
	Products: ProductWE[];
};
