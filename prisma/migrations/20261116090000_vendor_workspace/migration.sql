CREATE TABLE "VendorTicket" (
 "id" TEXT PRIMARY KEY, "vendorId" TEXT NOT NULL, "subject" TEXT NOT NULL,
 "category" TEXT NOT NULL, "status" TEXT NOT NULL DEFAULT 'OPEN', "messages" JSONB NOT NULL,
 "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL
);
CREATE INDEX "VendorTicket_vendorId_createdAt_idx" ON "VendorTicket"("vendorId", "createdAt");
CREATE TABLE "VendorLedgerEntry" (
 "id" TEXT PRIMARY KEY, "vendorId" TEXT NOT NULL, "reference" TEXT NOT NULL UNIQUE,
 "label" TEXT NOT NULL, "amount" DECIMAL(12,2) NOT NULL,
 "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "VendorLedgerEntry_vendorId_createdAt_idx" ON "VendorLedgerEntry"("vendorId", "createdAt");
CREATE TABLE "VendorWithdrawal" (
 "id" TEXT PRIMARY KEY, "vendorId" TEXT NOT NULL, "amount" DECIMAL(12,2) NOT NULL,
 "destination" TEXT NOT NULL, "status" TEXT NOT NULL DEFAULT 'PENDING',
 "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL
);
CREATE INDEX "VendorWithdrawal_vendorId_createdAt_idx" ON "VendorWithdrawal"("vendorId", "createdAt");
CREATE TABLE "VendorFulfillment" (
 "id" TEXT PRIMARY KEY, "vendorId" TEXT NOT NULL, "orderId" TEXT NOT NULL,
 "status" "OrderStatus" NOT NULL DEFAULT 'PROCESSING', "history" JSONB NOT NULL,
 "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL
);
CREATE UNIQUE INDEX "VendorFulfillment_vendorId_orderId_key" ON "VendorFulfillment"("vendorId", "orderId");
