/*
  Warnings:

  - A unique constraint covering the columns `[uid]` on the table `Config` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cId]` on the table `EmailSettings` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cId` to the `EmailSettings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EmailSettings" ADD COLUMN     "cId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Config_uid_key" ON "Config"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "EmailSettings_cId_key" ON "EmailSettings"("cId");

-- AddForeignKey
ALTER TABLE "Config" ADD CONSTRAINT "Config_uid_fkey" FOREIGN KEY ("uid") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailSettings" ADD CONSTRAINT "EmailSettings_cId_fkey" FOREIGN KEY ("cId") REFERENCES "Config"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
