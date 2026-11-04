-- Alokasi mentor per path (many-to-many Path <-> User dengan role INSTRUCTOR).

CREATE TABLE "PathMentor" (
  "id" TEXT NOT NULL,
  "pathId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "assignedBy" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "PathMentor_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "PathMentor_pathId_userId_key" ON "PathMentor"("pathId", "userId");
CREATE INDEX "PathMentor_userId_idx" ON "PathMentor"("userId");

ALTER TABLE "PathMentor"
  ADD CONSTRAINT "PathMentor_pathId_fkey"
  FOREIGN KEY ("pathId") REFERENCES "Path"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PathMentor"
  ADD CONSTRAINT "PathMentor_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
