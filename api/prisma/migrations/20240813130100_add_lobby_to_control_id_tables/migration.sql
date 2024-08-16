/*
  Warnings:

  - Added the required column `lobbyId` to the `AccessRule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lobbyId` to the `Group` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lobbyId` to the `TimeSpan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lobbyId` to the `TimeZone` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `accessrule` ADD COLUMN `lobbyId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `group` ADD COLUMN `lobbyId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `timespan` ADD COLUMN `lobbyId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `timezone` ADD COLUMN `lobbyId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `TimeZone` ADD CONSTRAINT `TimeZone_lobbyId_fkey` FOREIGN KEY (`lobbyId`) REFERENCES `Lobby`(`lobbyId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TimeSpan` ADD CONSTRAINT `TimeSpan_lobbyId_fkey` FOREIGN KEY (`lobbyId`) REFERENCES `Lobby`(`lobbyId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AccessRule` ADD CONSTRAINT `AccessRule_lobbyId_fkey` FOREIGN KEY (`lobbyId`) REFERENCES `Lobby`(`lobbyId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Group` ADD CONSTRAINT `Group_lobbyId_fkey` FOREIGN KEY (`lobbyId`) REFERENCES `Lobby`(`lobbyId`) ON DELETE RESTRICT ON UPDATE CASCADE;
