/*
  Warnings:

  - You are about to drop the column `book_id` on the `activity_logs` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `activity_logs` table. All the data in the column will be lost.

*/
/* -- DropForeignKey */
ALTER TABLE "activity_logs" DROP CONSTRAINT IF EXISTS "activity_logs_book_id_fkey";

/* -- DropForeignKey */
ALTER TABLE "activity_logs" DROP CONSTRAINT IF EXISTS "activity_logs_user_id_fkey";

/* -- DropForeignKey */
ALTER TABLE "reading_list_items" DROP CONSTRAINT IF EXISTS "reading_list_items_bookId_fkey";

/* -- DropForeignKey */
ALTER TABLE "reading_list_items" DROP CONSTRAINT IF EXISTS "reading_list_items_readingListId_fkey";

/* -- DropForeignKey */
ALTER TABLE "reading_lists" DROP CONSTRAINT IF EXISTS "reading_lists_userId_fkey";

/* -- DropForeignKey */
ALTER TABLE "reviews" DROP CONSTRAINT IF EXISTS "reviews_bookId_fkey";

/* -- DropForeignKey */
ALTER TABLE "reviews" DROP CONSTRAINT IF EXISTS "reviews_userId_fkey";

/* -- AlterTable */
ALTER TABLE "activity_logs" 
  DROP COLUMN IF EXISTS "book_id",
  DROP COLUMN IF EXISTS "user_id",
  ADD COLUMN     "bookId" INTEGER,
  ADD COLUMN     "userId" INTEGER;

/* -- AlterTable */
ALTER TABLE "books" 
  ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

/* -- AlterTable */
ALTER TABLE "reviews" 
  ALTER COLUMN "userId" DROP NOT NULL;

/* -- AlterTable */
ALTER TABLE "users" 
  ALTER COLUMN "password_hash" DROP NOT NULL;

/* -- AddForeignKey */
ALTER TABLE "activity_logs" 
  ADD CONSTRAINT "activity_logs_userId_fkey" 
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

/* -- AddForeignKey */
ALTER TABLE "activity_logs" 
  ADD CONSTRAINT "activity_logs_bookId_fkey" 
    FOREIGN KEY ("bookId") REFERENCES "books"("id") ON DELETE CASCADE ON UPDATE CASCADE;

/* -- AddForeignKey */
ALTER TABLE "reviews" 
  ADD CONSTRAINT "reviews_bookId_fkey" 
    FOREIGN KEY ("bookId") REFERENCES "books"("id") ON DELETE CASCADE ON UPDATE CASCADE;

/* -- AddForeignKey */
ALTER TABLE "reviews" 
  ADD CONSTRAINT "reviews_userId_fkey" 
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

/* -- AddForeignKey */
ALTER TABLE "reading_lists" 
  ADD CONSTRAINT "reading_lists_userId_fkey" 
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

/* -- AddForeignKey */
ALTER TABLE "reading_list_items" 
  ADD CONSTRAINT "reading_list_items_readingListId_fkey" 
    FOREIGN KEY ("readingListId") REFERENCES "reading_lists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

/* -- AddForeignKey */
ALTER TABLE "reading_list_items" 
  ADD CONSTRAINT "reading_list_items_bookId_fkey" 
    FOREIGN KEY ("bookId") REFERENCES "books"("id") ON DELETE CASCADE ON UPDATE CASCADE;
