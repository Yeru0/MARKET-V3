import type { SaleEvent } from "$lib/prisma/client";
import { db } from "$lib/server/db";
import type { ProductWE } from "$lib/types/db/product";

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
): Promise<ProductWE[]> => {
	let products: ProductWE[] = [];
	for (let n = 0; n < amount; n++) {
		const product = await db.product.create({
			data,
			include: {
				SaleEvents: true
			}
		});
		products.push(product as ProductWE);
	}

	return (await db.product.findMany({ orderBy: { name: "asc" }, include: { SaleEvents: true } })) as ProductWE[];
};

export const readProductDB = async () => {
	return (await db.product.findMany({ include: { SaleEvents: true }, orderBy: { name: "asc" } })) as ProductWE[];
};

export const eraseProductDB = async () => {
	await db.product.deleteMany();
};

export const createDummySales = async (ids: { id: string }[], amount: number): Promise<SaleEvent[]> => {
	let sales: SaleEvent[] = [];
	for (let n = 0; n < amount; n++) {
		const sale = await db.saleEvent.create({
			data: {
				Products: {
					connect: ids
				},
				to: "t"
			},
			include: {
				Products: true
			}
		});
		sales.push(sale);
	}
	return await db.saleEvent.findMany({ orderBy: { timestamp: "desc" }, include: { Products: true } });
};

export const readSaleDB = async () => {
	return await db.saleEvent.findMany({
		orderBy: {
			timestamp: "desc"
		},
		include: {
			Products: true
		}
	});
};

export const eraseSaleDB = async () => {
	await db.saleEvent.deleteMany();
};

export const nuke = async () => {
	await db.product.deleteMany();
	await db.saleEvent.deleteMany();
};
