/*
  Warnings:

  - A unique constraint covering the columns `[gameId]` on the table `CompetitionRecord` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `schedule` to the `Competition` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Competitor" (
    "competitionId" INTEGER NOT NULL,
    "playerId" INTEGER NOT NULL,
    "competitorId" INTEGER NOT NULL,

    PRIMARY KEY ("competitionId", "playerId"),
    CONSTRAINT "Competitor_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "Competition" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Competitor_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Competition" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "schedule" INTEGER NOT NULL,
    "time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isValid" BOOLEAN NOT NULL DEFAULT true
);
INSERT INTO "new_Competition" ("id", "isValid", "name", "time", "type") SELECT "id", "isValid", "name", "time", "type" FROM "Competition";
DROP TABLE "Competition";
ALTER TABLE "new_Competition" RENAME TO "Competition";
CREATE UNIQUE INDEX "Competition_name_key" ON "Competition"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Competitor_competitionId_competitorId_key" ON "Competitor"("competitionId", "competitorId");

-- CreateIndex
CREATE UNIQUE INDEX "CompetitionRecord_gameId_key" ON "CompetitionRecord"("gameId");
