/*
  Warnings:

  - The primary key for the `scheduling` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `shcedulingId` on the `scheduling` table. All the data in the column will be lost.
  - The primary key for the `telephone` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Made the column `visitorId` on table `access` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `schedulingId` to the `Scheduling` table without a default value. This is not possible if the table is not empty.
  - Added the required column `telephoneId` to the `Telephone` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `access` DROP FOREIGN KEY `Access_visitorId_fkey`;

-- AlterTable
ALTER TABLE `access` ADD COLUMN `comments` VARCHAR(191) NULL,
    MODIFY `visitorId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `lobbyproblem` MODIFY `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE `scheduling` DROP PRIMARY KEY,
    DROP COLUMN `shcedulingId`,
    ADD COLUMN `schedulingId` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`schedulingId`);

-- AlterTable
ALTER TABLE `telephone` DROP PRIMARY KEY,
    ADD COLUMN `telephoneId` INTEGER NOT NULL,
    MODIFY `number` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`telephoneId`);

-- AddForeignKey
ALTER TABLE `Access` ADD CONSTRAINT `Access_visitorId_fkey` FOREIGN KEY (`visitorId`) REFERENCES `Visitor`(`visitorId`) ON DELETE RESTRICT ON UPDATE CASCADE;
