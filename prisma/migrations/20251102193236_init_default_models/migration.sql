-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "markup" INTEGER NOT NULL,
    "staffMarkup" INTEGER NOT NULL,
    "sold" INTEGER NOT NULL,
    "staffSold" INTEGER NOT NULL,
    "takenOut" INTEGER NOT NULL,
    "allSupplies" INTEGER NOT NULL,
    "suppliesPrice" INTEGER NOT NULL,
    "saleEventId" TEXT,
    CONSTRAINT "Product_saleEventId_fkey" FOREIGN KEY ("saleEventId") REFERENCES "SaleEvent" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SaleEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
