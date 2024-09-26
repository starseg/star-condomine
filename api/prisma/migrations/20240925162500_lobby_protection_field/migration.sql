/*
  Warnings:

  - You are about to drop the column `protected` on the `lobby` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `lobby` DROP COLUMN `protected`,
    ADD COLUMN `protection` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'INACTIVE';
