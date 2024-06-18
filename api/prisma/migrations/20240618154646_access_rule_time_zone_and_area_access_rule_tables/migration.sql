-- CreateTable
CREATE TABLE `AccessRuleTimeZone` (
    `accessRuleTimeZoneId` INTEGER NOT NULL AUTO_INCREMENT,
    `accessRuleId` INTEGER NOT NULL,
    `timeZoneId` INTEGER NOT NULL,

    PRIMARY KEY (`accessRuleTimeZoneId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AreaAccessRule` (
    `areaAccessRuleId` INTEGER NOT NULL AUTO_INCREMENT,
    `areaId` INTEGER NOT NULL,
    `accessRuleId` INTEGER NOT NULL,

    PRIMARY KEY (`areaAccessRuleId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `AccessRuleTimeZone` ADD CONSTRAINT `AccessRuleTimeZone_accessRuleId_fkey` FOREIGN KEY (`accessRuleId`) REFERENCES `AccessRule`(`accessRuleId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AccessRuleTimeZone` ADD CONSTRAINT `AccessRuleTimeZone_timeZoneId_fkey` FOREIGN KEY (`timeZoneId`) REFERENCES `TimeZone`(`timeZoneId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AreaAccessRule` ADD CONSTRAINT `AreaAccessRule_areaId_fkey` FOREIGN KEY (`areaId`) REFERENCES `Lobby`(`lobbyId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AreaAccessRule` ADD CONSTRAINT `AreaAccessRule_accessRuleId_fkey` FOREIGN KEY (`accessRuleId`) REFERENCES `AccessRule`(`accessRuleId`) ON DELETE RESTRICT ON UPDATE CASCADE;
