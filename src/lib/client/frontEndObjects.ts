import type { SaleEvent } from "$lib/prisma/browser";
import type { ProductWE } from "$lib/types/db/product";
import { ProductDB } from "./db";

export class ProductC {
	id: string = $state("");
	name: string = $state("");
	markup: number = $state(0);
	staffMarkup: number = $state(0);
	allSupplies: number = $state(0);
	supplyPrice: number = $state(0);

	sales: SaleEvent[] = $state([]);

	constructor(obj: ProductWE) {
		this.id = obj.id;
		this.name = obj.name;
		this.markup = obj.markup;
		this.staffMarkup = obj.staffMarkup;
		this.allSupplies = obj.allSupplies;
		this.supplyPrice = obj.supplyPrice;
		this.sales = obj.SaleEvents;
	}
}

export class ProductsC {
	private products: ProductC[];
	private productsDB: ProductDB;

	constructor(products: ProductC[] = []) {
		this.products = products;
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

		this.products.push(new ProductC(product));
		return new ProductC(product);
	}

	async get(id: string = "all"): Promise<ProductC[]> {
		switch (id) {
			case "all":
				return this.products;
			default:
				let product = (await this.productsDB.read(id))[0]; // TODO replace this with ordered this.products (?
				return [
					new ProductC({
						name: product.name,
						id: product.id,
						markup: product.markup,
						staffMarkup: product.staffMarkup,
						allSupplies: product.allSupplies,
						supplyPrice: product.supplyPrice,
						SaleEvents: product.SaleEvents
					})
				];
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
		this.products = await this.get();
		return new ProductC(product);
	}

	async delete(id: string = "all"): Promise<{ count: number }> {
		switch (id) {
			case "all":
				let product = await this.productsDB.delete(id);
				this.products = await this.get();
				return product;
			default:
				let product = (await this.productsDB.read(id))[0]; // TODO replace this with ordered this.products (?
				return [
					new ProductC({
						name: product.name,
						id: product.id,
						markup: product.markup,
						staffMarkup: product.staffMarkup,
						allSupplies: product.allSupplies,
						supplyPrice: product.supplyPrice,
						SaleEvents: product.SaleEvents
					})
				];
		}
	}
}
