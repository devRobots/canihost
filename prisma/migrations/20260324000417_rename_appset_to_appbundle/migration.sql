-- CreateTable
CREATE TABLE "Machine" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "brand" TEXT,
    "cpuCores" INTEGER NOT NULL,
    "memoryRamGb" REAL NOT NULL,
    "targetAudience" TEXT,
    "useCases" TEXT,
    "specialTech" TEXT,
    "technicalSpecs" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "cpuCost" REAL NOT NULL,
    "ramCostGb" REAL NOT NULL,
    "isCloudRecommended" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT,
    "minRequirements" TEXT,
    "recRequirements" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "AppBundle" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "_AppBundleToService" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_AppBundleToService_A_fkey" FOREIGN KEY ("A") REFERENCES "AppBundle" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_AppBundleToService_B_fkey" FOREIGN KEY ("B") REFERENCES "Service" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_AppBundleToService_AB_unique" ON "_AppBundleToService"("A", "B");

-- CreateIndex
CREATE INDEX "_AppBundleToService_B_index" ON "_AppBundleToService"("B");
