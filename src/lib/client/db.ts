import { api } from "$lib/api";
import type { Product } from "$lib/prisma/client";

export class ProductDB {
	products: Product[] = [];

	constructor() {
		api("product/read/all", "POST", {})
			.then(async (result) => {
				this.products = (await result.json()) as Product[];
			})
			.catch((err) => {
				console.error(err);
				throw new Error("UNHANDLED ERROR: Products db could not be read"); // TODO Handle this error
			});
	}

	async delete(): Promise<{ count: number }> {
		let response = api("product/delete/all", "POST", {});

		this.products = await this.read();

		// Wait for response, then wait for json conversion, then return
		return (await (await response).json()) as { count: number };
	}

	async create(obj: {
		name: "Test";
		markup: 85;
		staffMarkup: 25;
		allSupplies: 24;
		supplyPrice: 500;
	}): Promise<Product> {
		let response = api("product/create", "POST", obj);

		this.products = await this.read();

		return (await (await response).json()) as Product;
	}

	async read(id: string = "all"): Promise<Product[]> {
		let response: Promise<Response>;

		switch (id) {
			case "all":
				response = api("product/read/all", "POST", {});
				break;
			default:
				response = api("product/read/one", "POST", { id });
		}

		return (await (await response).json()) as Product[];
	}
}
