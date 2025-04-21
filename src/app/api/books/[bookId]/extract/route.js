// src/app/api/books/[bookId]/extract/route.js
export const runtime = 'nodejs';

import fs from "fs";
import path from "path";
import http from "http";
import unzipper from "unzipper";
import { PrismaClient } from "@prisma/client";
import { PDFDocument } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import parseBook from "@/scripts/parseBook.js";
import { getToken } from "next-auth/jwt"; // Import NextAuth's getToken for session management

const prisma = new PrismaClient();

export async function GET(request, ctx) {
  const { bookId } = await ctx.params;
  const id = Number(bookId);

  try {
    // Fetch user session to track interaction
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    const sessionId = token ? `user_${token.id}` : request.cookies.get("lo_sid")?.value ?? "anon";

    // Log the extraction interaction
    await prisma.bookInteraction.create({
      data: { bookId: id, sessionId, type: "EXTRACT" },
    });

    // Download and process the book file from the ZIP.
    const { book: rawText } = await processBook(id);
    const parsedBook = parseBook(rawText); // Extract metadata like genres and language
    const pdfBytes = await createPdfFromRawText(rawText); // Generate PDF
    const pdfBase64 = Buffer.from(pdfBytes).toString("base64");

    // Attach the book ID to parsed data
    parsedBook.id = id;

    // Fetch other books by the same author (excluding the current one)
    const otherBooks = await getOtherBooksByAuthor(parsedBook.metadata.author, id);

    return new Response(
      JSON.stringify({
        success: true,
        book: parsedBook,
        pdfBase64,
        otherBooks,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in GET /api/books/[id]/extract:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

async function processBook(id) {
  const fixEncoding = (filePath, outputPath) => {
    let data = fs.readFileSync(filePath);
    let decodedText = new TextDecoder("iso-8859-1").decode(data);
    fs.writeFileSync(outputPath, decodedText, "utf8");
  };

  const needsFixing = (filePath) => {
    let data = fs.readFileSync(filePath);
    let decodedText = new TextDecoder("utf-8", { fatal: false }).decode(data);
    return decodedText.includes("�");
  };

  async function downloadAndUnzip(url, outputDir) {
    const zipPath = "temp.zip";
    const file = fs.createWriteStream(zipPath);
    await new Promise((resolve, reject) => {
      http
        .get(url, (response) => {
          if (response.statusCode !== 200) {
            return reject(new Error(`Failed to download ZIP: ${response.statusCode}`));
          }
          response.pipe(file);
          file.on("finish", () => file.close(resolve));
        })
        .on("error", (err) => {
          fs.unlink(zipPath, () => {});
          reject(err);
        });
    });
    try {
      await fs
        .createReadStream(zipPath)
        .pipe(unzipper.Extract({ path: outputDir }))
        .promise();
    } catch (unzipErr) {
      console.error("Unzip error:", unzipErr);
      throw unzipErr;
    }
    fs.unlinkSync(zipPath);
  }

  const paddedId = id.toString().padStart(4, "0");
  const dlPath = `http://www.lonnrot.net/kirjat/${paddedId}.zip`;

  const outputPath1 = path.join("./temp/", String(id));
  const outputPath2 = path.join("./temp/", `${id}_fixed.txt`);
  const expectedTxtPath = path.join(outputPath1, `${paddedId}.txt`);

  await downloadAndUnzip(dlPath, outputPath1);

  if (!fs.existsSync(expectedTxtPath)) {
    const files = fs.readdirSync(outputPath1);
    throw new Error(`Expected file ${paddedId}.txt not found in ${outputPath1}. Contents: ${files.join(", ")}`);
  }
  
  let bookContent;
  if (needsFixing(expectedTxtPath)) {
    fixEncoding(expectedTxtPath, outputPath2);
    bookContent = fs.readFileSync(outputPath2, "utf-8");
    fs.unlinkSync(outputPath2);
  } else {
    bookContent = fs.readFileSync(expectedTxtPath, "utf-8");
  }
  fs.rmSync(outputPath1, { recursive: true, force: true });
  return { book: bookContent };
}

async function createPdfFromRawText(rawText) {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);

  // Use the custom font – change if you require monospaced styling.
  const fontPath = path.join(process.cwd(), "public", "fonts", "LiberationSans-Regular.ttf");
  const fontBytes = fs.readFileSync(fontPath);
  const customFont = await pdfDoc.embedFont(fontBytes);

  const margin = 50;
  const lineHeight = 14;
  
  // Split the entire raw text by newlines to preserve it exactly.
  const lines = rawText.split("\n");

  let pageNumber = 1;
  let currentPage = pdfDoc.addPage();
  let { height } = currentPage.getSize();
  let cursorY = height - margin;

  for (let line of lines) {
    // If there is not enough space, finish the current page and start a new one.
    if (cursorY < margin) {
      drawPageNumber(currentPage, pageNumber, customFont);
      pageNumber++;
      currentPage = pdfDoc.addPage();
      ({ height } = currentPage.getSize());
      cursorY = height - margin;
    }
    // Draw the line as is.
    currentPage.drawText(line, {
      x: margin,
      y: cursorY,
      size: 12,
      font: customFont,
    });
    cursorY -= lineHeight;
  }
  
  // Draw the final page number.
  drawPageNumber(currentPage, pageNumber, customFont);
  return pdfDoc.save();
}

function drawPageNumber(page, pageNumber, font) {
  const { width } = page.getSize();
  const text = `Page ${pageNumber}`;
  page.drawText(text, {
    x: width - 80,
    y: 20,
    size: 10,
    font,
  });
}

async function getOtherBooksByAuthor(author, excludeId) {
  return prisma.book.findMany({
    where: {
      author: { equals: author, mode: "insensitive" },
      id: { not: excludeId },
    },
    select: { id: true, title: true, author: true },
  });
}
