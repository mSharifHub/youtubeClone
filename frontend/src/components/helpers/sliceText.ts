interface SliceTextProps {
  isDescription?: boolean;
  s?: string | null;
}

export function sliceText({ isDescription, s }: SliceTextProps): string {
  if (!s) return '';
  const parsedString = s.replace(/\s+/g, '');
  const MAX = isDescription ? 70 : 36;
  return parsedString.length >= MAX ? s.slice(0, MAX) + '...' : s;
}
