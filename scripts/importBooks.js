// Summary: This file fetches an HTML page to extract book information and upserts the data into the database using Prisma.

import * as cheerio from 'cheerio';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fetchBooks(url) {
  try {
    const response = await axios.get(url);
    const html = response.data;
    return extractBooks(html);
  } catch (error) {
    console.error('Error fetching the HTML:', error);
    return [];
  }
}

function extractBooks(html) {
  const $ = cheerio.load(html);
  const bookData = [];
  const pattern = /(\d+)\.\s([^:]+):\s*<a href="(.*?)">(.*?)<\/a>/g;
  $('font').each((index, element) => {
    const content = $(element).html();
    if (content) {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        bookData.push({
          id: match[1],
          Kirjailija: match[2].trim(),
          kirjannimi: match[4].trim(),
          url: match[3].trim(),
        });
      }
    }
  });
  return bookData;
}

function extractFileName(url) {
  if (!url) return null;
  const parts = url.split('/');
  return parts.length > 0 ? parts[parts.length - 1] : null;
}

async function upsertBooks(books) {
  let newBooksCount = 0;
  for (const item of books) {
    const numericId = parseInt(item.id, 10);
    const existingBook = await prisma.book.findUnique({
      where: { id: numericId },
    });
    if (!existingBook) {
      newBooksCount++;
    }
    const transformedBook = {
      id: numericId,
      title: item.kirjannimi,
      author: item.Kirjailija,
      description: "",
      file_name: extractFileName(item.url),
      file_url: item.url,
      upload_date: new Date(),
      metadata: {},
    };
    try {
      const upsertedBook = await prisma.book.upsert({
        where: { id: numericId },
        update: {
          title: transformedBook.title,
          author: transformedBook.author,
          description: transformedBook.description,
          file_name: transformedBook.file_name,
          file_url: transformedBook.file_url,
          upload_date: transformedBook.upload_date,
          metadata: transformedBook.metadata,
        },
        create: {
          ...transformedBook,
        },
      });
      console.log(`Upserted book: "${upsertedBook.title}" with ID = ${upsertedBook.id}`);
    } catch (error) {
      console.error(`Error upserting book "${item.kirjannimi}" with ID = ${numericId}:`, error);
    }
  }
  return newBooksCount;
}

async function getHighestBookId() {
  const highestBook = await prisma.book.findFirst({
    orderBy: { id: 'desc' },
  });
  return highestBook ? highestBook.id : 0;
}

export async function main() {
  const url = 'http://www.lonnrot.net/valmiit.html';
  console.log(`Fetching books from ${url}...`);
  const highestId = await getHighestBookId();
  console.log(`Current highest book ID in the database: ${highestId}`);
  const allBooks = await fetchBooks(url);
  console.log(`Found ${allBooks.length} books on the source.`);
  const newBooks = allBooks.filter(book => Number(book.id) > highestId);
  console.log(`Processing ${newBooks.length} new books only.`);
  if (newBooks.length === 0) {
    console.log("No new books to import.");
    return;
  }
  console.log('Upserting books into the database...');
  const newBooksCount = await upsertBooks(newBooks);
  console.log(`Import complete. New books added: ${newBooksCount}`);
  await prisma.$disconnect();
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  main().catch((error) => {
    console.error(error);
    prisma.$disconnect();
    process.exit(1);
  });
}
