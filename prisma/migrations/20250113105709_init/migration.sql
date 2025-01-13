-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lease" (
    "id" SERIAL NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "monthlyRent" DOUBLE PRECISION NOT NULL,
    "securityDeposit" DOUBLE PRECISION NOT NULL,
    "additionalCharges" DOUBLE PRECISION NOT NULL,
    "annualRentIncrease" DOUBLE PRECISION NOT NULL,
    "leaseType" TEXT NOT NULL,
    "utilitiesIncluded" BOOLEAN NOT NULL,
    "maintenanceFees" DOUBLE PRECISION NOT NULL,
    "latePaymentPenalty" DOUBLE PRECISION NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Lease_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SharedLease" (
    "id" SERIAL NOT NULL,
    "leaseId" INTEGER NOT NULL,
    "sharedWithEmail" TEXT NOT NULL,

    CONSTRAINT "SharedLease_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Lease" ADD CONSTRAINT "Lease_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SharedLease" ADD CONSTRAINT "SharedLease_leaseId_fkey" FOREIGN KEY ("leaseId") REFERENCES "Lease"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
