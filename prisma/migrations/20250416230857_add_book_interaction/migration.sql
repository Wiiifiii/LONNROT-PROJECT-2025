-- CreateEnum
CREATE TYPE "InteractionType" AS ENUM ('DOWNLOAD', 'READ_START', 'READ_FINISH');

-- CreateTable
CREATE TABLE "book_interactions" (
    "id" SERIAL NOT NULL,
    "bookId" INTEGER NOT NULL,
    "type" "InteractionType" NOT NULL,
    "sessionId" VARCHAR(64),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "book_interactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "book_interactions_bookId_type_idx" ON "book_interactions"("bookId", "type");

-- CreateIndex
CREATE INDEX "book_interactions_createdAt_idx" ON "book_interactions"("createdAt");

-- AddForeignKey
ALTER TABLE "book_interactions" ADD CONSTRAINT "book_interactions_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "books"("id") ON DELETE CASCADE ON UPDATE CASCADE;
