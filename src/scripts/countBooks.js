/**
 * countBooks.js
 *
 * Counts the total number of books in the database using Prisma.
 * Loads environment variables, initializes PrismaClient, counts all books,
 * logs the result, and disconnects the PrismaClient.
 *
 * Dependencies: dotenv and PrismaClient from '@prisma/client'.
 */

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const total = await prisma.book.count();
  console.log(`There are ${total} books in the database.`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect().then(() => process.exit(1));
});
