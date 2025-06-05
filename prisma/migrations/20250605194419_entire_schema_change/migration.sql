/*
  Warnings:

  - You are about to drop the column `correctone` on the `questions` table. All the data in the column will be lost.
  - You are about to drop the column `heading` on the `questions` table. All the data in the column will be lost.
  - You are about to drop the column `quizid` on the `questions` table. All the data in the column will be lost.
  - You are about to drop the column `imagelink` on the `subjects` table. All the data in the column will be lost.
  - You are about to drop the `quiz_attempts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `quizzes` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `correctOne` to the `questions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `questions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `subjects` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AttemptStatus" AS ENUM ('PASSED', 'FAILED', 'DISQUALIFIED');

-- DropForeignKey
ALTER TABLE "questions" DROP CONSTRAINT "questions_quizid_fkey";

-- DropForeignKey
ALTER TABLE "quiz_attempts" DROP CONSTRAINT "quiz_attempts_quizid_fkey";

-- DropForeignKey
ALTER TABLE "quiz_attempts" DROP CONSTRAINT "quiz_attempts_userid_fkey";

-- DropForeignKey
ALTER TABLE "quizzes" DROP CONSTRAINT "quizzes_subjectid_fkey";

-- DropForeignKey
ALTER TABLE "quizzes" DROP CONSTRAINT "quizzes_teacherid_fkey";

-- DropIndex
DROP INDEX "subjects_name_key";

-- AlterTable
ALTER TABLE "questions" DROP COLUMN "correctone",
DROP COLUMN "heading",
DROP COLUMN "quizid",
ADD COLUMN     "correctOne" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "question" TEXT,
ADD COLUMN     "questionImg" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "subjects" DROP COLUMN "imagelink",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "imgUrl" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "quiz_attempts";

-- DropTable
DROP TABLE "quizzes";

-- CreateTable
CREATE TABLE "mock_quizzes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL,
    "teacherId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mock_quizzes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mock_quiz_attempts" (
    "id" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "status" "AttemptStatus" NOT NULL,
    "studentId" TEXT NOT NULL,
    "mockQuizId" TEXT NOT NULL,
    "totalQuestions" INTEGER,
    "correctAnswers" INTEGER NOT NULL,
    "wrongAnswers" INTEGER NOT NULL,
    "attemptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "mock_quiz_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_answers" (
    "id" TEXT NOT NULL,
    "mockQuizAttemptId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "selectedAnswer" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "timeSpent" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "student_answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_sections" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "subjectId" TEXT NOT NULL,
    "mockQuizId" TEXT NOT NULL,

    CONSTRAINT "quiz_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question_subjects" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,

    CONSTRAINT "question_subjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question_sections" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "quizSectionId" TEXT NOT NULL,

    CONSTRAINT "question_sections_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "mock_quiz_attempts_studentId_mockQuizId_key" ON "mock_quiz_attempts"("studentId", "mockQuizId");

-- CreateIndex
CREATE UNIQUE INDEX "student_answers_questionId_mockQuizAttemptId_key" ON "student_answers"("questionId", "mockQuizAttemptId");

-- CreateIndex
CREATE UNIQUE INDEX "question_subjects_questionId_subjectId_key" ON "question_subjects"("questionId", "subjectId");

-- CreateIndex
CREATE UNIQUE INDEX "question_sections_questionId_quizSectionId_key" ON "question_sections"("questionId", "quizSectionId");

-- AddForeignKey
ALTER TABLE "mock_quizzes" ADD CONSTRAINT "mock_quizzes_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mock_quiz_attempts" ADD CONSTRAINT "mock_quiz_attempts_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mock_quiz_attempts" ADD CONSTRAINT "mock_quiz_attempts_mockQuizId_fkey" FOREIGN KEY ("mockQuizId") REFERENCES "mock_quizzes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_answers" ADD CONSTRAINT "student_answers_mockQuizAttemptId_fkey" FOREIGN KEY ("mockQuizAttemptId") REFERENCES "mock_quiz_attempts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_answers" ADD CONSTRAINT "student_answers_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_sections" ADD CONSTRAINT "quiz_sections_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_sections" ADD CONSTRAINT "quiz_sections_mockQuizId_fkey" FOREIGN KEY ("mockQuizId") REFERENCES "mock_quizzes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_subjects" ADD CONSTRAINT "question_subjects_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_subjects" ADD CONSTRAINT "question_subjects_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_sections" ADD CONSTRAINT "question_sections_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_sections" ADD CONSTRAINT "question_sections_quizSectionId_fkey" FOREIGN KEY ("quizSectionId") REFERENCES "quiz_sections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
