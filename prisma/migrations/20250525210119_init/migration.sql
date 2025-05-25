/*
  Warnings:

  - You are about to drop the column `questionmodelid` on the `quizzes` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userid,quizid]` on the table `quiz_attempts` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "quizzes" DROP COLUMN "questionmodelid";

-- CreateIndex
CREATE UNIQUE INDEX "quiz_attempts_userid_quizid_key" ON "quiz_attempts"("userid", "quizid");
