import type { Product } from "$lib/prisma/browser";
import { api } from "$lib/api";
import { createDummyProducts, nuke, readProductDB } from "$lib/server/api/test";
import { describe, it, expect, beforeEach, afterAll } from "vitest";

describe.sequential("Product API CRUD operations", async () => {
	await nuke();
	let amt: number;
	let products: Product[];
	let product: Product;
	let productsFromAPI: Product[];
	let productFromAPI: Product;
	let response: Response;

	beforeEach(async () => {
		await nuke();
		amt = 50;
		products = await createDummyProducts(amt);
		product = products[0];
	});

	// product/create
	it("check if one product is created", async () => {
		await nuke();

		response = await api("product/create", "POST", {
			name: "Test",
			markup: 25,
			staffMarkup: 85,
			allSupplies: 24,
			supplyPrice: 500
		});

		product = (await readProductDB())[0];
		productFromAPI = (await response.json()) as Product;
		expect(product.id).toEqual(productFromAPI.id);
	});

	// product/read/all
	it("checks if all products are read", async () => {
		response = await api("product/read/all", "POST", {});

		productsFromAPI = (await response.json()) as Product[];
		expect(products.length).toEqual(productsFromAPI.length);
	});

	// product/read/one
	it("checks if one product is read", async () => {
		response = await api("product/read/one", "POST", { id: product.id });

		productFromAPI = (await response.json()) as Product;
		expect(product).toEqual(productFromAPI);
	});

	// product/update
	it("checks if name property of a single product updates from 'test' to 'test1' then back to 'test'", async () => {
		expect(product.name).toEqual("test");

		response = await api("product/update", "PUT", {
			id: product.id,
			name: "test1",
			markup: product.markup,
			staffMarkup: product.staffMarkup,
			allSupplies: product.allSupplies,
			supplyPrice: product.supplyPrice
		});
		product = (await response.json()) as Product;
		expect(product.name).toEqual("test1");

		response = await api("product/update", "PUT", {
			id: product.id,
			name: "test",
			markup: product.markup,
			staffMarkup: product.staffMarkup,
			allSupplies: product.allSupplies,
			supplyPrice: product.supplyPrice
		});

		product = (await response.json()) as Product;
		expect(product.name).toEqual("test");
	});

	// product/delete/all
	it("checks if all products are deleted", async () => {
		response = await api("product/delete/all", "DELETE", {});

		let deleteResponse: { count: number } = await response.json();
		let DBProducts = await readProductDB();

		expect(products.length).toEqual(deleteResponse.count);
		expect(DBProducts.length).toEqual(0);
	});

	// product/delete/one
	it("checks if one product is deleted", async () => {
		response = await api("product/delete/one", "DELETE", { id: product.id });
		productFromAPI = (await response.json()) as Product;
		let productDB = await readProductDB();

		expect(productDB).not.toContain(product);
		expect(productDB).not.toContain(productFromAPI);
		expect(product.id).toEqual(productFromAPI.id);
		expect(productDB.length).toEqual(amt - 1);
	});

	afterAll(async () => {
		await nuke();
	});
});
