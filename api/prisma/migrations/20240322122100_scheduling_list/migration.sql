-- AlterTable
ALTER TABLE `scheduling` ADD COLUMN `comments` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `SchedulingList` (
    `schedulingListId` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(1000) NOT NULL,
    `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `memberId` INTEGER NOT NULL,
    `operatorId` INTEGER NOT NULL,
    `lobbyId` INTEGER NOT NULL,

    PRIMARY KEY (`schedulingListId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SchedulingList` ADD CONSTRAINT `SchedulingList_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `Member`(`memberId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SchedulingList` ADD CONSTRAINT `SchedulingList_operatorId_fkey` FOREIGN KEY (`operatorId`) REFERENCES `Operator`(`operatorId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SchedulingList` ADD CONSTRAINT `SchedulingList_lobbyId_fkey` FOREIGN KEY (`lobbyId`) REFERENCES `Lobby`(`lobbyId`) ON DELETE RESTRICT ON UPDATE CASCADE;
