import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function deleteAllBooks() {
  try {
    const deleted = await prisma.book.deleteMany(); // This deletes all records in the Book table.
    console.log(`Deleted ${deleted.count} books.`);
  } catch (error) {
    console.error("Error deleting books:", error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteAllBooks();
