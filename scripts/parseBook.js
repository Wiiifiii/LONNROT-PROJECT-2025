// parseBook.js
// Parses raw text of a book into a structured JSON object for PDF generation, focusing on a generic metadata structure.

export default function parseBook(rawText) {
    // Normalize raw text to handle Finnish and Swedish characters and historical spellings
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
            .normalize('NFC'); // Ensure Unicode normalization
    };

    // Split raw text into lines and trim them
    const lines = rawText.split('\n').map(line => normalizeText(line.trim()));
    
    // Initialize result object
    let result = {
        publicationNumber: '',
        header: '',
        title: '',
        subtitle: '',
        author: '',
        translator: '',
        publisher: '',
        publicationYear: '',
        productionCredits: '',
        publicDomainNotice: '',
        foreword: '',
        annotation: '',
        stories: []
    };

    // Helper: Extract publication number with flexible regex
    const extractPublicationNumber = text => {
        const pubRegex = /(?:julkaisu n:o|utgivelse nr)\s*(\d+)/i;
        const match = text.match(pubRegex);
        return match ? match[1] : '';
    };

    // Helper: Extract year from a line
    const extractYear = line => {
        const yearRegex = /\b(\d{4})\b/;
        const match = line.match(yearRegex);
        return match ? match[1] : '';
    };

    // Find the end of the metadata section generically
    let headerEndIndex = -1;
   // let inMetadata = true;
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        // Metadata lines are typically short (under 80 characters) and may include specific keywords
        if (line.length > 80 && !line.match(/public domain/i) && !line.match(/producerats|tuottaneet/i)) {
            // Likely the start of the body content (longer lines without metadata keywords)
            headerEndIndex = i;
            break;
        }
        // Look for the end of metadata by detecting the foreword line (e.g., "Företedt:") followed by a blank line or content
        if (line.match(/Företedt:/i)) {
            let nextIndex = i + 1;
            while (nextIndex < lines.length && lines[nextIndex].trim() === '') {
                nextIndex++; // Skip blank lines
            }
            if (nextIndex < lines.length && lines[nextIndex].length > 0) {
                headerEndIndex = nextIndex;
                break;
            }
        }
    }
    if (headerEndIndex === -1) headerEndIndex = lines.length;

    // Collect header lines (metadata)
    const headerLines = lines.slice(0, headerEndIndex).filter(line => line !== "");
    result.header = headerLines.join("\n");

    // Extract publication number from first few lines
    for (let i = 0; i < Math.min(3, headerLines.length); i++) {
        result.publicationNumber = extractPublicationNumber(headerLines[i]);
        if (result.publicationNumber) break;
    }

    // Extract public domain notice (multi-line support)
    const pdStartIndex = headerLines.findIndex(line => /public domain/i.test(line));
    if (pdStartIndex !== -1) {
        let pdLines = [];
        for (let i = pdStartIndex; i < headerLines.length; i++) {
            if (headerLines[i].trim() === '' && pdLines.length > 0) break; // Stop at first blank line after starting
            pdLines.push(headerLines[i]);
        }
        result.publicDomainNotice = pdLines.join(' ').trim();
    }

    // Extract production credits (ensure no duplicates)
    const creditsIndex = headerLines.findIndex(line => /tuottaneet|producerats/i.test(line));
    if (creditsIndex !== -1) {
        result.productionCredits = headerLines[creditsIndex].trim();
    }

    // Extract title and subtitle
    const titleRegex = /'([^']+)'/;
    for (let line of headerLines) {
        const match = line.match(titleRegex);
        if (match) {
            result.title = match[1];
            const nextIndex = headerLines.indexOf(line) + 1;
            if (nextIndex < headerLines.length && /^[A-ZÅÄÖ\s]+$/.test(headerLines[nextIndex]) && headerLines[nextIndex].length < 50) {
                result.subtitle = headerLines[nextIndex];
            }
            break;
        }
    }
    if (!result.title) {
        const uppercaseTitleIndex = headerLines.findIndex(l => /^[A-ZÅÄÖ\s]+$/.test(l) && l.length < 50);
        if (uppercaseTitleIndex !== -1) {
            result.title = headerLines[uppercaseTitleIndex];
        }
    }

    // Extract author, translator, publisher, year, and foreword
    let titleIndex = headerLines.findIndex(l => l.toLowerCase() === result.title.toLowerCase() || l.match(titleRegex));
    if (titleIndex === -1) {
        titleIndex = headerLines.findIndex(l => /^[A-ZÅÄÖ\s]+$/.test(l) && l.length < 50);
    }
    if (titleIndex !== -1) {
        let i = titleIndex + 1;
        while (i < headerLines.length && headerLines[i].length < 80) {
            const line = headerLines[i].toLowerCase();
            if (/by|kirj\.|af/i.test(line) && !/översatt|suomennos/i.test(line)) {
                result.author = headerLines[i].replace(/by|Kirj\.|af/i, '').trim();
            } else if (/översatt|suomennos/i.test(line)) {
                result.translator = headerLines[i].replace(/Översatt af|Suomennos/i, '').trim();
            } else if (/förlag|osakeyhtiö|,/i.test(line)) {
                result.publisher = headerLines[i];
                result.publicationYear = extractYear(headerLines[i]);
            } else if (/företedt/i.test(line)) {
                result.foreword = headerLines[i].trim();
            }
            i++;
        }
    }

    // Extract annotation (e.g., "Anm. Ovanstående är ett bearbetat utdrag...")
    const annotationStartIndex = lines.findIndex(line => line.startsWith('Anm.'));
    if (annotationStartIndex !== -1) {
        let annotationLines = [];
        for (let i = annotationStartIndex; i < lines.length; i++) {
            annotationLines.push(lines[i]);
        }
        result.annotation = annotationLines.join(' ').trim();
    }

    // Collect main content (starting after metadata)
    const contentLines = lines.slice(headerEndIndex).filter(line => line !== "" && !line.startsWith('Anm.'));
    if (contentLines.length > 0) {
        result.stories.push({
            title: result.title,
            content: contentLines.join('\n\n') // Use double newline to separate paragraphs
        });
    }

    return result;
}