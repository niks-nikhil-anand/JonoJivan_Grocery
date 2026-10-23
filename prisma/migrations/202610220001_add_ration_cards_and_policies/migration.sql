-- Additive migration generated from the PostgreSQL schema diff.
-- It creates only tables absent from the existing Prisma database.
CREATE TABLE "RationCard" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "fatherName" TEXT NOT NULL,
    "profilePictureUrl" TEXT,
    "uniqueNumber" TEXT NOT NULL,
    "whatsappNumber" TEXT,
    "email" TEXT,
    "aadhaarNumber" TEXT,
    "panNumber" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "bankAccountNumber" TEXT,
    "bankIfscCode" TEXT,
    "bankName" TEXT,
    "address" TEXT,
    "state" TEXT,
    "postalCode" TEXT,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RationCard_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PrivacyPolicy" (
    "id" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PrivacyPolicy_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ReturnPolicy" (
    "id" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReturnPolicy_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ShippingPolicy" (
    "id" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShippingPolicy_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TermsAndConditions" (
    "id" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TermsAndConditions_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "RationCard_uniqueNumber_key" ON "RationCard"("uniqueNumber");
