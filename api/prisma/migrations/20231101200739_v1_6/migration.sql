/*
  Warnings:

  - A unique constraint covering the columns `[cpf]` on the table `Resident` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `Resident` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[licensePlate]` on the table `Vehicle` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[hexCode]` on the table `Vehicle` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Resident_cpf_key` ON `Resident`(`cpf`);

-- CreateIndex
CREATE UNIQUE INDEX `Resident_email_key` ON `Resident`(`email`);

-- CreateIndex
CREATE UNIQUE INDEX `Vehicle_licensePlate_key` ON `Vehicle`(`licensePlate`);

-- CreateIndex
CREATE UNIQUE INDEX `Vehicle_hexCode_key` ON `Vehicle`(`hexCode`);
