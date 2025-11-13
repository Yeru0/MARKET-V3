import { describe, expect, it } from "vitest";
import { beforeEach } from "node:test";
import { createDummyProducts, createDummySales, nuke, readProductDB, readSaleDB } from "$lib/server/api/test";
import { ProductsC } from "./frontEndObjects";

describe("Testing the product object", () => {

    let Products = new ProductsC()

    beforeEach(() => {
        nuke()
    })

    it("checks if new product can be created", async () => {
        let product = await Products.new({
            name: "test",
            markup: 85,
            staffMarkup: 25,
            allSupplies: 24,
            supplyPrice: 500
        })

        let productsFromDB = await readProductDB()
        
        expect(productsFromDB.length).toEqual(1)
        expect((await productsFromDB).map(item => item.id)).toContain(product.id)
    })

    it("checks if a product can be read", async () => {
        let productsFromDB = await readProductDB()
        let productFromDB = productsFromDB[0]

        let product = await Products.get(productFromDB.id)

        expect(productFromDB.id).toEqual(product[0].id)
    })

    it("checks if all products can be read", async () => {
        let productsFromDB = await readProductDB()
        let products = await Products.get()

        expect(productsFromDB.length).toEqual(products.length)
        expect(productsFromDB).toEqual(products)
    })

    it("checks if a product can be modified", async () => {
        let productFromDB = (await createDummyProducts(1))[0]

        expect(productFromDB.name).toEqual("test")

        await Products.update(productFromDB.id, {
            name: "test1",
            markup: productFromDB.markup,
            staffMarkup: productFromDB.staffMarkup,
            allSupplies: productFromDB.allSupplies,
            supplyPrice: productFromDB.supplyPrice
        })
        productFromDB = (await readProductDB())[0]

        expect(productFromDB.name).toEqual("test1")

        await Products.update(productFromDB.id, {
            name: "test",
            markup: productFromDB.markup,
            staffMarkup: productFromDB.staffMarkup,
            allSupplies: productFromDB.allSupplies,
            supplyPrice: productFromDB.supplyPrice
        })
        productFromDB = (await readProductDB())[0]

        expect(productFromDB.name).toEqual("test")
    })

    it("checks if a single product can be deleted", async () => {
        let productsFromDB = await createDummyProducts(2)
        let productFromDB = productsFromDB[0]

        await Products.delete(productFromDB.id)

        productsFromDB = await readProductDB()

        expect(productsFromDB.length).toEqual(1)
        expect(productFromDB).toEqual(productsFromDB[0])
    })

    it("checks if all products can be deleted", async () => {
        let productsFromDB = await createDummyProducts()

        expect(productsFromDB.length).toEqual(50)

        await Products.delete()
        productsFromDB = await readProductDB()

        expect(productsFromDB.length).toEqual(0)
    })

    it("checks if products can be sold", async () => {
        let productsFromDB = await createDummyProducts()

        await Products.sell(productsFromDB.map(item => item.id))

        let sales = await readSaleDB()

        expect(sales.length).toEqual(1)
        expect(sales[0].products).toEqual(productsFromDB)
    })

    it("checks if sales can be read", async () => {
        let productsFromDB = await createDummyProducts();
        let salesFromDB = await createDummySales(
            productsFromDB.map((item) => ({
                id: item.id
            })),
            50
        );
        
        let sales = await Products.getSales()

        expect(salesFromDB.length).toEqual(sales.length)
        expect(salesFromDB).toEqual(sales)
    })

})