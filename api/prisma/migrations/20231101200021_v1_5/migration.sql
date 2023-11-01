/*
  Warnings:

  - A unique constraint covering the columns `[cnpj]` on the table `Lobby` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cpf]` on the table `Visitor` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `lobby` MODIFY `complement` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Lobby_cnpj_key` ON `Lobby`(`cnpj`);

-- CreateIndex
CREATE UNIQUE INDEX `Visitor_cpf_key` ON `Visitor`(`cpf`);
