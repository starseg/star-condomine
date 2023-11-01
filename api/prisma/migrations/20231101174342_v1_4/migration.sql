-- CreateTable
CREATE TABLE `Device` (
    `deviceId` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `ip` VARCHAR(191) NOT NULL,
    `deviceModelId` INTEGER NOT NULL,
    `lobbyId` INTEGER NOT NULL,

    PRIMARY KEY (`deviceId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DeviceModel` (
    `deviceModelId` INTEGER NOT NULL AUTO_INCREMENT,
    `model` VARCHAR(191) NOT NULL,
    `brand` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`deviceModelId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Device` ADD CONSTRAINT `Device_deviceModelId_fkey` FOREIGN KEY (`deviceModelId`) REFERENCES `DeviceModel`(`deviceModelId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Device` ADD CONSTRAINT `Device_lobbyId_fkey` FOREIGN KEY (`lobbyId`) REFERENCES `Lobby`(`lobbyId`) ON DELETE RESTRICT ON UPDATE CASCADE;
