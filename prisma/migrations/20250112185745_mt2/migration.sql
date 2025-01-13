/*
  Warnings:

  - You are about to drop the `StripeCustomer` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `Purchase` ALTER COLUMN `updatedAt` DROP DEFAULT;

-- DropTable
DROP TABLE `StripeCustomer`;

-- CreateTable
CREATE TABLE `Profile` (
    `id` VARCHAR(191) NOT NULL,
    `full_name` VARCHAR(191) NOT NULL,
    `isOrganization` BOOLEAN NOT NULL DEFAULT false,
    `description` TEXT NULL,
    `age` INTEGER NULL,
    `phone_number` TEXT NULL,
    `instagram` TEXT NULL,
    `telegram` TEXT NULL,
    `facebook` TEXT NULL,
    `isMilitary` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `Profile_full_name_key`(`full_name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Purchase_customerId_idx` ON `Purchase`(`customerId`);
