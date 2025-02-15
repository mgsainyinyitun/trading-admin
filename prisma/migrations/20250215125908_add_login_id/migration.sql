/*
  Warnings:

  - A unique constraint covering the columns `[loginId]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `loginId` to the `Customer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `account` MODIFY `currency` VARCHAR(191) NOT NULL DEFAULT 'USDT';

-- AlterTable
ALTER TABLE `customer` ADD COLUMN `loginId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `winrate` MODIFY `winRate` DOUBLE NOT NULL DEFAULT 0.5;

-- CreateIndex
CREATE UNIQUE INDEX `Customer_loginId_key` ON `Customer`(`loginId`);
