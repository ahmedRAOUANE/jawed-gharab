/*
  Warnings:

  - The `icon` column on the `requests` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "RequestIcon" AS ENUM ('person', 'business', 'movie');

-- AlterTable
ALTER TABLE "requests" DROP COLUMN "icon",
ADD COLUMN     "icon" "RequestIcon" NOT NULL DEFAULT 'person';
