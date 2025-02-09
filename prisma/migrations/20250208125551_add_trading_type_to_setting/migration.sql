/*
  Warnings:

  - You are about to drop the `TradingSetting2` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[seconds,tradingType]` on the table `TradingSetting` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `TradingSetting` ADD COLUMN `tradingType` ENUM('SHORT', 'LONG') NOT NULL DEFAULT 'SHORT';

-- DropTable
DROP TABLE `TradingSetting2`;

-- CreateIndex
CREATE UNIQUE INDEX `TradingSetting_seconds_tradingType_key` ON `TradingSetting`(`seconds`, `tradingType`);
