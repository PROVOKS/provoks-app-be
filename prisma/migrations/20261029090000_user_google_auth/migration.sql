-- Login lewat Google: password jadi opsional + simpan sub Google
ALTER TABLE "User" ALTER COLUMN "password" DROP NOT NULL;

ALTER TABLE "User" ADD COLUMN "googleId" TEXT;

CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");
