-- CreateTable
CREATE TABLE "PasswordChangeVerification" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordChangeVerification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PasswordChangeVerification_userId_key" ON "PasswordChangeVerification"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordChangeVerification_token_key" ON "PasswordChangeVerification"("token");

-- AddForeignKey
ALTER TABLE "PasswordChangeVerification" ADD CONSTRAINT "PasswordChangeVerification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
