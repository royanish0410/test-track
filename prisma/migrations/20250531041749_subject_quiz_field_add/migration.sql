/*
  Warnings:

  - Added the required column `name` to the `quizzes` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `duration` on the `quizzes` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "quizzes" ADD COLUMN     "name" TEXT NOT NULL,
DROP COLUMN "duration",
ADD COLUMN     "duration" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "subjects" ADD COLUMN     "imagelink" TEXT;
