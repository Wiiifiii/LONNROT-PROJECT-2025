/**
 * fillDownloadUrls.js
 *
 * Updates the database for all books by constructing the PDF and TXT download URLs
 * based on the site's base URL and the book's id. It then back-fills these URLs into
 * the book records using Prisma.
 *
 * Dependencies: PrismaClient from "@prisma/client" and environment variables for the site URL.
 */

import { PrismaClient } from "@prisma/client";

async function main() {
  const prisma = new PrismaClient();
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  console.log("Back‑filling pdf_url and txt_url for all books…");
  const books = await prisma.book.findMany({ select: { id: true } });

  for (const { id } of books) {
    const pdfUrl = `${base}/api/books/${id}/download?format=pdf`;
    const txtUrl = `${base}/api/books/${id}/download?format=txt`;

    await prisma.book.update({
      where: { id },
      data: {
        pdf_url: pdfUrl,
        txt_url: txtUrl
      }
    });

    console.log(`Book #${id} → pdf_url and txt_url set`);
  }

  console.log("Done back‑filling all books.");
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error("Backfill script failed:", err);
  process.exit(1);
});
