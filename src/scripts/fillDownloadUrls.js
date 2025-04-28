// scripts/fillDownloadUrls.js
import { PrismaClient } from "@prisma/client"; // Import PrismaClient for database interactions

async function main() {
  const prisma = new PrismaClient(); // Initialize PrismaClient
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"; // Base URL of the site from environment variables or default to localhost

  console.log("Back‑filling pdf_url and txt_url for all books…"); // Log start of backfilling process
  const books = await prisma.book.findMany({ select: { id: true } }); // Retrieve all books' ids from the database

  for (const { id } of books) { // Iterate over each book
    const pdfUrl = `${base}/api/books/${id}/download?format=pdf`; // Construct PDF download URL for the book
    const txtUrl = `${base}/api/books/${id}/download?format=txt`; // Construct TXT download URL for the book

    await prisma.book.update({ // Update the book record with the constructed URLs
      where: { id },
      data:  {
        pdf_url: pdfUrl, // Set the pdf_url field
        txt_url: txtUrl  // Set the txt_url field
      }
    });

    console.log(`Book #${id} → pdf_url and txt_url set`); // Log successful update for this book
  }

  console.log("Done back‑filling all books."); // Log completion of the backfilling process
  await prisma.$disconnect(); // Disconnect PrismaClient after operations
}

main().catch((err) => {
  console.error("Backfill script failed:", err); // Log any errors that occur during execution
  process.exit(1); // Exit the process with a failure code
});
