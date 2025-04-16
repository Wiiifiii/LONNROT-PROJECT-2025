-- AlterTable
ALTER TABLE "books" ADD COLUMN     "genres" TEXT[],
ADD COLUMN     "language" TEXT,
ADD COLUMN     "publicationYear" INTEGER,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "displayName" TEXT,
ADD COLUMN     "profileImage" BYTEA,
ADD COLUMN     "socialMediaLinks" JSONB;

-- CreateTable
CREATE TABLE "reading_positions" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "bookId" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reading_positions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "reading_positions_userId_bookId_key" ON "reading_positions"("userId", "bookId");

-- CreateIndex
CREATE INDEX "books_publicationYear_idx" ON "books"("publicationYear");

-- CreateIndex
CREATE INDEX "books_language_idx" ON "books"("language");

-- AddForeignKey
ALTER TABLE "reading_positions" ADD CONSTRAINT "reading_positions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reading_positions" ADD CONSTRAINT "reading_positions_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "books"("id") ON DELETE CASCADE ON UPDATE CASCADE;
