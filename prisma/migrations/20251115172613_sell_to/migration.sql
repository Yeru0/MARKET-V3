/*
  Warnings:

  - Added the required column `to` to the `SaleEvent` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SaleEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "to" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_SaleEvent" ("id", "timestamp") SELECT "id", "timestamp" FROM "SaleEvent";
DROP TABLE "SaleEvent";
ALTER TABLE "new_SaleEvent" RENAME TO "SaleEvent";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
