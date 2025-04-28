import fs from 'fs'; // Import filesystem module for file operations
import path from 'path'; // Import path module to handle file paths
import http from 'http'; // Import http module to make HTTP requests
import unzipper from 'unzipper'; // Import unzipper to extract ZIP files
import { PDFDocument } from 'pdf-lib'; // Import PDFDocument for PDF creation
import fontkit from '@pdf-lib/fontkit'; // Import fontkit to embed custom fonts

/** Download a ZIP from the given URL and extract it into outputDir */
async function downloadAndUnzip(url, outputDir) {
  const zipPath = path.join(outputDir, 'temp.zip'); // Define path for temporary ZIP file
  fs.mkdirSync(outputDir, { recursive: true }); // Ensure output directory exists
  await new Promise((resolve, reject) => { // Download ZIP as a promise
    const file = fs.createWriteStream(zipPath); // Create a write stream to save the ZIP
    http.get(url, (response) => { // Send HTTP GET request to the URL
      if (response.statusCode !== 200) { // Check if response status is OK
        return reject(new Error(`Failed to download ZIP: ${response.statusCode}`)); // Reject on error status
      }
      response.pipe(file); // Pipe the response to the file stream
      file.on('finish', () => file.close(resolve)); // Resolve promise when download finishes
    }).on('error', (err) => { // Handle errors during HTTP GET
      fs.unlinkSync(zipPath); // Delete the ZIP file if error occurs
      reject(err); // Reject promise with error
    });
  });
  await fs.createReadStream(zipPath) // Create a read stream from the downloaded ZIP file
    .pipe(unzipper.Extract({ path: outputDir })) // Pipe into unzipper to extract files
    .promise(); // Wait for extraction to complete
  fs.unlinkSync(zipPath); // Delete the temporary ZIP file after extraction
}

/** Process the raw text of a book by downloading its ZIP, fixing encoding, and returning the UTF-8 text */
export async function processBook(id) {
  const paddedId = id.toString().padStart(4, '0'); // Pad the book ID with zeros
  const dlUrl = `http://www.lonnrot.net/kirjat/${paddedId}.zip`; // Construct the download URL for the ZIP file
  const tempDir = path.join(process.cwd(), 'temp', String(id)); // Define temporary directory for extraction
  const fixedTxt = path.join(process.cwd(), 'temp', `${id}_fixed.txt`); // Define path for fixed text file
  const expectedTxt = path.join(tempDir, `${paddedId}.txt`); // Expected text file name after extraction
  await downloadAndUnzip(dlUrl, tempDir); // Download and unzip the book ZIP file
  if (!fs.existsSync(expectedTxt)) { // Check if the expected text file exists
    const files = fs.readdirSync(tempDir); // Read all files in the temporary directory
    throw new Error(`Expected ${paddedId}.txt not found. Found: ${files.join(', ')}`); // Throw error if file not found
  }
  let rawText; // Variable to store the final raw text
  const buffer = fs.readFileSync(expectedTxt); // Read file content into a buffer
  const utf8 = buffer.toString('utf8'); // Convert buffer to UTF-8 string
  if (utf8.includes('�')) { // Check if there are encoding issues (replacement characters)
    const isoText = new TextDecoder('iso-8859-1').decode(buffer); // Decode buffer using ISO-8859-1 encoding
    fs.writeFileSync(fixedTxt, isoText, 'utf8'); // Write the fixed text to a temporary file in UTF-8
    rawText = fs.readFileSync(fixedTxt, 'utf8'); // Read the fixed text from the file
    fs.unlinkSync(fixedTxt); // Delete the fixed text file
  } else {
    rawText = utf8; // Use the original UTF-8 text if no encoding issues
  }
  fs.rmSync(tempDir, { recursive: true, force: true }); // Remove the temporary extraction folder
  return rawText; // Return the processed raw text
}

/** Generate a PDF from the given raw text (string), returning a Uint8Array buffer */
export async function createPdfFromRawText(rawText) {
  const pdfDoc = await PDFDocument.create(); // Create a new PDF document
  pdfDoc.registerFontkit(fontkit); // Register fontkit to embed custom fonts
  const fontPath = path.join(process.cwd(), 'public', 'fonts', 'LiberationSans-Regular.ttf'); // Define path to custom font
  const fontBytes = fs.readFileSync(fontPath); // Read custom font file bytes
  const customFont = await pdfDoc.embedFont(fontBytes); // Embed custom font into the PDF
  const margin = 50; // Define page margin
  const lineHeight = 14; // Define line height for text
  const lines = rawText.split('\n'); // Split rawText into individual lines
  let page = pdfDoc.addPage(); // Add a new page to the PDF
  let { height } = page.getSize(); // Get page height
  let y = height - margin; // Initialize y-coordinate starting from top margin
  let pageNumber = 1; // Initialize page number counter
  function addPageNumber(p) { // Function to add page number on a page
    p.drawText(`Page ${pageNumber}`, {
      x: p.getSize().width - 80, // Position page number near right edge
      y: 20, // Position page number near bottom
      size: 10, // Font size for page number
      font: customFont, // Use custom font for page number
    });
  }
  for (const textLine of lines) { // Iterate over each line of text
    if (y < margin) { // Check if current page is full
      addPageNumber(page); // Add page number to current page
      pageNumber++; // Increment page number counter
      page = pdfDoc.addPage(); // Add a new page for remaining text
      ({ height } = page.getSize()); // Get new page height
      y = height - margin; // Reset y-coordinate for new page
    }
    page.drawText(textLine, { // Draw the current text line on the page
      x: margin, // Set x-coordinate with margin
      y, // Set current y-coordinate
      size: 12, // Set font size for text
      font: customFont, // Use custom font for text
    });
    y -= lineHeight; // Decrement y-coordinate by line height for next line
  }
  addPageNumber(page); // Add page number to the last page
  return pdfDoc.save(); // Save the PDF and return as Uint8Array
}
