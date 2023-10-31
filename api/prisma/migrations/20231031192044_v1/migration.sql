/*
  Warnings:

  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `profile` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `profile` DROP FOREIGN KEY `Profile_userId_fkey`;

-- AlterTable
ALTER TABLE `user` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    DROP COLUMN `role`,
    ADD COLUMN `password` VARCHAR(191) NOT NULL,
    ADD COLUMN `type` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
    ADD COLUMN `userId` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`userId`);

-- DropTable
DROP TABLE `profile`;

-- CreateTable
CREATE TABLE `Occurrence` (
    `ocurrenceId` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `status` ENUM('RESOLVED', 'PENDING') NOT NULL,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`ocurrenceId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Resident` (
    `residentId` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `rg` VARCHAR(191) NOT NULL,
    `cpf` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `faceAccess` BOOLEAN NOT NULL,
    `tagAccess` VARCHAR(191) NOT NULL,
    `passwordAccess` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `addressTypeId` INTEGER NOT NULL,
    `lobbyId` INTEGER NOT NULL,

    PRIMARY KEY (`residentId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Telephone` (
    `number` INTEGER NOT NULL,
    `residentId` INTEGER NOT NULL,

    PRIMARY KEY (`number`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Vehicle` (
    `vehicleId` INTEGER NOT NULL AUTO_INCREMENT,
    `licensePlate` VARCHAR(191) NOT NULL,
    `brand` VARCHAR(191) NOT NULL,
    `model` VARCHAR(191) NOT NULL,
    `color` VARCHAR(191) NOT NULL,
    `hexCode` VARCHAR(191) NOT NULL,
    `residentId` INTEGER NOT NULL,

    PRIMARY KEY (`vehicleId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AddressType` (
    `addressTypeId` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`addressTypeId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Lobby` (
    `lobbyId` INTEGER NOT NULL AUTO_INCREMENT,
    `cnpj` VARCHAR(191) NOT NULL,
    `responsible` VARCHAR(191) NOT NULL,
    `telephone` VARCHAR(191) NOT NULL,
    `schedules` VARCHAR(191) NOT NULL,
    `procedures` VARCHAR(191) NOT NULL,
    `datasheet` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`lobbyId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Visitor` (
    `visitorId` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `rg` VARCHAR(191) NOT NULL,
    `cpf` VARCHAR(191) NOT NULL,
    `visitorTypeId` INTEGER NOT NULL,

    PRIMARY KEY (`visitorId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VisitorType` (
    `visitorTypeId` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`visitorTypeId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Scheduling` (
    `shcedulingId` INTEGER NOT NULL AUTO_INCREMENT,
    `reason` VARCHAR(191) NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `visitorId` INTEGER NOT NULL,
    `lobbyId` INTEGER NOT NULL,
    `residentId` INTEGER NOT NULL,

    PRIMARY KEY (`shcedulingId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Access` (
    `accessId` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL,
    `type` ENUM('FACE', 'TAG', 'PASSWORD') NOT NULL,
    `residentId` INTEGER NOT NULL,
    `lobbyId` INTEGER NOT NULL,

    PRIMARY KEY (`accessId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LobbyProblem` (
    `lobbyProblemId` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `status` ENUM('RESOLVED', 'PENDING') NOT NULL,
    `lobbyId` INTEGER NOT NULL,

    PRIMARY KEY (`lobbyProblemId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Extension` (
    `extensionId` INTEGER NOT NULL AUTO_INCREMENT,
    `number` VARCHAR(191) NOT NULL,
    `lobbyId` INTEGER NOT NULL,

    PRIMARY KEY (`extensionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LobbyCalendar` (
    `lobbyCalendarId` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `lobbyId` INTEGER NOT NULL,

    PRIMARY KEY (`lobbyCalendarId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Occurrence` ADD CONSTRAINT `Occurrence_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Resident` ADD CONSTRAINT `Resident_addressTypeId_fkey` FOREIGN KEY (`addressTypeId`) REFERENCES `AddressType`(`addressTypeId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Resident` ADD CONSTRAINT `Resident_lobbyId_fkey` FOREIGN KEY (`lobbyId`) REFERENCES `Lobby`(`lobbyId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Telephone` ADD CONSTRAINT `Telephone_residentId_fkey` FOREIGN KEY (`residentId`) REFERENCES `Resident`(`residentId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Vehicle` ADD CONSTRAINT `Vehicle_residentId_fkey` FOREIGN KEY (`residentId`) REFERENCES `Resident`(`residentId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Visitor` ADD CONSTRAINT `Visitor_visitorTypeId_fkey` FOREIGN KEY (`visitorTypeId`) REFERENCES `VisitorType`(`visitorTypeId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Scheduling` ADD CONSTRAINT `Scheduling_visitorId_fkey` FOREIGN KEY (`visitorId`) REFERENCES `Visitor`(`visitorId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Scheduling` ADD CONSTRAINT `Scheduling_lobbyId_fkey` FOREIGN KEY (`lobbyId`) REFERENCES `Lobby`(`lobbyId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Scheduling` ADD CONSTRAINT `Scheduling_residentId_fkey` FOREIGN KEY (`residentId`) REFERENCES `Resident`(`residentId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Access` ADD CONSTRAINT `Access_residentId_fkey` FOREIGN KEY (`residentId`) REFERENCES `Resident`(`residentId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Access` ADD CONSTRAINT `Access_lobbyId_fkey` FOREIGN KEY (`lobbyId`) REFERENCES `Lobby`(`lobbyId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LobbyProblem` ADD CONSTRAINT `LobbyProblem_lobbyId_fkey` FOREIGN KEY (`lobbyId`) REFERENCES `Lobby`(`lobbyId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Extension` ADD CONSTRAINT `Extension_lobbyId_fkey` FOREIGN KEY (`lobbyId`) REFERENCES `Lobby`(`lobbyId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LobbyCalendar` ADD CONSTRAINT `LobbyCalendar_lobbyId_fkey` FOREIGN KEY (`lobbyId`) REFERENCES `Lobby`(`lobbyId`) ON DELETE RESTRICT ON UPDATE CASCADE;
