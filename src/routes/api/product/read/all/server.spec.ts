import type { Product } from "$lib/prisma/browser";
import { api } from "$lib/api";
import { createDummyProducts, nuke } from "$lib/server/test";
import { describe, it, expect } from "vitest";

describe("API read all products", async () => {
	await nuke();
	let products: Product[] = await createDummyProducts();

	it("checks if the same number of products can be read as are created", async () => {
		let response: Response;

		response = await api("http://localhost:5173/api/product/read/all", "POST", {});

		await nuke(); //Nuke has to run when there's no more db manipulation

		let productsFromAPI = (await response.json()) as Product[];
		expect(products.length).toEqual(productsFromAPI.length);
	});
});
