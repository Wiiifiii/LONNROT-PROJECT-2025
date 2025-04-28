// scripts/cleanupOldBooks.js
import 'dotenv/config'; // Load environment variables from the .env file
import { PrismaClient } from '@prisma/client'; // Import PrismaClient for database interactions
const prisma = new PrismaClient(); // Initialize PrismaClient

async function main() {
  console.log('Clearing txt_url and pdf_url on all books...'); // Log start of cleanup process
  const res = await prisma.book.updateMany({ data: { txt_url: null, pdf_url: null } }); // Update all books to set txt_url and pdf_url to null
  console.log(`Updated ${res.count} books.`); // Log the number of books updated
  await prisma.$disconnect(); // Disconnect PrismaClient
}

main().catch((e) => {
  console.error(e); // Log any errors that occur
  prisma.$disconnect().then(() => process.exit(1)); // Disconnect PrismaClient and exit with a failure code if an error occurs
});
