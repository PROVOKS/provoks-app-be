-- Siklus hidup percobaan kuis: mulai -> submit/expired.
-- QuizAttempt sudah ada; di sini ditambah nomor percobaan, status,
-- waktu mulai, durasi, dan penanda timeout.

CREATE TYPE "QuizAttemptStatus" AS ENUM ('IN_PROGRESS', 'SUBMITTED', 'EXPIRED');

ALTER TABLE "QuizAttempt" ALTER COLUMN "score" DROP NOT NULL;
ALTER TABLE "QuizAttempt" ALTER COLUMN "totalPoints" DROP NOT NULL;

ALTER TABLE "QuizAttempt" ALTER COLUMN "submittedAt" DROP DEFAULT;
ALTER TABLE "QuizAttempt" ALTER COLUMN "submittedAt" DROP NOT NULL;

ALTER TABLE "QuizAttempt" ADD COLUMN "attemptNumber" INTEGER;
ALTER TABLE "QuizAttempt" ADD COLUMN "status" "QuizAttemptStatus" NOT NULL DEFAULT 'SUBMITTED';
ALTER TABLE "QuizAttempt" ADD COLUMN "startedAt" TIMESTAMP(3);
ALTER TABLE "QuizAttempt" ADD COLUMN "durationSeconds" INTEGER;
ALTER TABLE "QuizAttempt" ADD COLUMN "timedOut" BOOLEAN NOT NULL DEFAULT false;

-- backfill data lama: nomor percobaan berdasarkan urutan submit
UPDATE "QuizAttempt" AS qa
SET "attemptNumber" = ranked.rn,
    "startedAt" = qa."submittedAt"
FROM (
  SELECT id,
         row_number() OVER (
           PARTITION BY "userId", "contentBlockId"
           ORDER BY "submittedAt" ASC
         ) AS rn
  FROM "QuizAttempt"
) AS ranked
WHERE qa.id = ranked.id;

UPDATE "QuizAttempt"
SET "attemptNumber" = 1
WHERE "attemptNumber" IS NULL;

UPDATE "QuizAttempt"
SET "startedAt" = COALESCE("submittedAt", now())
WHERE "startedAt" IS NULL;

ALTER TABLE "QuizAttempt" ALTER COLUMN "attemptNumber" SET NOT NULL;
ALTER TABLE "QuizAttempt" ALTER COLUMN "attemptNumber" SET DEFAULT 1;
ALTER TABLE "QuizAttempt" ALTER COLUMN "startedAt" SET NOT NULL;
ALTER TABLE "QuizAttempt" ALTER COLUMN "startedAt" SET DEFAULT CURRENT_TIMESTAMP;

CREATE UNIQUE INDEX "QuizAttempt_userId_contentBlockId_attemptNumber_key"
  ON "QuizAttempt"("userId", "contentBlockId", "attemptNumber");

CREATE INDEX "QuizAttempt_userId_contentBlockId_submittedAt_idx"
  ON "QuizAttempt"("userId", "contentBlockId", "submittedAt");
