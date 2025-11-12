import { describe, it, expect, beforeAll } from "vitest";
import { ProductDB } from "./db";

describe("Testing front end db interactions", () => {
	let products: ProductDB;

	beforeAll(async () => {
		products = new ProductDB();
		await products.erase();
	});

	it("creates a new product", async () => {
		let product = await products.new({
			name: "Test",
			markup: 85,
			staffMarkup: 25,
			allSupplies: 24,
			supplyPrice: 500
		});

		expect(products).toContain(product);
	});
});
