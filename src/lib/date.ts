// Treat dates before 1980 as "no date" — guards against legacy rows
// that were saved as Unix epoch (1970-01-01) or Go zero time (0001-01-01).
export function safeDate(d: Date | null | undefined): Date | null {
  if (!d) return null;
  if (d.getFullYear() < 1980) return null;
  return d;
}
