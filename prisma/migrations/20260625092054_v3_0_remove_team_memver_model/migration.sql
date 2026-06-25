/*
  Warnings:

  - You are about to drop the `_TeamMemberToUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `team_members` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_TeamMemberToUser" DROP CONSTRAINT "_TeamMemberToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_TeamMemberToUser" DROP CONSTRAINT "_TeamMemberToUser_B_fkey";

-- DropForeignKey
ALTER TABLE "team_members" DROP CONSTRAINT "team_members_project_id_fkey";

-- DropTable
DROP TABLE "_TeamMemberToUser";

-- DropTable
DROP TABLE "team_members";
