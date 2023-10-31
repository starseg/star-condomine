/*
  Warnings:

  - Added the required column `cep` to the `Lobby` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `Lobby` table without a default value. This is not possible if the table is not empty.
  - Added the required column `complement` to the `Lobby` table without a default value. This is not possible if the table is not empty.
  - Added the required column `neighborhood` to the `Lobby` table without a default value. This is not possible if the table is not empty.
  - Added the required column `number` to the `Lobby` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Lobby` table without a default value. This is not possible if the table is not empty.
  - Added the required column `street` to the `Lobby` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `lobby` ADD COLUMN `cep` VARCHAR(191) NOT NULL,
    ADD COLUMN `city` VARCHAR(191) NOT NULL,
    ADD COLUMN `complement` VARCHAR(191) NOT NULL,
    ADD COLUMN `neighborhood` VARCHAR(191) NOT NULL,
    ADD COLUMN `number` VARCHAR(191) NOT NULL,
    ADD COLUMN `state` VARCHAR(191) NOT NULL,
    ADD COLUMN `street` VARCHAR(191) NOT NULL;
