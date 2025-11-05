/*
  Warnings:

  - You are about to drop the column `saleEventId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `sold` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `staffSold` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `takenOut` on the `Product` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "_ProductToSaleEvent" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_ProductToSaleEvent_A_fkey" FOREIGN KEY ("A") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ProductToSaleEvent_B_fkey" FOREIGN KEY ("B") REFERENCES "SaleEvent" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "markup" INTEGER NOT NULL,
    "staffMarkup" INTEGER NOT NULL,
    "allSupplies" INTEGER NOT NULL,
    "supplyPrice" INTEGER NOT NULL
);
INSERT INTO "new_Product" ("allSupplies", "id", "markup", "name", "staffMarkup", "supplyPrice") SELECT "allSupplies", "id", "markup", "name", "staffMarkup", "supplyPrice" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "_ProductToSaleEvent_AB_unique" ON "_ProductToSaleEvent"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductToSaleEvent_B_index" ON "_ProductToSaleEvent"("B");
