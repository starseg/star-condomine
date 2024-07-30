-- DropForeignKey
ALTER TABLE `accessruletimezone` DROP FOREIGN KEY `AccessRuleTimeZone_accessRuleId_fkey`;

-- DropForeignKey
ALTER TABLE `accessruletimezone` DROP FOREIGN KEY `AccessRuleTimeZone_timeZoneId_fkey`;

-- DropForeignKey
ALTER TABLE `areaaccessrule` DROP FOREIGN KEY `AreaAccessRule_accessRuleId_fkey`;

-- DropForeignKey
ALTER TABLE `areaaccessrule` DROP FOREIGN KEY `AreaAccessRule_areaId_fkey`;

-- DropForeignKey
ALTER TABLE `groupaccessrule` DROP FOREIGN KEY `GroupAccessRule_accessRuleId_fkey`;

-- DropForeignKey
ALTER TABLE `groupaccessrule` DROP FOREIGN KEY `GroupAccessRule_groupId_fkey`;

-- DropForeignKey
ALTER TABLE `membergroup` DROP FOREIGN KEY `MemberGroup_groupId_fkey`;

-- DropForeignKey
ALTER TABLE `membergroup` DROP FOREIGN KEY `MemberGroup_memberId_fkey`;

-- AddForeignKey
ALTER TABLE `MemberGroup` ADD CONSTRAINT `MemberGroup_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `Member`(`memberId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MemberGroup` ADD CONSTRAINT `MemberGroup_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `Group`(`groupId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GroupAccessRule` ADD CONSTRAINT `GroupAccessRule_accessRuleId_fkey` FOREIGN KEY (`accessRuleId`) REFERENCES `AccessRule`(`accessRuleId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GroupAccessRule` ADD CONSTRAINT `GroupAccessRule_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `Group`(`groupId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AccessRuleTimeZone` ADD CONSTRAINT `AccessRuleTimeZone_accessRuleId_fkey` FOREIGN KEY (`accessRuleId`) REFERENCES `AccessRule`(`accessRuleId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AccessRuleTimeZone` ADD CONSTRAINT `AccessRuleTimeZone_timeZoneId_fkey` FOREIGN KEY (`timeZoneId`) REFERENCES `TimeZone`(`timeZoneId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AreaAccessRule` ADD CONSTRAINT `AreaAccessRule_areaId_fkey` FOREIGN KEY (`areaId`) REFERENCES `Lobby`(`lobbyId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AreaAccessRule` ADD CONSTRAINT `AreaAccessRule_accessRuleId_fkey` FOREIGN KEY (`accessRuleId`) REFERENCES `AccessRule`(`accessRuleId`) ON DELETE CASCADE ON UPDATE CASCADE;
