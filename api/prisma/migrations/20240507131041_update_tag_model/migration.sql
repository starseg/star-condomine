-- AlterTable
ALTER TABLE `tag` ADD COLUMN `comments` VARCHAR(500) NULL,
    ADD COLUMN `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE';