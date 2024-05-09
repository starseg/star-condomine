-- AlterTable
ALTER TABLE `access` MODIFY `comments` VARCHAR(1000) NULL;

-- AlterTable
ALTER TABLE `device` MODIFY `description` VARCHAR(1000) NOT NULL;

-- AlterTable
ALTER TABLE `devicemodel` MODIFY `description` VARCHAR(500) NOT NULL;

-- AlterTable
ALTER TABLE `lobbycalendar` MODIFY `description` VARCHAR(1000) NOT NULL;

-- AlterTable
ALTER TABLE `member` MODIFY `comments` VARCHAR(1000) NULL;

-- AlterTable
ALTER TABLE `scheduling` MODIFY `comments` VARCHAR(1000) NULL;

-- AlterTable
ALTER TABLE `tag` MODIFY `comments` VARCHAR(1000) NULL;

-- AlterTable
ALTER TABLE `vehicle` MODIFY `comments` VARCHAR(1000) NULL;

-- AlterTable
ALTER TABLE `visitor` MODIFY `comments` VARCHAR(1000) NULL;
