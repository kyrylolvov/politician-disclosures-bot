/**
 * Returns today's date in YYYY-MM-DD format (e.g. "2025-01-22").
 */
export function getTodayStr(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const day = today.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Converts a Clerk date string (e.g. "1/16/2025") into "YYYY-MM-DD".
 */
export function formatDateString(clerkDate: string): string {
  // clerkDate is M/D/YYYY (sometimes single-digit M and D)
  const [m, d, y] = clerkDate.split("/");
  // zero-pad the month/day to 2 digits
  const mm = m.padStart(2, "0");
  const dd = d.padStart(2, "0");
  return `${y}-${mm}-${dd}`;
}
