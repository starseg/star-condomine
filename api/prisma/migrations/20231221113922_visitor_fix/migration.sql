/*
  Warnings:

  - You are about to drop the column `lobbyLobbyId` on the `visitor` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `visitor` DROP FOREIGN KEY `Visitor_lobbyLobbyId_fkey`;

-- AlterTable
ALTER TABLE `visitor` DROP COLUMN `lobbyLobbyId`,
    ADD COLUMN `lobbyId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Visitor` ADD CONSTRAINT `Visitor_lobbyId_fkey` FOREIGN KEY (`lobbyId`) REFERENCES `Lobby`(`lobbyId`) ON DELETE SET NULL ON UPDATE CASCADE;
