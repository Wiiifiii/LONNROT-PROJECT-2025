/**
 * pdfHelpers.js
 *
 * This module provides helper functions for processing book content:
 * - downloadAndUnzip: Downloads a ZIP file from a given URL and extracts its contents.
 * - processBook: Processes the raw text of a book by downloading its ZIP archive,
 *   correcting encoding issues, and returning the text as UTF-8.
 * - createPdfFromRawText: Generates a PDF document from the given raw text.
 *
 * Dependencies: fs, path, http, unzipper, pdf-lib, and fontkit.
 */

import fs from 'fs';
import path from 'path';
import http from 'http';
import unzipper from 'unzipper';
import { PDFDocument } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';

async function downloadAndUnzip(url, outputDir) {
  const zipPath = path.join(outputDir, 'temp.zip');
  fs.mkdirSync(outputDir, { recursive: true });
  await new Promise((resolve, reject) => {
    const file = fs.createWriteStream(zipPath);
    http.get(url, (response) => {
      if (response.statusCode !== 200) {
        return reject(new Error(`Failed to download ZIP: ${response.statusCode}`));
      }
      response.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', (err) => {
      fs.unlinkSync(zipPath);
      reject(err);
    });
  });
  await fs.createReadStream(zipPath)
    .pipe(unzipper.Extract({ path: outputDir }))
    .promise();
  fs.unlinkSync(zipPath);
}

export async function processBook(id, zipUrl) {
  const paddedId = id.toString().padStart(4, '0');
  const dlUrl = zipUrl || `http://www.lonnrot.net/kirjat/${paddedId}.zip`;
  const tempDir = path.join(process.cwd(), 'temp', String(id));
  const fixedTxt = path.join(process.cwd(), 'temp', `${id}_fixed.txt`);
  await downloadAndUnzip(dlUrl, tempDir);

  // Old zips contain {paddedId}.txt. Newer zips may contain differently named files.
  const candidates = fs
    .readdirSync(tempDir)
    .filter(f => f.toLowerCase().endsWith('.txt'))

  const preferred = `${paddedId}.txt`
  const txtFileName =
    (candidates.find(f => f === preferred) ||
      candidates.find(f => f.toLowerCase() === preferred.toLowerCase()) ||
      candidates[0])

  if (!txtFileName) {
    const files = fs.readdirSync(tempDir)
    throw new Error(`No .txt file found after unzip. Found: ${files.join(', ')}`);
  }

  const txtPath = path.join(tempDir, txtFileName)
  let rawText;
  const buffer = fs.readFileSync(txtPath);
  const utf8 = buffer.toString('utf8');
  if (utf8.includes('�')) {
    const isoText = new TextDecoder('iso-8859-1').decode(buffer);
    fs.writeFileSync(fixedTxt, isoText, 'utf8');
    rawText = fs.readFileSync(fixedTxt, 'utf8');
    fs.unlinkSync(fixedTxt);
  } else {
    rawText = utf8;
  }
  fs.rmSync(tempDir, { recursive: true, force: true });
  return rawText;
}

export async function createPdfFromRawText(rawText) {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);
  const fontPath = path.join(process.cwd(), 'public', 'fonts', 'LiberationSans-Regular.ttf');
  const fontBytes = fs.readFileSync(fontPath);
  const customFont = await pdfDoc.embedFont(fontBytes);
  const margin = 50;
  const lineHeight = 14;
  const lines = rawText.split('\n');
  let page = pdfDoc.addPage();
  let { height } = page.getSize();
  let y = height - margin;
  let pageNumber = 1;
  function addPageNumber(p) {
    p.drawText(`Page ${pageNumber}`, {
      x: p.getSize().width - 80,
      y: 20,
      size: 10,
      font: customFont,
    });
  }
  for (const textLine of lines) {
    if (y < margin) {
      addPageNumber(page);
      pageNumber++;
      page = pdfDoc.addPage();
      ({ height } = page.getSize());
      y = height - margin;
    }
    page.drawText(textLine, {
      x: margin,
      y,
      size: 12,
      font: customFont,
    });
    y -= lineHeight;
  }
  addPageNumber(page);
  return pdfDoc.save();
}
