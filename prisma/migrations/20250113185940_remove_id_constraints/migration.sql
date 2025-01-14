/*
  Warnings:

  - The primary key for the `CompetitionScoreRecord` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Competitor` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `GameRecord` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CompetitionScoreRecord" (
    "playerId" INTEGER NOT NULL,
    "gameId" INTEGER NOT NULL,
    "points" INTEGER NOT NULL,
    CONSTRAINT "CompetitionScoreRecord_gameId_playerId_fkey" FOREIGN KEY ("gameId", "playerId") REFERENCES "GameRecord" ("gameId", "playerId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CompetitionScoreRecord" ("gameId", "playerId", "points") SELECT "gameId", "playerId", "points" FROM "CompetitionScoreRecord";
DROP TABLE "CompetitionScoreRecord";
ALTER TABLE "new_CompetitionScoreRecord" RENAME TO "CompetitionScoreRecord";
CREATE UNIQUE INDEX "CompetitionScoreRecord_gameId_playerId_key" ON "CompetitionScoreRecord"("gameId", "playerId");
CREATE TABLE "new_Competitor" (
    "competitionId" INTEGER NOT NULL,
    "playerId" INTEGER NOT NULL,
    "competitorId" INTEGER NOT NULL,
    CONSTRAINT "Competitor_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "Competition" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Competitor_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Competitor" ("competitionId", "competitorId", "playerId") SELECT "competitionId", "competitorId", "playerId" FROM "Competitor";
DROP TABLE "Competitor";
ALTER TABLE "new_Competitor" RENAME TO "Competitor";
CREATE UNIQUE INDEX "Competitor_competitionId_playerId_key" ON "Competitor"("competitionId", "playerId");
CREATE UNIQUE INDEX "Competitor_competitionId_competitorId_key" ON "Competitor"("competitionId", "competitorId");
CREATE TABLE "new_GameRecord" (
    "gameId" INTEGER NOT NULL,
    "playerId" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "rank" INTEGER NOT NULL,
    "positionOnStart" TEXT NOT NULL,
    CONSTRAINT "GameRecord_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "GameRecord_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_GameRecord" ("gameId", "playerId", "positionOnStart", "rank", "score") SELECT "gameId", "playerId", "positionOnStart", "rank", "score" FROM "GameRecord";
DROP TABLE "GameRecord";
ALTER TABLE "new_GameRecord" RENAME TO "GameRecord";
CREATE UNIQUE INDEX "GameRecord_gameId_playerId_key" ON "GameRecord"("gameId", "playerId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
