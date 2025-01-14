/*
  Warnings:

  - Added the required column `name` to the `Competition` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Competition" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isValid" BOOLEAN NOT NULL DEFAULT true
);
INSERT INTO "new_Competition" ("id", "isValid", "time", "type") SELECT "id", "isValid", "time", "type" FROM "Competition";
DROP TABLE "Competition";
ALTER TABLE "new_Competition" RENAME TO "Competition";
CREATE UNIQUE INDEX "Competition_name_key" ON "Competition"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
