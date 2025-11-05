/*
  Warnings:

  - You are about to alter the column `supplyPrice` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "markup" INTEGER NOT NULL,
    "staffMarkup" INTEGER NOT NULL,
    "allSupplies" INTEGER NOT NULL,
    "supplyPrice" BIGINT NOT NULL
);
INSERT INTO "new_Product" ("allSupplies", "id", "markup", "name", "staffMarkup", "supplyPrice") SELECT "allSupplies", "id", "markup", "name", "staffMarkup", "supplyPrice" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
