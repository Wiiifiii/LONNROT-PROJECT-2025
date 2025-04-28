// src/lib/slugify.js
/**
 * Convert a string into a URL‑ and filename‑safe “slug”.
 * Strips diacritics, lowercases, replaces non‑alphanumerics with hyphens.
 */
export function slugify(text) {
  return text
    .toString() // Convert input to a string
    .normalize("NFKD") // Normalize accented characters (e.g. "ä" → "a")
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritic marks
    .toLowerCase() // Convert to lowercase
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric characters with a hyphen
    .replace(/^-+|-+$/g, ""); // Trim leading and trailing hyphens
}

/**
 * Make a filename slug combining the book ID and its title,
 * e.g. “42-muuminpappa-at-sea.txt” or “42-muuminpappa-at-sea.pdf”
 */
export function fileSlug(id, title, ext) {
  const base = slugify(title); // Convert title to a slug format
  return `${id}-${base}.${ext}`; // Return the formatted filename slug
}
