// src/lib/slugify.js

/**
 * Convert a string into a URL‑ and filename‑safe “slug”.
 * Strips diacritics, lowercases, replaces non‑alphanumerics with hyphens.
 */
export function slugify(text) {
    return text
      .toString()
      // Normalize accented characters (e.g. “ä” → “a”)
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      // Replace any sequence of non‑alphanumeric with a single hyphen
      .replace(/[^a-z0-9]+/g, "-")
      // Trim leading/trailing hyphens
      .replace(/^-+|-+$/g, "");
  }
  
  /**
   * Make a filename slug combining the book ID and its title,
   * e.g. “42-muuminpappa-at-sea.txt” or “42-muuminpappa-at-sea.pdf”
   */
  export function fileSlug(id, title, ext) {
    const base = slugify(title);
    return `${id}-${base}.${ext}`;
  }
  