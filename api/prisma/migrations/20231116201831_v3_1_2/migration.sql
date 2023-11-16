-- AlterTable
ALTER TABLE `visitor` ADD COLUMN `lobbyLobbyId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Visitor` ADD CONSTRAINT `Visitor_lobbyLobbyId_fkey` FOREIGN KEY (`lobbyLobbyId`) REFERENCES `Lobby`(`lobbyId`) ON DELETE SET NULL ON UPDATE CASCADE;
