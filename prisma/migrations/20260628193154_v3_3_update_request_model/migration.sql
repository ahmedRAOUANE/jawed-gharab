/*
  Warnings:

  - Added the required column `email` to the `requests` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `requests` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "requests" ADD COLUMN     "email" TEXT NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" "ProjectType" NOT NULL;
