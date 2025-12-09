-- AlterTable
ALTER TABLE "ContentItem" ADD COLUMN     "isSeed" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isSeed" BOOLEAN NOT NULL DEFAULT false;
