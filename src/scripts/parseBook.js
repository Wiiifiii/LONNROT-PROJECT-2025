// parseBook.js - Parses raw text of a book into a structured JSON object for use in search, filtering, and display.
export default function parseBook(rawText) {
  // Function to normalize characters in the text; adjust replacements as needed.
  function normalizeText(text) {
    return text
      .replace(/ả|ã/g, 'å') // Replace specific accented characters with a normalized version
      .replace(/ō/g, 'o') // Replace long "o" with "o"
      .replace(/ị/g, 'i') // Replace specific character with "i"
      .replace(/år/g, 'är') // Correct Scandinavian character sequence
      .replace(/huar/g, 'hvar') // Replace specific pattern for consistency
      .replace(/ofver/g, 'öfver') // Replace with correct character usage
      .replace(/såvål/g, 'såväl') // Correct common mis-spelling
      .replace(/anvåndning/g, 'användning') // Correct Swedish spelling
      .normalize('NFC'); // Normalize Unicode to NFC form
  }
  // Convert raw text into an array of non-empty, normalized lines
  const lines = rawText.split("\n").map(line => normalizeText(line.trim())).filter(line => line.length > 0);
  // Initialize the result object with default values for all properties
  let result = { title: "", author: "", publicationNumber: "", productionCredits: "", subtitle: "", place: "", publisher: "", publicationYear: "", headerText: "", bodyText: "", genres: [], language: "" };
  // 1. Extract initial metadata from the first line using a regex.
  // Expected format: Author 'Title' ... julkaisu n:o <number>
  const firstLineRegex = /^(.*?)\s+'([^']+)'.*?julkaisu n:o\s*(\d+)/i;
  const firstLineMatch = lines[0].match(firstLineRegex);
  if (firstLineMatch) { result.author = firstLineMatch[1].trim(); result.title = firstLineMatch[2].trim(); result.publicationNumber = firstLineMatch[3].trim(); }
  // 2. Extract production credits if a line contains "Tämän e-kirjan ovat tuottaneet"
  const prodIndex = lines.findIndex(line => /Tämän e-kirjan ovat tuottaneet/i.test(line));
  if (prodIndex !== -1) { result.productionCredits = lines[prodIndex].replace(/Tämän e-kirjan ovat tuottaneet/i, "").trim(); }
  // 3. Define header section using the first 10 lines of the text
  const headerLines = lines.slice(0, Math.min(10, lines.length));
  result.headerText = headerLines.join("\n");
  // 4. Extract explicit genre and language markers from the header lines
  headerLines.forEach(line => {
    const genreMatch = line.match(/(laji|genre)[:\s]+(.+)/i);
    if (genreMatch) { result.genres = genreMatch[2].split(/[,;]+/).map(s => s.trim()).filter(s => s.length > 0); }
    const languageMatch = line.match(/(kieli|language)[:\s]+(.+)/i);
    if (languageMatch) { result.language = languageMatch[2].trim(); }
  });
  // 5. Use heuristic methods to determine language if not explicitly set
  if (!result.language) {
    const combinedHeader = headerLines.join(" ");
    if (/Englannin/i.test(combinedHeader)) { result.language = "English"; }
    else if (/ruotsin|ruotsalainen/i.test(combinedHeader)) { result.language = "Swedish"; }
    else if (/[\u00E4\u00F6]/.test(combinedHeader)) { result.language = "Finnish"; }
    else { result.language = "Finnish"; }
  }
  // 6. Extract publication year by scanning header lines for a 4-digit year (starting with 18, 19, or 20)
  const yearRegex = /\b(18|19|20)\d{2}\b/;
  for (const line of headerLines) {
    const match = line.match(yearRegex);
    if (match) { result.publicationYear = match[0]; break; }
  }
  if (!result.publicationYear) { result.publicationYear = "Unknown"; }
  // 7. If genres are still empty, apply heuristics based on header keywords and title
  if (!result.genres || result.genres.length === 0) {
    const combinedHeader = headerLines.join(" ").toLowerCase();
    if (combinedHeader.includes("näytelmä")) { result.genres = ["Play"]; }
    else if (combinedHeader.includes("runo")) {
      if (result.title && /kalevala/i.test(result.title)) { result.genres = ["Epic Poetry"]; }
      else { result.genres = ["Poetry"]; }
    }
  }
  // 8. Optionally extract subtitle, place, and publisher information
  const kirjIndex = lines.findIndex(line => /^kirj\.?/i.test(line));
  if (kirjIndex !== -1) {
    if (lines[kirjIndex + 1]) { result.publisher = lines[kirjIndex + 1].trim(); }
    for (let i = kirjIndex + 1; i < headerLines.length; i++) {
      const line = lines[i];
      const yearMatch = line.match(yearRegex);
      if (yearMatch) { result.publicationYear = yearMatch[0]; const parts = line.split(","); if (parts.length > 0) { result.place = parts[0].trim(); } break; }
    }
  }
  // 9. Assign the remaining text as the book's body text
  if (lines.length > 10) { result.bodyText = lines.slice(10).join("\n"); } else { result.bodyText = ""; }
  // 10. Also store all extracted metadata under a "metadata" property for easy access
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
  return result; // Return the structured JSON object with parsed book information
}
