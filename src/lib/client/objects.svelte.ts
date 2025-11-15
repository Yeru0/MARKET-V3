import type { SaleEvent } from "$lib/prisma/browser";
import type { ProductWE } from "$lib/types/db/product";
import type { SaleEventWP } from "$lib/types/db/sale";
import { ProductDB, SaleDB } from "./db";

export class ProductC {
	private salesDB = new SaleDB();

	id: string = $state("");
	name: string = $state("");
	markup: number = $state(0);
	staffMarkup: number = $state(0);
	allSupplies: number = $state(0);
	supplyPrice: number = $state(0);

	sales: SaleEventWP[] = $state([]);

	constructor(obj: ProductWE) {
		this.id = obj.id;
		this.name = obj.name;
		this.markup = obj.markup;
		this.staffMarkup = obj.staffMarkup;
		this.allSupplies = obj.allSupplies;
		this.supplyPrice = obj.supplyPrice;
		this.sales = obj.SaleEvents;
	}

	async sell() {
		this.sales = await this.salesDB.read();
	}
}

export class SaleC {
	id: string = $state("");
	to: string = $state("");
	timestamp: Date = $state(new Date());
	Products: ProductWE[] = $state([]);

	constructor(obj: SaleEventWP) {
		this.id = obj.id;
		this.to = obj.to;
		this.timestamp = obj.timestamp;
		this.Products = obj.Products;
	}
}

export class ProductsC {
	private productsDB: ProductDB;
	private salesDB = new SaleDB();

	constructor() {
		this.productsDB = new ProductDB();
	}

	async new(obj: {
		name: string;
		markup: number;
		staffMarkup: number;
		allSupplies: number;
		supplyPrice: number;
	}): Promise<ProductC> {
		let product = await this.productsDB.create(obj);
		return new ProductC(product);
	}

	async get(id: string = "all"): Promise<ProductC[]> {
		switch (id) {
			case "all":
				let products = await this.productsDB.read();
				let returnProducts = [];

				for (let p of products) {
					returnProducts.push(new ProductC({ ...p }));
				}
				return returnProducts;
			default:
				let product = (await this.productsDB.read(id))[0];

				return [new ProductC({ ...product })];
		}
	}

	async update(
		id: string,
		obj: {
			name: string;
			markup: number;
			staffMarkup: number;
			allSupplies: number;
			supplyPrice: number;
		}
	): Promise<ProductC> {
		let product = await this.productsDB.update(id, obj);
		return new ProductC(product);
	}

	async delete(id: string = "all"): Promise<{ count: number }> {
		let returnValue: { count: number };
		switch (id) {
			case "all":
				returnValue = await this.productsDB.delete();
				return returnValue;
			default:
				returnValue = await this.productsDB.delete(id);
				return returnValue;
		}
	}

	async sell(products: ProductC[], to: "n" | "s" | "t"): Promise<SaleC> {
		let sales = await this.salesDB.register({
			productIDs: products.map((item) => item.id),
			to
		});

		for (let p of products) {
			p.sell();
		}

		return new SaleC({
			...sales
		});
	}

	async getSales(id: string = "all"): Promise<SaleC[]> {
		let sales: SaleEventWP[];
		let returnValue: SaleC[] = [];
		switch (id) {
			case "all":
				sales = await this.salesDB.read();
				for (let s of sales) {
					returnValue.push(new SaleC({ ...s }));
				}
				return returnValue;
			default:
				sales = await this.salesDB.read(id);
				return [new SaleC({ ...sales[0] })];
		}
	}
}
