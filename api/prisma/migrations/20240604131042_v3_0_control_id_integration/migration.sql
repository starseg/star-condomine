-- AlterTable
ALTER TABLE `device` ADD COLUMN `login` VARCHAR(191) NULL,
    ADD COLUMN `password` VARCHAR(191) NULL,
    MODIFY `ip` VARCHAR(191) NULL,
    MODIFY `ramal` INTEGER NULL;

-- AlterTable
ALTER TABLE `devicemodel` ADD COLUMN `isFacial` VARCHAR(191) NOT NULL DEFAULT 'true';

-- AlterTable
ALTER TABLE `lobby` ADD COLUMN `controllerBrandId` INTEGER NULL;

-- CreateTable
CREATE TABLE `TimeZone` (
    `timeZoneId` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`timeZoneId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TimeSpan` (
    `timeSpanId` INTEGER NOT NULL AUTO_INCREMENT,
    `start` INTEGER NOT NULL,
    `end` INTEGER NOT NULL,
    `sun` INTEGER NOT NULL,
    `mon` INTEGER NOT NULL,
    `tue` INTEGER NOT NULL,
    `wed` INTEGER NOT NULL,
    `thu` INTEGER NOT NULL,
    `fri` INTEGER NOT NULL,
    `sat` INTEGER NOT NULL,
    `hol1` INTEGER NOT NULL,
    `hol2` INTEGER NOT NULL,
    `hol3` INTEGER NOT NULL,
    `timeZoneId` INTEGER NOT NULL,

    PRIMARY KEY (`timeSpanId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ControllerBrand` (
    `controllerBrandId` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `iconUrl` VARCHAR(191) NULL,

    PRIMARY KEY (`controllerBrandId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Lobby` ADD CONSTRAINT `Lobby_controllerBrandId_fkey` FOREIGN KEY (`controllerBrandId`) REFERENCES `ControllerBrand`(`controllerBrandId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TimeSpan` ADD CONSTRAINT `TimeSpan_timeZoneId_fkey` FOREIGN KEY (`timeZoneId`) REFERENCES `TimeZone`(`timeZoneId`) ON DELETE RESTRICT ON UPDATE CASCADE;
