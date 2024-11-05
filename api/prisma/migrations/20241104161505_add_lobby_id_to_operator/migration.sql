-- AlterTable
ALTER TABLE `operator` ADD COLUMN `lobbyId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Operator` ADD CONSTRAINT `Operator_lobbyId_fkey` FOREIGN KEY (`lobbyId`) REFERENCES `Lobby`(`lobbyId`) ON DELETE SET NULL ON UPDATE CASCADE;
