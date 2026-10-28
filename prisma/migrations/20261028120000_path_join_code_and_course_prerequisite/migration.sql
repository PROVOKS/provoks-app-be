-- Kode bergabung ke path
CREATE TABLE "PathJoinCode" (
    "id" TEXT NOT NULL,
    "pathId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PathJoinCode_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "PathJoinCode_code_key" ON "PathJoinCode"("code");
CREATE INDEX "PathJoinCode_pathId_idx" ON "PathJoinCode"("pathId");

ALTER TABLE "PathJoinCode" ADD CONSTRAINT "PathJoinCode_pathId_fkey" FOREIGN KEY ("pathId") REFERENCES "Path"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Catatan percobaan memasukkan kode (anti brute force)
CREATE TABLE "PathJoinAttempt" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "success" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PathJoinAttempt_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "PathJoinAttempt_userId_createdAt_idx" ON "PathJoinAttempt"("userId", "createdAt");

ALTER TABLE "PathJoinAttempt" ADD CONSTRAINT "PathJoinAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Prasyarat course (blocked by)
ALTER TABLE "Course" ADD COLUMN "blockedByCourseId" TEXT;

CREATE INDEX "Course_blockedByCourseId_idx" ON "Course"("blockedByCourseId");

ALTER TABLE "Course" ADD CONSTRAINT "Course_blockedByCourseId_fkey" FOREIGN KEY ("blockedByCourseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;
