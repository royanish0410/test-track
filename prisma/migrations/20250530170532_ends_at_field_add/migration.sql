/*
  Warnings:

  - Added the required column `duration` to the `quizzes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endsAt` to the `quizzes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "quizzes" ADD COLUMN     "duration" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "endsAt" TIMESTAMP(3) NOT NULL;
