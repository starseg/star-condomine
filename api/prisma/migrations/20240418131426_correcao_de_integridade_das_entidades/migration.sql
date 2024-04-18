/*
  Warnings:

  - Made the column `memberId` on table `access` required. This step will fail if there are existing NULL values in that column.
  - Made the column `memberId` on table `scheduling` required. This step will fail if there are existing NULL values in that column.
  - Made the column `lobbyId` on table `visitor` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `access` DROP FOREIGN KEY `Access_memberId_fkey`;

-- DropForeignKey
ALTER TABLE `scheduling` DROP FOREIGN KEY `Scheduling_memberId_fkey`;

-- DropForeignKey
ALTER TABLE `visitor` DROP FOREIGN KEY `Visitor_lobbyId_fkey`;

-- AlterTable
ALTER TABLE `access` MODIFY `memberId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `scheduling` MODIFY `memberId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `visitor` MODIFY `lobbyId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Visitor` ADD CONSTRAINT `Visitor_lobbyId_fkey` FOREIGN KEY (`lobbyId`) REFERENCES `Lobby`(`lobbyId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Scheduling` ADD CONSTRAINT `Scheduling_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `Member`(`memberId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Access` ADD CONSTRAINT `Access_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `Member`(`memberId`) ON DELETE RESTRICT ON UPDATE CASCADE;
