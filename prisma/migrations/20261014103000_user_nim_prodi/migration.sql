-- AlterTable: simpan NIM & Prodi siswa (khusus role STUDENT)
ALTER TABLE "User" ADD COLUMN "nim" TEXT;
ALTER TABLE "User" ADD COLUMN "prodi" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_nim_key" ON "User"("nim");
