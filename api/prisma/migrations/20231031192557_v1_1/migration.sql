/*
  Warnings:

  - You are about to alter the column `faceAccess` on the `resident` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `lobby` MODIFY `procedures` VARCHAR(191) NULL,
    MODIFY `datasheet` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `resident` MODIFY `faceAccess` VARCHAR(191) NULL,
    MODIFY `tagAccess` VARCHAR(191) NULL,
    MODIFY `passwordAccess` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `vehicle` MODIFY `hexCode` VARCHAR(191) NULL;
