/**
 * parseBook.js
 *
 * Parses raw text of a book into a structured JSON object for use in search, filtering, and display.
 * It normalizes characters in the text, extracts metadata (e.g., title, author, publication number,
 * production credits, subtitle, place, publisher, publication year, genres, and language), and organizes
 * the remaining text as the body content.
 *
 * Returns an object containing the structured book information.
 */

export default function parseBook(rawText) {
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
  
  const lines = rawText.split("\n")
    .map(line => normalizeText(line.trim()))
    .filter(line => line.length > 0);
  
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
  
  const firstLineRegex = /^(.*?)\s+'([^']+)'.*?julkaisu n:o\s*(\d+)/i;
  const firstLineMatch = lines[0].match(firstLineRegex);
  if (firstLineMatch) {
    result.author = firstLineMatch[1].trim();
    result.title = firstLineMatch[2].trim();
    result.publicationNumber = firstLineMatch[3].trim();
  }
  
  const prodIndex = lines.findIndex(line => /Tämän e-kirjan ovat tuottaneet/i.test(line));
  if (prodIndex !== -1) {
    result.productionCredits = lines[prodIndex].replace(/Tämän e-kirjan ovat tuottaneet/i, "").trim();
  }
  
  const headerLines = lines.slice(0, Math.min(10, lines.length));
  result.headerText = headerLines.join("\n");
  
  headerLines.forEach(line => {
    const genreMatch = line.match(/(laji|genre)[:\s]+(.+)/i);
    if (genreMatch) {
      result.genres = genreMatch[2].split(/[,;]+/).map(s => s.trim()).filter(s => s.length > 0);
    }
    const languageMatch = line.match(/(kieli|language)[:\s]+(.+)/i);
    if (languageMatch) {
      result.language = languageMatch[2].trim();
    }
  });
  
  if (!result.language) {
    const combinedHeader = headerLines.join(" ");
    if (/Englannin/i.test(combinedHeader)) {
      result.language = "English";
    } else if (/ruotsin|ruotsalainen/i.test(combinedHeader)) {
      result.language = "Swedish";
    } else if (/[\u00E4\u00F6]/.test(combinedHeader)) {
      result.language = "Finnish";
    } else {
      result.language = "Finnish";
    }
  }
  
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
  
  if (!result.genres || result.genres.length === 0) {
    const combinedHeader = headerLines.join(" ").toLowerCase();
    if (combinedHeader.includes("näytelmä")) {
      result.genres = ["Play"];
    } else if (combinedHeader.includes("runo")) {
      if (result.title && /kalevala/i.test(result.title)) {
        result.genres = ["Epic Poetry"];
      } else {
        result.genres = ["Poetry"];
      }
    }
  }
  
  const kirjIndex = lines.findIndex(line => /^kirj\.?/i.test(line));
  if (kirjIndex !== -1) {
    if (lines[kirjIndex + 1]) {
      result.publisher = lines[kirjIndex + 1].trim();
    }
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
  
  if (lines.length > 10) {
    result.bodyText = lines.slice(10).join("\n");
  } else {
    result.bodyText = "";
  }
  
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
