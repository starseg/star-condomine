/*
  Warnings:

  - You are about to drop the column `action` on the `access` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `access` table. All the data in the column will be lost.
  - You are about to drop the column `residentId` on the `access` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `access` table. All the data in the column will be lost.
  - The values [RESOLVED,PENDING] on the enum `LobbyProblem_status` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `residentId` on the `scheduling` table. All the data in the column will be lost.
  - You are about to drop the column `residentId` on the `telephone` table. All the data in the column will be lost.
  - You are about to drop the column `hexCode` on the `vehicle` table. All the data in the column will be lost.
  - You are about to drop the column `residentId` on the `vehicle` table. All the data in the column will be lost.
  - You are about to drop the `extension` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `occurrence` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `resident` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[tag]` on the table `Vehicle` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `operatorId` to the `Access` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `Access` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Access` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Device` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ramal` to the `Device` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `DeviceModel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Lobby` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Lobby` table without a default value. This is not possible if the table is not empty.
  - Added the required column `operatorId` to the `LobbyProblem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `LobbyProblem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `LobbyProblem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `Scheduling` table without a default value. This is not possible if the table is not empty.
  - Added the required column `operatorId` to the `Scheduling` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Scheduling` table without a default value. This is not possible if the table is not empty.
  - Added the required column `memberId` to the `Telephone` table without a default value. This is not possible if the table is not empty.
  - Added the required column `memberId` to the `Vehicle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vehicleTypeId` to the `Vehicle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `Visitor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Visitor` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `access` DROP FOREIGN KEY `Access_residentId_fkey`;

-- DropForeignKey
ALTER TABLE `extension` DROP FOREIGN KEY `Extension_lobbyId_fkey`;

-- DropForeignKey
ALTER TABLE `occurrence` DROP FOREIGN KEY `Occurrence_userId_fkey`;

-- DropForeignKey
ALTER TABLE `resident` DROP FOREIGN KEY `Resident_addressTypeId_fkey`;

-- DropForeignKey
ALTER TABLE `resident` DROP FOREIGN KEY `Resident_lobbyId_fkey`;

-- DropForeignKey
ALTER TABLE `scheduling` DROP FOREIGN KEY `Scheduling_residentId_fkey`;

-- DropForeignKey
ALTER TABLE `telephone` DROP FOREIGN KEY `Telephone_residentId_fkey`;

-- DropForeignKey
ALTER TABLE `vehicle` DROP FOREIGN KEY `Vehicle_residentId_fkey`;

-- DropIndex
DROP INDEX `Vehicle_hexCode_key` ON `vehicle`;

-- AlterTable
ALTER TABLE `access` DROP COLUMN `action`,
    DROP COLUMN `date`,
    DROP COLUMN `residentId`,
    DROP COLUMN `type`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `endTime` DATETIME(3) NULL,
    ADD COLUMN `memberId` INTEGER NULL,
    ADD COLUMN `operatorId` INTEGER NOT NULL,
    ADD COLUMN `startTime` DATETIME(3) NOT NULL,
    ADD COLUMN `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `device` ADD COLUMN `description` VARCHAR(191) NOT NULL,
    ADD COLUMN `ramal` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `devicemodel` ADD COLUMN `description` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `lobby` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `type` ENUM('CONDOMINIUM', 'COMPANY') NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `lobbyproblem` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `operatorId` INTEGER NOT NULL,
    ADD COLUMN `title` VARCHAR(191) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL;

-- AlterTable
ALTER TABLE `scheduling` DROP COLUMN `residentId`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `location` VARCHAR(191) NOT NULL,
    ADD COLUMN `memberId` INTEGER NULL,
    ADD COLUMN `operatorId` INTEGER NOT NULL,
    ADD COLUMN `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `telephone` DROP COLUMN `residentId`,
    ADD COLUMN `memberId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `vehicle` DROP COLUMN `hexCode`,
    DROP COLUMN `residentId`,
    ADD COLUMN `comments` VARCHAR(191) NULL,
    ADD COLUMN `memberId` INTEGER NOT NULL,
    ADD COLUMN `tag` VARCHAR(191) NULL,
    ADD COLUMN `vehicleTypeId` INTEGER NOT NULL,
    MODIFY `brand` VARCHAR(191) NULL,
    MODIFY `model` VARCHAR(191) NULL,
    MODIFY `color` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `visitor` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `endDate` DATETIME(3) NULL,
    ADD COLUMN `phone` VARCHAR(191) NOT NULL,
    ADD COLUMN `profileUrl` VARCHAR(191) NULL,
    ADD COLUMN `relation` VARCHAR(191) NULL,
    ADD COLUMN `startDate` DATETIME(3) NULL,
    ADD COLUMN `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- DropTable
DROP TABLE `extension`;

-- DropTable
DROP TABLE `occurrence`;

-- DropTable
DROP TABLE `resident`;

-- DropTable
DROP TABLE `user`;

-- CreateTable
CREATE TABLE `Operator` (
    `operatorId` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `type` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Operator_username_key`(`username`),
    PRIMARY KEY (`operatorId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Member` (
    `memberId` INTEGER NOT NULL AUTO_INCREMENT,
    `type` ENUM('RESIDENT', 'EMPLOYEE') NOT NULL,
    `profileUrl` VARCHAR(191) NULL,
    `name` VARCHAR(191) NOT NULL,
    `rg` VARCHAR(191) NOT NULL,
    `cpf` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `comments` VARCHAR(191) NULL,
    `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    `faceAccess` VARCHAR(191) NULL,
    `biometricAccess` VARCHAR(191) NULL,
    `remoteControlAccess` VARCHAR(191) NULL,
    `passwordAccess` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `addressTypeId` INTEGER NULL,
    `accessPeriod` VARCHAR(191) NULL,
    `position` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `lobbyId` INTEGER NOT NULL,

    UNIQUE INDEX `Member_cpf_key`(`cpf`),
    PRIMARY KEY (`memberId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TagType` (
    `tagTypeId` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`tagTypeId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tag` (
    `tagId` INTEGER NOT NULL AUTO_INCREMENT,
    `value` VARCHAR(191) NOT NULL,
    `tagTypeId` INTEGER NOT NULL,
    `memberId` INTEGER NOT NULL,

    PRIMARY KEY (`tagId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VehicleType` (
    `vehicleTypeId` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`vehicleTypeId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Vehicle_tag_key` ON `Vehicle`(`tag`);

-- AddForeignKey
ALTER TABLE `Member` ADD CONSTRAINT `Member_addressTypeId_fkey` FOREIGN KEY (`addressTypeId`) REFERENCES `AddressType`(`addressTypeId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Member` ADD CONSTRAINT `Member_lobbyId_fkey` FOREIGN KEY (`lobbyId`) REFERENCES `Lobby`(`lobbyId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Telephone` ADD CONSTRAINT `Telephone_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `Member`(`memberId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tag` ADD CONSTRAINT `Tag_tagTypeId_fkey` FOREIGN KEY (`tagTypeId`) REFERENCES `TagType`(`tagTypeId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tag` ADD CONSTRAINT `Tag_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `Member`(`memberId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Vehicle` ADD CONSTRAINT `Vehicle_vehicleTypeId_fkey` FOREIGN KEY (`vehicleTypeId`) REFERENCES `VehicleType`(`vehicleTypeId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Vehicle` ADD CONSTRAINT `Vehicle_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `Member`(`memberId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Scheduling` ADD CONSTRAINT `Scheduling_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `Member`(`memberId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Scheduling` ADD CONSTRAINT `Scheduling_operatorId_fkey` FOREIGN KEY (`operatorId`) REFERENCES `Operator`(`operatorId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Access` ADD CONSTRAINT `Access_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `Member`(`memberId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Access` ADD CONSTRAINT `Access_operatorId_fkey` FOREIGN KEY (`operatorId`) REFERENCES `Operator`(`operatorId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LobbyProblem` ADD CONSTRAINT `LobbyProblem_operatorId_fkey` FOREIGN KEY (`operatorId`) REFERENCES `Operator`(`operatorId`) ON DELETE RESTRICT ON UPDATE CASCADE;
