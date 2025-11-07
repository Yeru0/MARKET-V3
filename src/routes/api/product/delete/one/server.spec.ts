import type { Product } from "$lib/prisma/browser";
import { api } from "$lib/api";
import { createDummyProducts, nuke, readProductDB } from "$lib/server/test";
import { describe, it, expect } from "vitest";

describe("API delete one product", async () => {
	await nuke();
	let amt: number = 50;
	let products: Product[] = await createDummyProducts(amt);

	it("checks if one product is deleted", async () => {
		let product: Product = products[0];
		let response: Response;

		response = await api("http://localhost:5173/api/product/delete/one", "DELETE", { id: product.id });
		let productsFromAPI: Product = (await response.json()) as Product;
		let productDB = await readProductDB();

		await nuke(); //Nuke has to run when there's no more db manipulation

		expect(productDB).not.toContain(product);
		expect(productDB).not.toContain(productsFromAPI);
		expect(product.id).toEqual(productsFromAPI.id);
		expect(productDB.length).toEqual(amt - 1);
	});
});
