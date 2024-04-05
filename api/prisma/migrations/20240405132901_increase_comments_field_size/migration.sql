-- AlterTable
ALTER TABLE `access` MODIFY `comments` VARCHAR(500) NULL;

-- AlterTable
ALTER TABLE `lobby` MODIFY `procedures` VARCHAR(500) NULL;

-- AlterTable
ALTER TABLE `lobbycalendar` MODIFY `description` VARCHAR(500) NOT NULL;

-- AlterTable
ALTER TABLE `member` MODIFY `comments` VARCHAR(500) NULL;

-- AlterTable
ALTER TABLE `scheduling` MODIFY `comments` VARCHAR(500) NULL;

-- AlterTable
ALTER TABLE `vehicle` MODIFY `comments` VARCHAR(500) NULL;

-- AlterTable
ALTER TABLE `visitor` MODIFY `comments` VARCHAR(500) NULL;
