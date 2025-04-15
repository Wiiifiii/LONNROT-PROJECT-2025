// parseBook.js
// Parses raw text of a book into a structured JSON object for use in search, filtering, and display.
export default function parseBook(rawText) {
    const normalizeText = (text) => {
      return text
        .replace(/ả|ã/g, 'å')
        .replace(/ō/g, 'o')
        .replace(/ị/g, 'i')
        .replace(/år/g, 'är')
        .replace(/huar/g, 'hvar')
        .replace(/ofver/g, 'öfver')
        .replace(/såvål/g, 'såväl')
        .replace(/anvåndning/g, 'användning')
        .normalize('NFC');
    };
  
    // Split the text by newlines and remove empty lines
    const lines = rawText.split("\n").map(line => normalizeText(line.trim())).filter(line => line.length > 0);
  
    // Prepare the result object
    let result = {
      // Basic metadata:
      title: "",
      author: "",
      publicationNumber: "",
      productionCredits: "",
      subtitle: "",
      place: "",
      publisher: "",
      publicationYear: "",
      // Optionally store the complete header as well:
      headerText: "",
      // The remainder of the book:
      bodyText: ""
    };
  
    // 1. Extract information from the very first line.
    // Expected pattern:
    // [Author] '[Title]' ... julkaisu n:o [PublicationNumber]
    const firstLineRegex = /^(.*?)\s+'([^']+)'[\s\S]*julkaisu n:o\s*(\d+)/i;
    const firstLineMatch = lines[0].match(firstLineRegex);
    if (firstLineMatch) {
      result.author = firstLineMatch[1].trim();
      result.title = firstLineMatch[2].trim();
      result.publicationNumber = firstLineMatch[3].trim();
    }
  
    // 2. Production credits: search for a line containing "Tämän e-kirjan ovat tuottaneet"
    const prodIndex = lines.findIndex(line => /Tämän e-kirjan ovat tuottaneet/i.test(line));
    if (prodIndex !== -1) {
      result.productionCredits = lines[prodIndex].replace(/Tämän e-kirjan ovat tuottaneet/i, "").trim();
    }
  
    // 3. Look for a line that repeats the title in uppercase.
    const titleLineIndex = lines.findIndex(line => line === line.toUpperCase() && line.includes(result.title.toUpperCase()));
    if (titleLineIndex !== -1 && lines[titleLineIndex + 1]) {
      // The next line might be the subtitle/description.
      result.subtitle = lines[titleLineIndex + 1].trim();
    }
  
    // 4. Detect the "Kirj." marker. Usually the next few lines provide the official author,
    //    place, publisher, and publication year.
    const kirjIndex = lines.findIndex(line => /^Kirj\./i.test(line));
    if (kirjIndex !== -1) {
      // Sometimes the official author is repeated in the next line.
      if (lines[kirjIndex + 1]) {
        result.author = lines[kirjIndex + 1].trim();
      }
      if (lines[kirjIndex + 2]) {
        result.place = lines[kirjIndex + 2].replace(/,$/, "").trim();
      }
      if (lines[kirjIndex + 3]) {
        result.publisher = lines[kirjIndex + 3].replace(/,$/, "").trim();
      }
      if (lines[kirjIndex + 4]) {
        result.publicationYear = lines[kirjIndex + 4].replace(/[^\d]/g, "").trim();
      }
    }
  
    // 5. Capture the header block (all lines until a blank separator or the end of first page).
    // In many cases, the header is the first 8-10 lines.
    const headerLines = lines.slice(0, Math.min(10, lines.length));
    result.headerText = headerLines.join("\n");
  
    // 6. The rest of the text is the body.
    if (lines.length > 10) {
      result.bodyText = lines.slice(10).join("\n");
    }
  
    // You can also store all extracted metadata under a "metadata" property if you like:
    result.metadata = {
      title: result.title,
      author: result.author,
      publicationNumber: result.publicationNumber,
      productionCredits: result.productionCredits,
      subtitle: result.subtitle,
      place: result.place,
      publisher: result.publisher,
      publicationYear: result.publicationYear
    };
  
    return result;
  }
  