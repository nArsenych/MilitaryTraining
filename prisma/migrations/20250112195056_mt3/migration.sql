-- AlterTable
ALTER TABLE `Profile` MODIFY `full_name` VARCHAR(191) NULL,
    MODIFY `isMilitary` BOOLEAN NULL DEFAULT false;
