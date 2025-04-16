"use client";

// parseBook.js
// Parses raw text of a book into a structured JSON object for use in search, filtering, and display.
export default function parseBook(rawText) {
  // Normalize characters; adjust replacements as needed.
  function normalizeText(text) {
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
  }

  // Split the raw text into non‑empty, normalized lines.
  const lines = rawText
    .split("\n")
    .map(line => normalizeText(line.trim()))
    .filter(line => line.length > 0);

  // Initialize result object with default/fallback values.
  let result = {
    title: "",
    author: "",
    publicationNumber: "",
    productionCredits: "",
    subtitle: "",
    place: "",
    publisher: "",
    publicationYear: "",
    headerText: "",
    bodyText: "",
    genres: [],
    language: ""
  };

  // 1. Extract initial metadata from the first line using an updated regex.
  // Expected format: Author 'Title' ... julkaisu n:o <number>
  const firstLineRegex = /^(.*?)\s+'([^']+)'.*?julkaisu n:o\s*(\d+)/i;
  const firstLineMatch = lines[0].match(firstLineRegex);
  if (firstLineMatch) {
    result.author = firstLineMatch[1].trim();
    result.title = firstLineMatch[2].trim();
    result.publicationNumber = firstLineMatch[3].trim();
  }

  // 2. Production credits: Look for a line containing "Tämän e-kirjan ovat tuottaneet"
  const prodIndex = lines.findIndex(line => /Tämän e-kirjan ovat tuottaneet/i.test(line));
  if (prodIndex !== -1) {
    result.productionCredits = lines[prodIndex].replace(/Tämän e-kirjan ovat tuottaneet/i, "").trim();
  }

  // 3. Define header section: we use the first 10 lines (you may adjust this number if needed).
  const headerLines = lines.slice(0, Math.min(10, lines.length));
  result.headerText = headerLines.join("\n");

  // 4. Extract explicit genre and language markers from header lines.
  headerLines.forEach(line => {
    // Look for explicit genre markers.
    const genreMatch = line.match(/(laji|genre)[:\s]+(.+)/i);
    if (genreMatch) {
      result.genres = genreMatch[2].split(/[,;]+/).map(s => s.trim()).filter(s => s.length > 0);
    }
    // Look for explicit language markers.
    const languageMatch = line.match(/(kieli|language)[:\s]+(.+)/i);
    if (languageMatch) {
      result.language = languageMatch[2].trim();
    }
  });

  // 5. Heuristic to determine language if not explicitly set.
  if (!result.language) {
    const combinedHeader = headerLines.join(" ");
    if (/Englannin/i.test(combinedHeader)) {
      result.language = "English";
    } else if (/ruotsin|ruotsalainen/i.test(combinedHeader)) {
      result.language = "Swedish";
    } else if (/[\u00E4\u00F6]/.test(combinedHeader)) {
      result.language = "Finnish";
    } else {
      result.language = "Finnish"; // Default assumption
    }
  }

  // 6. Extract publication year by scanning header lines for a 4-digit year.
  const yearRegex = /\b(18|19|20)\d{2}\b/;
  for (const line of headerLines) {
    const match = line.match(yearRegex);
    if (match) {
      result.publicationYear = match[0];
      break;
    }
  }
  if (!result.publicationYear) {
    result.publicationYear = "Unknown";
  }

  // 7. If genres are still empty, use heuristics based on header keywords and title.
  if (!result.genres || result.genres.length === 0) {
    const combinedHeader = headerLines.join(" ").toLowerCase();
    if (combinedHeader.includes("näytelmä")) {
      result.genres = ["Play"];
    } else if (combinedHeader.includes("runo")) {
      // If the title contains "kalevala" (case-insensitive), classify as Epic Poetry.
      if (result.title && /kalevala/i.test(result.title)) {
        result.genres = ["Epic Poetry"];
      } else {
        result.genres = ["Poetry"];
      }
    }
  }

  // 8. Optional: Attempt to extract subtitle, place, and publisher.
  // For example, if a line starts with "Kirj." then assume following lines contain publisher info.
  const kirjIndex = lines.findIndex(line => /^kirj\.?/i.test(line));
  if (kirjIndex !== -1) {
    if (lines[kirjIndex + 1]) {
      result.publisher = lines[kirjIndex + 1].trim();
    }
    // Look for a line (among the header lines) that contains a year and place info.
    for (let i = kirjIndex + 1; i < headerLines.length; i++) {
      const line = lines[i];
      const yearMatch = line.match(yearRegex);
      if (yearMatch) {
        result.publicationYear = yearMatch[0];
        const parts = line.split(",");
        if (parts.length > 0) {
          result.place = parts[0].trim();
        }
        break;
      }
    }
  }

  // 9. The rest of the text is assumed to be the book's body text.
  if (lines.length > 10) {
    result.bodyText = lines.slice(10).join("\n");
  } else {
    result.bodyText = "";
  }

  // 10. Also store all extracted metadata under a "metadata" property.
  result.metadata = {
    title: result.title,
    author: result.author,
    publicationNumber: result.publicationNumber,
    productionCredits: result.productionCredits,
    subtitle: result.subtitle,
    place: result.place,
    publisher: result.publisher,
    publicationYear: result.publicationYear,
    genres: result.genres,
    language: result.language
  };

  return result;
}
