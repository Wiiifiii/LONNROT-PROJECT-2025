// scripts/cleanupOldBooks.js
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing txt_url and pdf_url on all books...');
  const res = await prisma.book.updateMany({
    data: { txt_url: null, pdf_url: null },
  });
  console.log(`Updated ${res.count} books.`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect().then(() => process.exit(1));
});
