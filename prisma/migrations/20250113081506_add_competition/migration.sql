-- CreateTable
CREATE TABLE "Competition" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isValid" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "CompetitionRecord" (
    "competitionId" INTEGER NOT NULL,
    "gameId" INTEGER NOT NULL,

    PRIMARY KEY ("competitionId", "gameId"),
    CONSTRAINT "CompetitionRecord_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "Competition" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CompetitionRecord_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CompetitionScoreRecord" (
    "playerId" INTEGER NOT NULL,
    "gameId" INTEGER NOT NULL,
    "points" INTEGER NOT NULL,

    PRIMARY KEY ("gameId", "playerId"),
    CONSTRAINT "CompetitionScoreRecord_gameId_playerId_fkey" FOREIGN KEY ("gameId", "playerId") REFERENCES "GameRecord" ("gameId", "playerId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "CompetitionScoreRecord_gameId_playerId_key" ON "CompetitionScoreRecord"("gameId", "playerId");
