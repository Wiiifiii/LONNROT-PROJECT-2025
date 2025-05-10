/**
 * deleteBooks.js
 *
 * Deletes all book records from the database.
 * Connects via PrismaClient to the Book table and removes all entries.
 * Logs the number of deleted books and errors if any occur.
 *
 * Dependencies: PrismaClient from "@prisma/client".
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function deleteAllBooks() {
  try {
    const deleted = await prisma.book.deleteMany();
    console.log(`Deleted ${deleted.count} books.`);
  } catch (error) {
    console.error("Error deleting books:", error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteAllBooks();
