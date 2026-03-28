const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function formatDate(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);
  return `${MONTHS[month - 1]} ${day}, ${year}`;
}

export function calculateReadingTime(text) {
  const wordCount = text.trim().split(/\s+/).length;
  return Math.ceil(wordCount / 2000);
}

export function slugify(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}
