import { priceList } from "$lib/client/priceList.svelte";
import type { ProductCategoryWP, ProductWA, saleEventProductsWA } from "$lib/types/db";
import type { SaleEventWP } from "$lib/types/db";
import { CategoryDB, ProductDB, SaleDB } from "./db";

export class ProductC {
	private prodsDB = new ProductDB(false);

	id: string = $state("");
	name: string = $state("");
	markup: number = $state(0);
	staffMarkup: number = $state(0);
	allSupplies: number = $state(0);
	supplyPrice: number = $state(0);

	category: string;
	categoryId: string;
	sales: saleEventProductsWA[] = $state([]);

	updatePopup: boolean = $state(false);
	deletePopup: boolean = $state(false);

	isActive: boolean = $state(true);

	markupPriceSingle: number = $state(0);
	staffMarkupPriceSingle: number = $state(0);
	markupPriceMultiple: number = $state(0);
	staffMarkupPriceMultiple: number = $state(0);
	staffProfitSingle: number = $state(0);
	profitSingle: number = $state(0);
	staffProfitMultiple: number = $state(0);
	profitMultiple: number = $state(0);

	income: number = $state(0);
	staffIncome: number = $state(0);
	allIncome: number = $state(0);

	//Profit of the sold products
	currentProfit: number = $state(0);
	currentStaffProfit: number = $state(0);
	currentAllProfit: number = $state(0);

	suppliesPrice: number = $state(0);
	soldToStaff: number = $state(0);
	sold: number = $state(0);
	soldAll: number = $state(0);
	takenOut: number = $state(0);
	inStorage: number = $state(0);

	constructor(obj: ProductWA) {
		this.id = obj.id;
		this.name = obj.name;
		this.markup = obj.markup;
		this.staffMarkup = obj.staffMarkup;
		this.allSupplies = obj.allSupplies;
		this.supplyPrice = obj.supplyPrice;
		this.category = obj.productCategory;
		this.categoryId = obj.productCategoryId;

		this.sales = obj.saleEventProducts;

		this.calculateDerivedProperties();
	}

	async sell() {
		let thisProd = await this.prodsDB.read(this.id);
		this.sales = thisProd[0].saleEventProducts;
		this.calculateDerivedProperties();
	}

	calculateDerivedProperties() {
		this.resetPropsDerived();

		if (this.sales && this.sales.length > 0) {
			for (let s of this.sales) {
				switch (s.saleEvent.to) {
					case "n":
						this.sold += s.amount;
						break;
					case "s":
						this.soldToStaff += s.amount;
						break;
					case "t":
						this.takenOut += s.amount;
						break;
				}
			}
		} else {
			this.sales = [];
		}

		this.suppliesPrice = this.supplyPrice * this.allSupplies;
		this.soldAll = this.soldToStaff + this.sold;
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

		this.income = this.markupPriceSingle * this.sold;
		this.staffIncome = this.staffMarkupPriceSingle * this.soldToStaff;
		this.allIncome = this.income + this.staffIncome;

		this.currentProfit = this.profitSingle * this.sold;
		this.currentStaffProfit = this.profitSingle * this.soldToStaff;
		this.currentAllProfit = this.currentProfit + this.currentStaffProfit;

		this.inStorage = this.allSupplies - (this.soldAll + this.takenOut);

		if (this.inStorage > 0) {
			this.isActive = true;
		} else {
			this.isActive = false;
		}
	}

	resetPropsDerived() {
		this.markupPriceSingle = 0;
		this.staffMarkupPriceSingle = 0;
		this.markupPriceMultiple = 0;
		this.staffMarkupPriceMultiple = 0;
		this.staffProfitSingle = 0;
		this.profitSingle = 0;
		this.staffProfitMultiple = 0;
		this.profitMultiple = 0;
		this.income = 0;
		this.staffIncome = 0;
		this.currentProfit = 0;
		this.currentAllProfit = 0;
		this.currentStaffProfit = 0;

		this.suppliesPrice = 0;
		this.soldToStaff = 0;
		this.sold = 0;
		this.soldAll = 0;
		this.takenOut = 0;
		this.inStorage = 0;
	}
}

export class SaleC {
	id: string = $state("");
	to: string = $state("");
	timestamp: Date = $state(new Date());
	saleEventProducts: saleEventProductsWA[] = $state([]);
	tip: number = $state(0);

	productsPopup: boolean = $state(false);

	constructor(obj: SaleEventWP) {
		this.id = obj.id;
		this.to = obj.to;
		this.timestamp = obj.timestamp;
		this.saleEventProducts = obj.saleEventProducts;
		this.tip = obj.tip;
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

export class BasketC {
	content: {
		amt: number;
		Product: ProductC;
	}[] = $state([]);
	paySum = $state(0);

	constructor() {
		// This is needed, so that I can bind an input to the "item.amt" value
		// It's a kind of user input validation
		$effect(() => {
			for (let item of this.content) {
				if (item.amt > item.Product.inStorage) {
					item.amt = item.Product.inStorage;
				}
				if (item.amt < 0) {
					this.remove(item.Product);
				}
			}
		});

		$effect(() => {
			this.paySum = this.content.reduce((a, item) => {
				return priceList.state === "par"
					? item.Product.markupPriceSingle * item.amt + a
					: item.Product.staffMarkupPriceSingle * item.amt + a;
			}, 0);
		});
	}

	add(prod: ProductC, amt: number = 1) {
		let productIDs: string[] = this.content.map((item) => {
			return item.Product.id;
		});

		// If the product is already in the basket, increase the amount, otherwise add it to basket
		if (!productIDs.includes(prod.id)) {
			this.content.push({
				Product: prod,
				amt: amt
			});
			this.sort();
			return;
		}

		let item = this.content[productIDs.indexOf(prod.id)];

		if (item.amt + amt <= item.Product.inStorage) {
			this.content[productIDs.indexOf(prod.id)].amt += amt;
		}
		this.sort();
	}

	remove(prod: ProductC, cut: boolean = false) {
		let productIDs: string[] = this.content.map((item) => {
			return item.Product.id;
		});

		let selectedProductIndex = productIDs.indexOf(prod.id);

		if (cut || this.content[selectedProductIndex].amt - 1 < 1) {
			this.content.splice(selectedProductIndex, 1);
			this.sort();
			return;
		}
		this.content[selectedProductIndex].amt--;
		this.sort();
	}

	setAmt(prod: ProductC, amt: number) {
		let productIDs: string[] = this.content.map((item) => {
			return item.Product.id;
		});
		if (productIDs.includes(prod.id)) {
			this.content[productIDs.indexOf(prod.id)].amt = amt;
			this.sort();
			return;
		}

		this.content.push({ amt, Product: prod });
		this.sort();
	}

	sort() {
		this.content.sort((a, b) => {
			return a.Product.name.localeCompare(b.Product.name);
		});
	}

	clear() {
		this.content = [];
	}
	sell(): ProductC[] {
		return this.content.map((item) => item.Product);
	}
}

export class ProductsC {
	private productsDB: ProductDB;
	private salesDB: SaleDB;
	private categoriesDB: CategoryDB;
	private products: ProductC[] = [];
	private skip: number = 0;
	basket: BasketC;

	tips: number = $state(0);

	profit: number = $state(0);
	staffProfit: number = $state(0);
	allProfit: number = $state(0);

	income: number = $state(0);
	staffIncome: number = $state(0);
	allIncome: number = $state(0);

	suppliesPrice: number = $state(0);

	sold: number = $state(0);
	soldToStaff: number = $state(0);
	soldAll: number = $state(0);
	takenOut: number = $state(0);
	inStorage: number = $state(0);
	allSupplies: number = $state(0);
	inStorageTypes: number = $state(0);
	allSupplyTypes: number = $state(0);
	inStorageCategories: number = $state(0);

	constructor(reading: boolean = false) {
		this.productsDB = new ProductDB(reading);
		this.salesDB = new SaleDB(reading);
		this.categoriesDB = new CategoryDB(reading);

		this.basket = new BasketC();

		if (reading) this.calculateDerivedProperties();
	}

	async calculateDerivedProperties() {
		this.products = await this.get();

		this.suppliesPrice = this.products.reduce((a, item) => {
			return item.suppliesPrice + a;
		}, 0);

		this.profit = this.products.reduce((a, item) => {
			return item.currentProfit + a;
		}, 0);

		this.staffProfit = this.products.reduce((a, item) => {
			return item.currentStaffProfit + a;
		}, 0);

		this.allProfit = this.profit + this.staffProfit;

		this.income = this.products.reduce((a, item) => {
			return item.income + a;
		}, 0);

		this.staffIncome = this.products.reduce((a, item) => {
			return item.staffIncome + a;
		}, 0);

		this.allIncome = this.income + this.staffIncome;

		if ((await this.salesDB.read()).length > 0) {
			this.tips = (await this.salesDB.read()).map((item) => item.tip).reduce((a, b) => a + b);
		}

		this.sold = this.products.reduce((a, item) => {
			return item.sold + a;
		}, 0);
		this.soldToStaff = this.products.reduce((a, item) => {
			return item.soldToStaff + a;
		}, 0);
		this.soldAll = this.products.reduce((a, item) => {
			return item.soldAll + a;
		}, 0);

		this.takenOut = this.products.reduce((a, item) => {
			return item.takenOut + a;
		}, 0);

		this.inStorage = this.products.reduce((a, item) => {
			return item.inStorage + a;
		}, 0);
		this.allSupplies = this.products.reduce((a, item) => {
			return item.allSupplies + a;
		}, 0);

		this.allSupplyTypes = this.products.length;
		this.inStorageTypes = this.products.reduce((a, item) => {
			return item.isActive ? a + 1 : a;
		}, 0);

		this.inStorageCategories = (await this.categoriesDB.read()).length;
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

	async sell(object: { amt: number; Product: ProductC }[], to: "n" | "s" | "t", tip: number): Promise<SaleC> {
		let sales = await this.salesDB.register({
			products: object
				.filter((item) => item.Product.inStorage >= item.amt)
				.map((item) => ({ id: item.Product.id, qty: item.amt })),
			to,
			tip
		});

		for (let p of object.map((item) => item.Product)) {
			p.sell();
		}

		this.basket.clear();
		return new SaleC({
			...sales
		});
	}

	async getSales(id: string = "all", limit: number = 20): Promise<SaleC[]> {
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
				sales = await this.salesDB.read("next", { skip: this.skip, limit: limit });
				for (let s of sales) {
					returnValue.push(new SaleC({ ...s }));
				}
				this.skip += limit;
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
export class KeyboardEvents {
	shift: boolean = $state(false);
	ctrl: boolean = $state(false);
	alt: boolean = $state(false);

	set(t: "s" | "c" | "a", v: boolean) {
		switch (t) {
			case "s":
				this.shift = v;
				break;
			case "c":
				this.ctrl = v;
				break;
			case "a":
				this.alt = v;
				break;
		}
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

export let POJOToProdC = (obj: any): ProductC[] => {
	let returnList: ProductC[] = [];
	for (let o of obj) {
		returnList.push(
			new ProductC({
				id: o.id,
				name: o.name,
				markup: o.markup,
				staffMarkup: o.staffMarkup,
				allSupplies: o.allSupplies,
				supplyPrice: o.supplyPrice,
				productCategory: o.category.name,
				productCategoryId: o.category.id,
				saleEventProducts: o.sales
			})
		);
	}

	return returnList;
};
