import { describe, it, expect, beforeEach } from "vitest";
import { CategoryDB, ProductDB, SaleDB } from "./db";
import type { Product, SaleEvent, ProductCategory } from "$lib/prisma/client";
import { db } from "$lib/server/db";
import {
	createDummyProducts,
	createDummySales,
	eraseSaleDB,
	nuke,
	readCategoryDB,
	readProductDB,
	readSaleDB
} from "$lib/server/api/test";
import type { ProductCategoryWP } from "$lib/types/db";

describe.sequential("Testing front end db interactions", async () => {
	await nuke();

	// Default values
	let amt: number;
	let productsDB: ProductDB;
	let salesDB: SaleDB;
	let categoriesDB: CategoryDB;

	// Responses read from the function that is being tested
	let productsFromBackEnd: Product[];
	let productFromBackEnd: Product;
	let salesFromBackEnd: SaleEvent[];
	let saleFromBackEnd: SaleEvent;
	let categoriesFromBackEnd: ProductCategoryWP[];

	// The actual values in the DB
	let products: Product[];
	let product: Product;
	let sales: SaleEvent[];
	let sale: SaleEvent;
	let categories: ProductCategory[];

	// Dummy values
	let dummyProducts: Product[];
	let dummyProduct: Product;
	let dummySales: SaleEvent[];
	let dummySale: SaleEvent;

	beforeEach(async () => {
		await nuke();

		amt = 50;
		productsDB = new ProductDB();
		salesDB = new SaleDB();
		categoriesDB = new CategoryDB();

		// Creating some dummy values
		dummyProducts = await createDummyProducts(amt);
		dummySales = await createDummySales(
			(await productsDB.read()).map((item) => ({
				id: item.id,
				qty: 5
			})),
			amt
		);
		dummyProduct = dummyProducts[0];
		dummySale = dummySales[0];
	});

	// ==== Products ====

	it("checks if a new product is created", async () => {
		await nuke();
		let productFromBackEnd = await productsDB.create({
			name: "Test",
			markup: 85,
			staffMarkup: 25,
			allSupplies: 24,
			supplyPrice: 500,
			category: "test"
		});

		products = await readProductDB();

		expect(products.length).toEqual(1);
		expect(products[0].id).toEqual(productFromBackEnd.id);
	});

	it("checks if a single product is read", async () => {
		productsFromBackEnd = await productsDB.read(dummyProduct.id);
		product = (await db.product.findMany({ where: { id: dummyProduct.id } }))[0];

		productFromBackEnd = productsFromBackEnd[0];

		expect(productFromBackEnd.id).toEqual(product.id);
	});

	it("checks if all products are read", async () => {
		productsFromBackEnd = await productsDB.read();
		products = await readProductDB();

		expect(productsFromBackEnd.map((item) => item.id)).toEqual(products.map((item) => item.id));
	});

	it("check if the next products are read", async () => {
		productsFromBackEnd = await productsDB.read("next", { skip: 0, limit: 25 });
		products = await readProductDB();

		expect(productsFromBackEnd.length).toEqual(25);
		expect(productsFromBackEnd.map((item) => item.id)).toEqual(products.slice(0, 25).map((item) => item.id));

		productsFromBackEnd = await productsDB.read("next", { skip: 25, limit: 25 });

		expect(productsFromBackEnd.length).toEqual(25);
		expect(productsFromBackEnd.map((item) => item.id)).toEqual(products.slice(25, 50).map((item) => item.id));
	});

	it("checks if name property of a single product updates from 'test' to 'test1' then back to 'test'", async () => {
		product = (await db.product.findMany({ where: { id: dummyProduct.id } }))[0];
		expect(product.name).toEqual("test");

		await productsDB.update(dummyProduct.id, {
			name: "test1",
			markup: dummyProduct.markup,
			staffMarkup: dummyProduct.staffMarkup,
			allSupplies: dummyProduct.allSupplies,
			supplyPrice: dummyProduct.supplyPrice,
			category: "test"
		});

		product = (await db.product.findMany({ where: { id: dummyProduct.id } }))[0];
		expect(product.name).toEqual("test1");

		await productsDB.update(dummyProduct.id, {
			name: "test",
			markup: dummyProduct.markup,
			staffMarkup: dummyProduct.staffMarkup,
			allSupplies: dummyProduct.allSupplies,
			supplyPrice: dummyProduct.supplyPrice,
			category: "test"
		});

		product = (await db.product.findMany({ where: { id: dummyProduct.id } }))[0];
		expect(product.name).toEqual("test");
	});

	it("checks if DB is cleared", async () => {
		await productsDB.delete();

		products = await db.product.findMany();

		expect(products.length).toEqual(0);
	});

	it("checks if one product is deleted", async () => {
		await productsDB.delete(dummyProduct.id);

		products = await db.product.findMany();

		expect(products.length).toEqual(amt - 1);
		expect(products.map((item) => item.id)).not.toContain(dummyProduct.id);
	});

	// ==== Sales ====

	it("checks if a new sale is registered", async () => {
		eraseSaleDB();

		await eraseSaleDB();
		let saleFromBackEnd = await salesDB.register({
			products: dummyProducts.map((item) => ({ id: `${item.id}`, qty: 5 })),
			to: "t",
			tip: 0
		});

		sales = await readSaleDB();

		expect(sales[0].id).toEqual(saleFromBackEnd.id);
	});

	it("checks if a single sale is read", async () => {
		salesFromBackEnd = await salesDB.read(dummySale.id);
		sale = (await db.saleEvent.findMany({ where: { id: dummySale.id } }))[0];

		saleFromBackEnd = salesFromBackEnd[0];

		expect(saleFromBackEnd.id).toEqual(sale.id);
	});

	it("checks if all sales are read", async () => {
		salesFromBackEnd = await salesDB.read();
		sales = await readSaleDB();

		expect(salesFromBackEnd.map((item) => item.id)).toEqual(sales.map((item) => item.id));
	});

	it("check if the next sales are read", async () => {
		salesFromBackEnd = await salesDB.read("next", { skip: 0, limit: 25 });
		sales = await readSaleDB();

		expect(salesFromBackEnd.length).toEqual(25);
		expect(salesFromBackEnd.map((item) => item.id)).toEqual(sales.slice(0, 25).map((item) => item.id));

		salesFromBackEnd = await salesDB.read("next", { skip: 25, limit: 25 });

		expect(salesFromBackEnd.length).toEqual(25);
		expect(salesFromBackEnd.map((item) => item.id)).toEqual(sales.slice(25, 50).map((item) => item.id));
	});

	// ==== Categories ====

	it("check if all the categories are read", async () => {
		categoriesFromBackEnd = await categoriesDB.read();
		categories = await readCategoryDB();

		expect(categoriesFromBackEnd.map((item) => item.id)).toEqual(categories.map((item) => item.id));
	});
});
