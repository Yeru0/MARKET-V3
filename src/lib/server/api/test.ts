import type { SaleEvent, Product } from "$lib/prisma/client";
import { db } from "$lib/server/db";

export const createDummyProducts = async (
	amount: number = 50,
	data: {
		name: string;
		markup: number;
		staffMarkup: number;
		allSupplies: number;
		supplyPrice: number;
	} = {
		name: "test",
		markup: 25,
		staffMarkup: 85,
		allSupplies: 24,
		supplyPrice: 500
	}
): Promise<Product[]> => {
	let products: Product[] = [];
	for (let n = 0; n < amount; n++) {
		const product = await db.product.create({
			data,
			include: {
				SaleEvents: true
			}
		});
		products.push(product);
	}

	return products;
};

export const readProductDB = async () => {
	return await db.product.findMany();
};

export const eraseProductDB = async () => {
	await db.product.deleteMany();
};

export const createDummySales = async (ids: { id: string }[], amount: number): Promise<SaleEvent[]> => {
	let sales: SaleEvent[] = [];
	for (let n = 0; n < amount; n++) {
		const sale = await db.saleEvent.create({
			data: {
				products: {
					connect: ids
				}
			},
			include: {
				products: true
			}
		});
		sales.push(sale);
	}
	return sales;
};

export const readSaleDB = async () => {
	return await db.saleEvent.findMany({ include: { products: true } });
};

export const eraseSaleDB = async () => {
	await db.saleEvent.deleteMany();
};

export const nuke = async () => {
	await db.product.deleteMany();
	await db.saleEvent.deleteMany();
};
