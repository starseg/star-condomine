-- CreateTable
CREATE TABLE `VisitorGroup` (
    `visitorGroupId` INTEGER NOT NULL AUTO_INCREMENT,
    `visitorId` INTEGER NOT NULL,
    `groupId` INTEGER NOT NULL,

    PRIMARY KEY (`visitorGroupId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `VisitorGroup` ADD CONSTRAINT `VisitorGroup_visitorId_fkey` FOREIGN KEY (`visitorId`) REFERENCES `Visitor`(`visitorId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VisitorGroup` ADD CONSTRAINT `VisitorGroup_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `Group`(`groupId`) ON DELETE CASCADE ON UPDATE CASCADE;
