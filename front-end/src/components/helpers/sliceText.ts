export function sliceText(s: string): string {
  const parsedString = s.replace(/\s+/g, '');
  const MAX = 38;
  return parsedString.length >= MAX ? s.slice(0, MAX) + '...' : s;
}
