/*
  Warnings:

  - You are about to drop the `CompetitionRecord` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "CompetitionRecord_gameId_key";

-- DropIndex
DROP INDEX "CompetitionScoreRecord_gameId_playerId_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "CompetitionRecord";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Game" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isValid" BOOLEAN NOT NULL DEFAULT true,
    "type" TEXT NOT NULL,
    "competitionId" INTEGER,
    CONSTRAINT "Game_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "Competition" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Game" ("id", "isValid", "time", "type") SELECT "id", "isValid", "time", "type" FROM "Game";
DROP TABLE "Game";
ALTER TABLE "new_Game" RENAME TO "Game";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
