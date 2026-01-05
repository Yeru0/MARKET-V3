-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SaleEventProduct" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "amount" INTEGER NOT NULL,
    "saleEventId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    CONSTRAINT "SaleEventProduct_saleEventId_fkey" FOREIGN KEY ("saleEventId") REFERENCES "SaleEvent" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SaleEventProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_SaleEventProduct" ("amount", "id", "productId", "saleEventId") SELECT "amount", "id", "productId", "saleEventId" FROM "SaleEventProduct";
DROP TABLE "SaleEventProduct";
ALTER TABLE "new_SaleEventProduct" RENAME TO "SaleEventProduct";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
