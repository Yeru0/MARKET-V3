import { api } from "$lib/api";
import type { Product } from "$lib/prisma/client";
import type { ProductWA } from "$lib/types/db";
import type { SaleEventWP } from "$lib/types/db";

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
		category: string;
	}): Promise<ProductWA> {
		let response = await api("product/create", "POST", obj);

		this.products = await this.read();

		return (await response.json()) as ProductWA;
	}

	async read(id: string = "all", obj: { skip: number; limit: number } = { skip: 0, limit: 0 }): Promise<ProductWA[]> {
		let response: Response;

		switch (id) {
			case "all":
				response = await api("product/read/all", "POST", {});
				return (await response.json()) as ProductWA[];
			case "next":
				response = await api("product/read/next", "POST", obj);
				return (await response.json()) as ProductWA[];
			default:
				response = await api("product/read/one", "POST", { id });
				return [await response.json()] as ProductWA[];
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
			category: string;
		}
	): Promise<ProductWA> {
		let response = await api("product/update", "PUT", { id, ...obj });
		return (await response.json()) as ProductWA;
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

	async read(
		id: string = "all",
		obj: { skip: number; limit: number } = { skip: 0, limit: 0 }
	): Promise<SaleEventWP[]> {
		let response: Response;

		switch (id) {
			case "all":
				response = await api("sale/read/all", "POST", {});
				return (await response.json()) as SaleEventWP[];
			case "next":
				response = await api("sale/read/next", "POST", obj);
				return (await response.json()) as SaleEventWP[];
			default:
				response = await api("sale/read/one", "POST", { id });
				return [await response.json()] as SaleEventWP[];
		}
	}
}
