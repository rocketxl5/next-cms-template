/*
  Warnings:

  - The `body` column on the `ContentItem` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropForeignKey
ALTER TABLE "ContentItem" DROP CONSTRAINT "ContentItem_authorId_fkey";

-- AlterTable
ALTER TABLE "ContentItem" ADD COLUMN     "meta" JSONB,
ADD COLUMN     "parentId" TEXT,
ALTER COLUMN "title" DROP NOT NULL,
ALTER COLUMN "slug" DROP NOT NULL,
DROP COLUMN "body",
ADD COLUMN     "body" JSONB,
ALTER COLUMN "authorId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ContentItem" ADD CONSTRAINT "ContentItem_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentItem" ADD CONSTRAINT "ContentItem_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "ContentItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;
