-- DropForeignKey
ALTER TABLE `Tag` DROP FOREIGN KEY `Tag_memberId_fkey`;

-- DropForeignKey
ALTER TABLE `Telephone` DROP FOREIGN KEY `Telephone_memberId_fkey`;

-- DropForeignKey
ALTER TABLE `Vehicle` DROP FOREIGN KEY `Vehicle_memberId_fkey`;

-- AddForeignKey
ALTER TABLE `Telephone` ADD CONSTRAINT `Telephone_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `Member`(`memberId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tag` ADD CONSTRAINT `Tag_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `Member`(`memberId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Vehicle` ADD CONSTRAINT `Vehicle_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `Member`(`memberId`) ON DELETE CASCADE ON UPDATE CASCADE;
