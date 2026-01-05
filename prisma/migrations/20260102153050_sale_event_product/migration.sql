/*
  Warnings:

  - You are about to drop the `_ProductToSaleEvent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_ProductToSaleEvent";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "SaleEventProduct" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "amount" INTEGER NOT NULL,
    "saleEventId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    CONSTRAINT "SaleEventProduct_saleEventId_fkey" FOREIGN KEY ("saleEventId") REFERENCES "SaleEvent" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SaleEventProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
