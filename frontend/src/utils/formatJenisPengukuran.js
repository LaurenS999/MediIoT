export function formatJenisPengukuran(text) {
  return text
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
