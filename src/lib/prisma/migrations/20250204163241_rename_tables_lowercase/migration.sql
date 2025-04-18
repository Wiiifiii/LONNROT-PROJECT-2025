/*
  Warnings:

  - You are about to drop the `ActivityLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Book` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ActivityLog" DROP CONSTRAINT "ActivityLog_book_id_fkey";

-- DropForeignKey
ALTER TABLE "ActivityLog" DROP CONSTRAINT "ActivityLog_user_id_fkey";

-- DropTable
DROP TABLE "ActivityLog";

-- DropTable
DROP TABLE "Book";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "books" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "description" TEXT,
    "file_name" TEXT,
    "file_url" TEXT,
    "upload_date" TIMESTAMP(3),
    "metadata" JSONB,

    CONSTRAINT "books_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_logs" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "book_id" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "details" TEXT,

    CONSTRAINT "activity_logs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "books"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
