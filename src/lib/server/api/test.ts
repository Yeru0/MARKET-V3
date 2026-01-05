import type { SaleEvent } from "$lib/prisma/client";
import { db } from "$lib/server/db";
import type { ProductWA } from "$lib/types/db";

export const createDummyProducts = async (
	amount: number = 50,
	category: string = "test",
	inputData: {
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
): Promise<ProductWA[]> => {
	for (let n = 0; n < amount; n++) {
		await db.product.create({
			data: {
				...inputData,
				productCategory: {
					connectOrCreate: {
						where: {
							name: category
						},
						create: {
							name: category
						}
					}
				}
			}
		});
	}

	return (await db.product.findMany({
		orderBy: { name: "asc" },
		include: { saleEventProducts: { include: { saleEvent: true } }, productCategory: true }
	})) as ProductWA[];
};

export const readProductDB = async () => {
	return (await db.product.findMany({
		include: { saleEventProducts: true },
		orderBy: { name: "asc" }
	})) as ProductWA[];
};

export const eraseProductDB = async () => {
	await db.product.deleteMany();
};

export const createDummySales = async (
	products: { id: string; qty: number }[],
	amount: number
): Promise<SaleEvent[]> => {
	let sales: SaleEvent[] = [];
	for (let n = 0; n < amount; n++) {
		const sale = await db.saleEvent.create({
			data: {
				saleEventProducts: {
					create: products.map((p) => ({
						amount: p.qty,
						product: { connect: { id: p.id } }
					}))
				},
				to: "n"
			},
			include: {
				saleEventProducts: true
			}
		});
		sales.push(sale);
	}
	return await db.saleEvent.findMany({ orderBy: { timestamp: "desc" }, include: { saleEventProducts: true } });
};

export const readSaleDB = async () => {
	return await db.saleEvent.findMany({
		orderBy: {
			timestamp: "desc"
		},
		include: {
			saleEventProducts: true
		}
	});
};

export const eraseSaleDB = async () => {
	await db.saleEventProduct.deleteMany();
	await db.saleEvent.deleteMany();
};

export const readCategoryDB = async () => {
	return await db.productCategory.findMany({
		include: {
			Products: true
		}
	});
};

export const deleteCategoryDB = async () => {
	return await db.productCategory.deleteMany();
};

export const nuke = async () => {
	await db.saleEventProduct.deleteMany();
	await db.product.deleteMany();
	await db.saleEvent.deleteMany();
	await db.productCategory.deleteMany();
};
