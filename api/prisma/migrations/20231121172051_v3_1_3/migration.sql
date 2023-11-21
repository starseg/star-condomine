-- CreateTable
CREATE TABLE `Logging` (
    `logId` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `method` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `userAgent` VARCHAR(191) NOT NULL,
    `operatorId` INTEGER NOT NULL,

    PRIMARY KEY (`logId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Logging` ADD CONSTRAINT `Logging_operatorId_fkey` FOREIGN KEY (`operatorId`) REFERENCES `Operator`(`operatorId`) ON DELETE RESTRICT ON UPDATE CASCADE;
