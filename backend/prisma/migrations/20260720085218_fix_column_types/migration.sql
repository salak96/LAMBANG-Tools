-- AlterTable
ALTER TABLE `toollink` MODIFY `url` TEXT NOT NULL,
    MODIFY `thumbnail` TEXT NULL;

-- AlterTable
ALTER TABLE `video` MODIFY `thumbnail` TEXT NULL,
    MODIFY `url` TEXT NOT NULL;
