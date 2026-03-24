-- CreateTable
CREATE TABLE "Host" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "HostVariant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "cpuCores" INTEGER NOT NULL,
    "memoryRamGb" REAL NOT NULL,
    "hostId" TEXT NOT NULL,
    CONSTRAINT "HostVariant_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "Host" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "App" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "minCPU" REAL NOT NULL,
    "recommendedCPU" REAL NOT NULL,
    "minRAM" REAL NOT NULL,
    "recommendedRAM" REAL NOT NULL,
    "isCloudRecommended" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT,
    "longDescription" TEXT,
    "officialUrl" TEXT,
    "cubepathUrl" TEXT,
    "dockerRegistryUrl" TEXT,
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
CREATE TABLE "_AppToAppBundle" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_AppToAppBundle_A_fkey" FOREIGN KEY ("A") REFERENCES "App" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_AppToAppBundle_B_fkey" FOREIGN KEY ("B") REFERENCES "AppBundle" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_AppToAppBundle_AB_unique" ON "_AppToAppBundle"("A", "B");

-- CreateIndex
CREATE INDEX "_AppToAppBundle_B_index" ON "_AppToAppBundle"("B");
