import { api } from "$lib/api";
import type { Product } from "$lib/prisma/client";

export class ProductDB {
	async erase(): Promise<{ count: number }> {
		let response = api("product/delete/all", "POST", {});

		// Wait for response, then wait for json conversion, then return
		return (await (await response).json()) as { count: number };
	}

	async new(obj: { name: "Test"; markup: 85; staffMarkup: 25; allSupplies: 24; supplyPrice: 500 }): Promise<Product> {
		let response = api("product/create", "POST", obj);

		return (await (await response).json()) as Product;
	}
}
