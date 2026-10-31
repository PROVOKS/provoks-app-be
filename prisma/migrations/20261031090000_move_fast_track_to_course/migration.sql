-- Tipe (Reguler / Fast Track) pindah dari Path ke Course.
-- Path lama yang Fast Track diteruskan ke course-course di dalamnya.

ALTER TABLE "Course" ADD COLUMN "isFastTrack" BOOLEAN NOT NULL DEFAULT false;

UPDATE "Course" AS c
SET "isFastTrack" = true
FROM "Path" AS p
WHERE c."pathId" = p."id" AND p."isFastTrack" = true;

ALTER TABLE "Path" DROP COLUMN "isFastTrack";
