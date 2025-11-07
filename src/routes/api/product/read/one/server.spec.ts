import type { Product } from "$lib/prisma/browser";
import { api } from "$lib/api";
import { createDummyProducts, nuke } from "$lib/server/test";
import { describe, it, expect } from "vitest";

describe("API read one product", async () => {
	let products: Product[] = await createDummyProducts();

	it("read a product", async () => {
		let product = products[0];
		let response: Response;

		response = await api("http://localhost:5173/api/product/read/one", "POST", { id: product.id });

		await nuke(); //Nuke has to run when there's no more db manipulation

		let productFromAPI = (await response.json()) as Product;
		expect(product).toEqual(productFromAPI);
	});
});
