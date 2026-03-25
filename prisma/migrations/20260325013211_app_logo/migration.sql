/*
  Warnings:

  - You are about to alter the column `minCPU` on the `App` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Int`.
  - You are about to alter the column `recommendedCPU` on the `App` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Int`.
  - Added the required column `logoUrl` to the `App` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `App` required. This step will fail if there are existing NULL values in that column.
  - Made the column `longDescription` on table `App` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_App" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "minCPU" INTEGER NOT NULL,
    "recommendedCPU" INTEGER NOT NULL,
    "minRAM" REAL NOT NULL,
    "recommendedRAM" REAL NOT NULL,
    "isCloudRecommended" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT NOT NULL,
    "longDescription" TEXT NOT NULL,
    "logoUrl" TEXT NOT NULL,
    "officialUrl" TEXT,
    "cubepathUrl" TEXT,
    "dockerRegistryUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_App" ("category", "createdAt", "cubepathUrl", "description", "dockerRegistryUrl", "id", "isCloudRecommended", "longDescription", "minCPU", "minRAM", "name", "officialUrl", "recommendedCPU", "recommendedRAM", "updatedAt") SELECT "category", "createdAt", "cubepathUrl", "description", "dockerRegistryUrl", "id", "isCloudRecommended", "longDescription", "minCPU", "minRAM", "name", "officialUrl", "recommendedCPU", "recommendedRAM", "updatedAt" FROM "App";
DROP TABLE "App";
ALTER TABLE "new_App" RENAME TO "App";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
