-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL,
    "siteName" TEXT NOT NULL,
    "theme" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "itemsPerPage" INTEGER NOT NULL,
    "maintenance" BOOLEAN NOT NULL,
    "allowRegistration" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);
