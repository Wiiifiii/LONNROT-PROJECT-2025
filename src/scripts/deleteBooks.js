import { PrismaClient } from "@prisma/client"; // Import PrismaClient for database interactions

const prisma = new PrismaClient(); // Initialize PrismaClient

async function deleteAllBooks() {
  try {
    const deleted = await prisma.book.deleteMany(); // Delete all records in the Book table
    console.log(`Deleted ${deleted.count} books.`); // Log the number of books deleted
  } catch (error) {
    console.error("Error deleting books:", error); // Log any errors that occur during deletion
  } finally {
    await prisma.$disconnect(); // Disconnect PrismaClient regardless of success or failure
  }
}

deleteAllBooks(); // Execute the function to delete all books
