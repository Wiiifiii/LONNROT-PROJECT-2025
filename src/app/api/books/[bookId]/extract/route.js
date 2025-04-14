import fs from "fs";
import path from "path";
import http from "http";
import unzipper from "unzipper";
import { PrismaClient } from "@prisma/client";
import { PDFDocument } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";

const prisma = new PrismaClient();

export async function GET(request, context) {
  const { bookId } = await context.params;
  const id = parseInt(bookId, 10);
  try {
    const { book: rawText } = await processBook(id);
    const analyzedBook = analyzeBook(rawText, id);
    const pdfBytes = await createPdfFromText(analyzedBook, rawText);
    const pdfBase64 = Buffer.from(pdfBytes).toString("base64");
    const otherBooks = await getOtherBooksByAuthor(analyzedBook.author, id);
    return new Response(
      JSON.stringify({
        success: true,
        book: analyzedBook,
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

  // Convert book id to a four-digit padded string. (ZIP files on lonnrot.net are named like "0001.txt")
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

function analyzeBook(txt, id) {
  const book = {};
  const _name = /^(.*?\s.*?)\s/;
  book.author = _name.exec(txt)?.[1] || "-";
  const _bookName = /'(.*?)'/;
  book.name = _bookName.exec(txt)?.[1] || "-";
  const _bookStart = /[0-9]{4}/g;
  const matches = [...txt.matchAll(_bookStart)];
  if (matches.length > 1) {
    book.start = matches[1].index + 4;
    const _rmnl = /[\r\n]+(?=[a-z])/gi;
    book.text = txt.slice(book.start).replace(_rmnl, "");
  } else {
    book.text = txt;
  }
  book.id = id;
  return book;
}

async function createPdfFromText(bookObj, rawText) {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);
  const fontPath = path.join(process.cwd(), "public", "fonts", "LiberationSans-Regular.ttf");
  const fontBytes = fs.readFileSync(fontPath);
  const customFont = await pdfDoc.embedFont(fontBytes);
  let page = pdfDoc.addPage();
  let { width, height } = page.getSize();
  page.drawText(bookObj.name, { x: 50, y: height - 50, size: 16, font: customFont });
  page.drawText(`Author: ${bookObj.author}`, { x: 50, y: height - 70, size: 12, font: customFont });
  let cursorY = height - 90;
  const margin = 50;
  const lineHeight = 14;
  const maxWidth = width - margin * 2;
  const lines = wrapText(rawText, 80);
  for (const line of lines) {
    if (cursorY <= margin) {
      page = pdfDoc.addPage();
      ({ width, height } = page.getSize());
      cursorY = height - margin;
    }
    page.drawText(line, { x: margin, y: cursorY, size: 12, font: customFont, lineHeight, maxWidth });
    cursorY -= lineHeight;
  }
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
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

function wrapText(text, maxChars) {
  const words = text.split(/\s+/);
  const lines = [];
  let currentLine = "";
  for (const w of words) {
    if ((currentLine + w).length <= maxChars) {
      currentLine += w + " ";
    } else {
      lines.push(currentLine.trim());
      currentLine = w + " ";
    }
  }
  if (currentLine) lines.push(currentLine.trim());
  return lines;
}
