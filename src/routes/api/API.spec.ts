import { api } from "$lib/api";
import type { Product, ProductCategory, SaleEvent } from "$lib/prisma/client";
import {
	createDummyProducts,
	createDummySales,
	eraseSaleDB,
	nuke,
	readCategoryDB,
	readProductDB,
	readSaleDB
} from "$lib/server/api/test";
import { afterAll, beforeEach, describe, expect, it } from "vitest";

describe.sequential("API CRUD operations", async () => {
	await nuke();
	let amt: number;
	let products: Product[];
	let sales: SaleEvent[];
	let sale: SaleEvent;
	let salesFromAPI: SaleEvent[];
	let saleFromAPI: SaleEvent;
	let response: Response;
	let product: Product;
	let productsFromAPI: Product[];
	let productFromAPI: Product;
	let categoriesFromAPI: ProductCategory[];
	let categories: ProductCategory[];

	beforeEach(async () => {
		await nuke();
		amt = 50;
		products = await createDummyProducts(amt);
		sales = await createDummySales(
			products.map((item) => ({
				id: item.id
			})),
			amt
		);
		sale = sales[0];
		product = products[0];
		categories = await readCategoryDB();
	});

	// sale/read/all
	it("check if all sales are read", async () => {
		response = await api("sale/read/all", "POST", {});
		salesFromAPI = (await response.json()) as SaleEvent[];

		expect(sales.map((item) => item.id)).toEqual(salesFromAPI.map((item) => item.id));
	});

	// sale/read/one
	it("check if one sale is read", async () => {
		response = await api("sale/read/one", "POST", { id: sale.id });
		saleFromAPI = (await response.json()) as SaleEvent;

		expect(sale.id).toEqual(saleFromAPI.id);
	});

	// sale/read/next
	it("check if the next sales are read", async () => {
		response = await api("sale/read/next", "POST", { skip: 0, limit: 25 });
		salesFromAPI = (await response.json()) as SaleEvent[];

		expect(salesFromAPI.length).toEqual(25);
		expect(salesFromAPI.map((item) => item.id)).toEqual(sales.slice(0, 25).map((item) => item.id));

		response = await api("sale/read/next", "POST", { skip: 25, limit: 25 });
		salesFromAPI = (await response.json()) as SaleEvent[];

		expect(salesFromAPI.length).toEqual(25);
		expect(salesFromAPI.map((item) => item.id)).toEqual(sales.slice(25, 50).map((item) => item.id));
	});

	// sale/register
	it("check if sale is registered", async () => {
		await eraseSaleDB();

		response = await api("sale/register", "POST", { productIDs: products.map((item) => `${item.id}`), to: "n" });
		saleFromAPI = (await response.json()) as SaleEvent;

		let salesDB: SaleEvent[] = await readSaleDB();

		expect(salesDB.length).toEqual(1);
	});

	// product/create
	it("check if one product is created", async () => {
		await nuke();

		response = await api("product/create", "POST", {
			name: "Test",
			markup: 25,
			staffMarkup: 85,
			allSupplies: 24,
			supplyPrice: 500,
			category: "test"
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
		expect(product.id).toEqual(productFromAPI.id);
	});

	// product/read/next
	it("check if the next products are read", async () => {
		response = await api("product/read/next", "POST", { skip: 0, limit: 25 });
		productsFromAPI = (await response.json()) as Product[];

		expect(productsFromAPI.length).toEqual(25);
		expect(productsFromAPI.map((item) => item.id)).toEqual(products.slice(0, 25).map((item) => item.id));

		response = await api("product/read/next", "POST", { skip: 25, limit: 25 });
		productsFromAPI = (await response.json()) as Product[];

		expect(productsFromAPI.length).toEqual(25);
		expect(productsFromAPI.map((item) => item.id)).toEqual(products.slice(25, 50).map((item) => item.id));
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
			supplyPrice: product.supplyPrice,
			category: "test"
		});
		product = (await response.json()) as Product;
		expect(product.name).toEqual("test1");

		response = await api("product/update", "PUT", {
			id: product.id,
			name: "test",
			markup: product.markup,
			staffMarkup: product.staffMarkup,
			allSupplies: product.allSupplies,
			supplyPrice: product.supplyPrice,
			category: "test"
		});

		product = (await response.json()) as Product;
		expect(product.name).toEqual("test");
	});

	// product/delete/all
	it("checks if all products are deleted", async () => {
		response = await api("product/delete/all", "DELETE", {});

		let deleteResponse: { count: number } = (await response.json()) as { count: number };
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

	// category/read/all
	it("checks if all categories can be read", async () => {
		response = await api("category/read/all", "POST", {});
		categoriesFromAPI = (await response.json()) as Product[];

		expect(categories.length).toEqual(categoriesFromAPI.length);
	});

	afterAll(async () => {
		await nuke();
	});
});
