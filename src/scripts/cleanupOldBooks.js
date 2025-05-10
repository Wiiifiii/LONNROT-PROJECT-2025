/**
 * cleanupOldBooks.js
 *
 * Clears the txt_url and pdf_url fields on all book records in the database.
 * Loads environment variables, initializes PrismaClient, performs a bulk update
 * to set txt_url and pdf_url to null for all books, logs the number of updated records,
 * and finally disconnects the database client.
 *
 * Dependencies: dotenv and PrismaClient from '@prisma/client'.
 */

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Clearing txt_url and pdf_url on all books...');
  const res = await prisma.book.updateMany({ data: { txt_url: null, pdf_url: null } });
  console.log(`Updated ${res.count} books.`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect().then(() => process.exit(1));
});
