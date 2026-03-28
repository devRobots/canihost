-- CreateEnum
CREATE TYPE "HostType" AS ENUM ('MINI_PC', 'VPS', 'CUSTOM');

-- CreateTable
CREATE TABLE "Host" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "HostType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Host_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HostVariant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cpuCores" INTEGER NOT NULL,
    "memoryRamGb" DOUBLE PRECISION NOT NULL,
    "hostId" TEXT NOT NULL,

    CONSTRAINT "HostVariant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "App" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "minCPU" INTEGER NOT NULL,
    "recommendedCPU" INTEGER NOT NULL,
    "minRAM" DOUBLE PRECISION NOT NULL,
    "recommendedRAM" DOUBLE PRECISION NOT NULL,
    "isCloudRecommended" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT NOT NULL,
    "longDescription" TEXT NOT NULL,
    "logoUrl" TEXT NOT NULL,
    "officialUrl" TEXT,
    "cubepathUrl" TEXT,
    "dockerRegistryUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "App_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppBundle" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppBundle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AppToAppBundle" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AppToAppBundle_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_AppToAppBundle_B_index" ON "_AppToAppBundle"("B");

-- AddForeignKey
ALTER TABLE "HostVariant" ADD CONSTRAINT "HostVariant_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "Host"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AppToAppBundle" ADD CONSTRAINT "_AppToAppBundle_A_fkey" FOREIGN KEY ("A") REFERENCES "App"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AppToAppBundle" ADD CONSTRAINT "_AppToAppBundle_B_fkey" FOREIGN KEY ("B") REFERENCES "AppBundle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
