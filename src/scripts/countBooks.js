// src/scripts/countBooks.js
// Load environment variables from the .env file
import 'dotenv/config';
// Import PrismaClient for database interactions
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient(); // Initialize PrismaClient

async function main() {
  const total = await prisma.book.count(); // Count total number of books in the database
  console.log(`There are ${total} books in the database.`); // Log the count of books
  await prisma.$disconnect(); // Disconnect PrismaClient after operations
}

main().catch((e) => {
  console.error(e); // Log any errors that occur during execution
  prisma.$disconnect().then(() => process.exit(1)); // Disconnect PrismaClient and exit with failure code if error occurs
});
