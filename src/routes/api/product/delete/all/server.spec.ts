import type { Product } from "$lib/prisma/browser";
import { api } from "$lib/api";
import { createDummyProducts, nuke, readProductDB } from "$lib/server/test";
import { describe, it, expect } from "vitest";

describe("API delete all products", async () => {
	await nuke();
	let products: Product[] = await createDummyProducts();

	it("checks if product DB is empty after dummy creation", async () => {
		let response: Response;

		response = await api("http://localhost:5173/api/product/delete/all", "DELETE", {});

		let DBProducts = await readProductDB();

		await nuke(); //Nuke has to run when there's no more db manipulation

		let productsFromAPI: { count: number } = await response.json();
		expect(products.length).toEqual(productsFromAPI.count);
		expect(DBProducts.length).toEqual(0);
	});
});
