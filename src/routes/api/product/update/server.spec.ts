import { api } from "$lib/api";
import type { Product } from "$lib/prisma/browser";
import { createDummyProducts, nuke } from "$lib/server/test";
import { describe, it, expect } from "vitest";

describe("API update product", async () => {
	let products: Product[] = await createDummyProducts(1);

	it("update name property from 'test' to 'test1' then back to 'test'", async () => {
		let product = products[0];
		let response: Response;
		expect(product.name).toEqual("test");

		response = await api("http://localhost:5173/api/product/update", "PUT", {
			id: product.id,
			name: "test1",
			markup: product.markup,
			staffMarkup: product.staffMarkup,
			allSupplies: product.allSupplies,
			supplyPrice: product.supplyPrice
		});
		product = (await response.json()) as Product;
		expect(product.name).toEqual("test1");

		response = await api("http://localhost:5173/api/product/update", "PUT", {
			id: product.id,
			name: "test",
			markup: product.markup,
			staffMarkup: product.staffMarkup,
			allSupplies: product.allSupplies,
			supplyPrice: product.supplyPrice
		});

		await nuke(); //Nuke has to run when there's no more db manipulation

		product = (await response.json()) as Product;
		expect(product.name).toEqual("test");
	});
});
