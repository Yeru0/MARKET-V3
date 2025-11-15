import { api } from "$lib/api";
import type { Product, SaleEvent } from "$lib/prisma/client";
import type { ProductWE } from "$lib/types/db/product";
import type { SaleEventWP } from "$lib/types/db/sale";

export class ProductDB {
	products: Product[] = [];

	constructor() {
		api("product/read/all", "POST", {})
			.then(async (result) => {
				this.products = (await result.json()) as Product[];
			})
			.catch((err) => {
				console.error(err);
				throw new Error("UNHANDLED ERROR: Products db could not be read", err); // TODO Handle this error
			});
	}

	async delete(id: string = "all"): Promise<{ count: number }> {
		let response: Response;

		switch (id) {
			case "all":
				response = await api("product/delete/all", "DELETE", {});
				this.products = await this.read();
				return (await response.json()) as { count: number };
			default:
				response = await api("product/delete/one", "DELETE", { id });
				this.products = await this.read();
				return (await response.json()) as { count: number };
		}
	}

	async create(obj: {
		name: string;
		markup: number;
		staffMarkup: number;
		allSupplies: number;
		supplyPrice: number;
	}): Promise<ProductWE> {
		let response = await api("product/create", "POST", obj);

		this.products = await this.read();

		return (await response.json()) as ProductWE;
	}

	async read(id: string = "all"): Promise<ProductWE[]> {
		let response: Response;

		switch (id) {
			case "all":
				response = await api("product/read/all", "POST", {});
				return (await response.json()) as ProductWE[];
			default:
				response = await api("product/read/one", "POST", { id });
				return [await response.json()] as ProductWE[];
		}
	}

	async update(
		id: string,
		obj: {
			name: string;
			markup: number;
			staffMarkup: number;
			allSupplies: number;
			supplyPrice: number;
		}
	): Promise<ProductWE> {
		let response = await api("product/update", "PUT", { id, ...obj });
		return (await response.json()) as ProductWE;
	}
}
export class SaleDB {
	sales: SaleEventWP[] = [];

	constructor() {
		api("sale/read/all", "POST", {})
			.then(async (result) => {
				this.sales = (await result.json()) as SaleEventWP[];
			})
			.catch((err) => {
				console.error(err);
				throw new Error("UNHANDLED ERROR: Sales db could not be read", err); // TODO Handle this error
			});
	}

	async register(IDs: { productIDs: string[]; to: "n" | "s" | "t" }): Promise<SaleEventWP> {
		let response = await api("sale/register", "POST", IDs);

		this.sales = await this.read();

		return (await response.json()) as SaleEventWP;
	}

	async read(id: string = "all"): Promise<SaleEventWP[]> {
		let response: Response;

		switch (id) {
			case "all":
				response = await api("sale/read/all", "POST", {});
				return (await response.json()) as SaleEventWP[];
			default:
				response = await api("sale/read/one", "POST", { id });
				return [await response.json()] as SaleEventWP[];
		}
	}
}
