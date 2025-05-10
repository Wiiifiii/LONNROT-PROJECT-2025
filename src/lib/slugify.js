/**
 * slugify.js
 *
 * Converts strings into URL- and filename-safe slugs.
 * Exports two functions:
 * - slugify(text): Normalizes the input string by removing diacritics, lowercasing,
 *   replacing non-alphanumeric characters with hyphens, and trimming extra hyphens.
 * - fileSlug(id, title, ext): Constructs a filename slug based on the book ID,
 *   the slugified title, and a given file extension.
 */

export function slugify(text) {
  return text
    .toString()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function fileSlug(id, title, ext) {
  const base = slugify(title);
  return `${id}-${base}.${ext}`;
}
