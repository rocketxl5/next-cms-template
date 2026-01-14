/*
  Warnings:

  - You are about to drop the column `allowRegistration` on the `Settings` table. All the data in the column will be lost.
  - You are about to drop the column `currency` on the `Settings` table. All the data in the column will be lost.
  - You are about to drop the column `itemsPerPage` on the `Settings` table. All the data in the column will be lost.
  - You are about to drop the column `maintenance` on the `Settings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Settings" DROP COLUMN "allowRegistration",
DROP COLUMN "currency",
DROP COLUMN "itemsPerPage",
DROP COLUMN "maintenance",
ALTER COLUMN "id" SET DEFAULT 'global',
ALTER COLUMN "siteName" SET DEFAULT 'CMS + E-commerce Template',
ALTER COLUMN "theme" SET DEFAULT 'light',
ALTER COLUMN "contactEmail" SET DEFAULT 'admin@example.com';
