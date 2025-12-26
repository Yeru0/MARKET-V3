import type { ProductCategoryWP, ProductWA } from "$lib/types/db";
import type { SaleEventWP } from "$lib/types/db";
import { CategoryDB, ProductDB, SaleDB } from "./db";

export class ProductC {
	private salesDB = new SaleDB();

	id: string = $state("");
	name: string = $state("");
	markup: number = $state(0);
	staffMarkup: number = $state(0);
	allSupplies: number = $state(0);
	supplyPrice: number = $state(0);

	sales: SaleEventWP[] = $state([]);

	updatePopup: boolean = $state(false);
	deletePopup: boolean = $state(false);

	markupPriceSingle: number = $state(0);
	staffMarkupPriceSingle: number = $state(0);
	markupPriceMultiple: number = $state(0);
	staffMarkupPriceMultiple: number = $state(0);
	staffProfitSingle: number = $state(0);
	profitSingle: number = $state(0);
	staffProfitMultiple: number = $state(0);
	profitMultiple: number = $state(0);

	suppliesPrice: number = $state(0);
	soldToStaff: number = $state(0);
	soldToCustomers: number = $state(0);
	takenOut: number = $state(0);
	inStorage: number = $state(0);

	constructor(obj: ProductWA) {
		this.id = obj.id;
		this.name = obj.name;
		this.markup = obj.markup;
		this.staffMarkup = obj.staffMarkup;
		this.allSupplies = obj.allSupplies;
		this.supplyPrice = obj.supplyPrice;
		this.sales = obj.SaleEvents;

		this.calculateDerivedProperties();
	}

	async sell() {
		this.sales = await this.salesDB.read();
	}

	calculateDerivedProperties() {
		this.suppliesPrice = this.supplyPrice * this.allSupplies;

		if (this.sales !== undefined) {
			for (let s of this.sales) {
				switch (s.to) {
					case "n":
						this.soldToCustomers++;
						break;
					case "s":
						this.soldToStaff++;
						break;
					case "t":
						this.takenOut++;
						break;
				}
			}
		} else {
			this.sales = [];
		}

		this.markupPriceSingle = Math.ceil((this.supplyPrice + (this.supplyPrice / 100) * this.markup) / 5) * 5;
		this.staffMarkupPriceSingle =
			Math.ceil((this.supplyPrice + (this.supplyPrice / 100) * this.staffMarkup) / 5) * 5;
		this.markupPriceMultiple =
			Math.ceil((this.suppliesPrice + (this.suppliesPrice / 100) * this.staffMarkup) / 5) * 5;
		this.staffMarkupPriceMultiple =
			Math.ceil((this.suppliesPrice + (this.suppliesPrice / 100) * this.markup) / 5) * 5;
		this.staffProfitSingle = this.staffMarkupPriceSingle - this.supplyPrice;
		this.profitSingle = this.markupPriceSingle - this.supplyPrice;
		this.staffProfitMultiple = this.staffMarkupPriceMultiple - this.suppliesPrice;
		this.profitMultiple = this.markupPriceMultiple - this.suppliesPrice;

		this.inStorage = this.allSupplies - this.sales.length;
	}
}

export class SaleC {
	id: string = $state("");
	to: string = $state("");
	timestamp: Date = $state(new Date());
	Products: ProductWA[] = $state([]);

	constructor(obj: SaleEventWP) {
		this.id = obj.id;
		this.to = obj.to;
		this.timestamp = obj.timestamp;
		this.Products = obj.Products;
	}
}

export class ProductCategoryC {
	id: string;
	Products: ProductC[];
	name: string;

	constructor(object: ProductCategoryWP) {
		this.id = object.id;
		this.Products = toProdC(object.Products);
		this.name = object.name;
	}
}

export class ProductsC {
	private productsDB: ProductDB;
	private salesDB: SaleDB;
	private categoriesDB: CategoryDB;

	constructor() {
		this.productsDB = new ProductDB();
		this.salesDB = new SaleDB();
		this.categoriesDB = new CategoryDB();
	}

	async new(obj: {
		name: string;
		markup: number;
		staffMarkup: number;
		allSupplies: number;
		supplyPrice: number;
		category: string;
	}): Promise<ProductC> {
		let product = await this.productsDB.create(obj);
		return new ProductC(product);
	}

	async get(id: string = "all", obj: { skip: number; limit: number } = { skip: 0, limit: 0 }): Promise<ProductC[]> {
		let products: ProductWA[];
		let returnProducts = [];
		switch (id) {
			case "all":
				products = await this.productsDB.read();
				for (let p of products) {
					returnProducts.push(new ProductC({ ...p }));
				}
				return returnProducts;
			case "next":
				products = await this.productsDB.read("next", { skip: obj.skip, limit: obj.limit });
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
			category: string;
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

	async getSales(id: string = "all", obj: { skip: number; limit: number } = { skip: 0, limit: 0 }): Promise<SaleC[]> {
		let sales: SaleEventWP[];
		let returnValue: SaleC[] = [];
		switch (id) {
			case "all":
				sales = await this.salesDB.read();
				for (let s of sales) {
					returnValue.push(new SaleC({ ...s }));
				}
				return returnValue;
			case "next":
				sales = await this.salesDB.read("next", { skip: obj.skip, limit: obj.limit });
				for (let s of sales) {
					returnValue.push(new SaleC({ ...s }));
				}
				return returnValue;
			default:
				sales = await this.salesDB.read(id);
				return [new SaleC({ ...sales[0] })];
		}
	}

	async getCategories(): Promise<ProductCategoryC[]> {
		return toCatC(await this.categoriesDB.read());
	}
}

export const toProdC = (obj: ProductWA[]): ProductC[] => {
	let returnList: ProductC[] = [];
	for (let o of obj) {
		returnList.push(new ProductC(o));
	}
	return returnList;
};

export const toCatC = (obj: ProductCategoryWP[]): ProductCategoryC[] => {
	let returnList: ProductCategoryC[] = [];
	for (let o of obj) {
		returnList.push(new ProductCategoryC(o));
	}
	return returnList;
};
