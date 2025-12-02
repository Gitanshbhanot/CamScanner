export const humanReadableString = (input) => {
  if (typeof input !== 'string' || !input.trim()) return input; // Handle non-strings and empty strings

  return input
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between camelCase words
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2') // Handle consecutive uppercase acronyms
    .replace(/([a-zA-Z])(\d+)/g, '$1 $2') // Add space between letters and numbers
    .split(' ') // Split into words
    .map((word, index) => {
      // Preserve full acronyms like APL and NIIT
      if (/^[A-Z]{2,}$/.test(word)) return word;
      // Capitalize the first word, lowercase everything else except acronyms
      return index === 0
        ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        : word.toLowerCase();
    })
    .join(' ') // Join back into a string
    .trim(); // Trim any leading/trailing spaces
};

export function toCamelCase(str) {
  return str
    .replace(/[-_](.)/g, (_, char) => char.toUpperCase()) // Convert '-' or '_' followed by a character to uppercase.
    .replace(/^[A-Z]/, (char) => char.toLowerCase()); // Ensure the first character is lowercase.
}
