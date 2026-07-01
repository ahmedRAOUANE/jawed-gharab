/*
  Warnings:

  - You are about to drop the column `account_status` on the `users` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "users" DROP COLUMN "account_status",
ADD COLUMN     "accountStatus" "AccountStatus" NOT NULL DEFAULT 'ACTIVE',
ALTER COLUMN "role" SET DEFAULT 'VIEWER';
