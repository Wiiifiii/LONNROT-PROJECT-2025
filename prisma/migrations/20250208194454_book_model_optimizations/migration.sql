/*
  Warnings:

  - You are about to alter the column `title` on the `books` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `author` on the `books` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `file_name` on the `books` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `file_url` on the `books` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(512)`.
  - You are about to alter the column `cover_url` on the `books` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(512)`.

*/
-- AlterTable
ALTER TABLE "books" ALTER COLUMN "title" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "author" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "file_name" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "file_url" SET DATA TYPE VARCHAR(512),
ALTER COLUMN "upload_date" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "cover_url" SET DATA TYPE VARCHAR(512);

-- CreateIndex
CREATE INDEX "books_title_idx" ON "books"("title");

-- CreateIndex
CREATE INDEX "books_author_idx" ON "books"("author");

-- CreateIndex
CREATE INDEX "books_upload_date_idx" ON "books"("upload_date");
