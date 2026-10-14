-- AlterTable: ganti level (enum) jadi boolean is_fast_track
ALTER TABLE "Path" ADD COLUMN "isFastTrack" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Path" DROP COLUMN "level";

-- DropEnum
DROP TYPE "PathLevel";
