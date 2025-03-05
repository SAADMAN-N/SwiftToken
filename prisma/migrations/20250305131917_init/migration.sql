-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "walletAddress" TEXT NOT NULL,
    "credits" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Generation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "tokenName" TEXT NOT NULL,
    "tokenSymbol" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Generation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "signature" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "credits" INTEGER NOT NULL,
    "paymentMethod" TEXT NOT NULL DEFAULT 'solana',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "confirmedAt" DATETIME,
    CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CreditTransaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "balanceAfter" INTEGER NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CreditTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_walletAddress_key" ON "User"("walletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "Generation_requestId_key" ON "Generation"("requestId");

-- CreateIndex
CREATE INDEX "Generation_userId_idx" ON "Generation"("userId");

-- CreateIndex
CREATE INDEX "Generation_requestId_idx" ON "Generation"("requestId");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_signature_key" ON "Transaction"("signature");

-- CreateIndex
CREATE INDEX "CreditTransaction_userId_idx" ON "CreditTransaction"("userId");

-- CreateIndex
CREATE INDEX "CreditTransaction_createdAt_idx" ON "CreditTransaction"("createdAt");
