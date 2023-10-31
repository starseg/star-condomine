/*
  Warnings:

  - Added the required column `action` to the `Access` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Extension` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ip` to the `Extension` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `access` DROP FOREIGN KEY `Access_residentId_fkey`;

-- AlterTable
ALTER TABLE `access` ADD COLUMN `action` ENUM('INPUT', 'OUTPUT') NOT NULL,
    ADD COLUMN `local` VARCHAR(191) NULL,
    ADD COLUMN `reason` VARCHAR(191) NULL,
    ADD COLUMN `visitorId` INTEGER NULL,
    MODIFY `type` ENUM('FACE', 'TAG', 'PASSWORD', 'INTERN') NOT NULL,
    MODIFY `residentId` INTEGER NULL;

-- AlterTable
ALTER TABLE `extension` ADD COLUMN `description` VARCHAR(191) NOT NULL,
    ADD COLUMN `ip` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `visitor` ADD COLUMN `company` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Access` ADD CONSTRAINT `Access_residentId_fkey` FOREIGN KEY (`residentId`) REFERENCES `Resident`(`residentId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Access` ADD CONSTRAINT `Access_visitorId_fkey` FOREIGN KEY (`visitorId`) REFERENCES `Visitor`(`visitorId`) ON DELETE SET NULL ON UPDATE CASCADE;
