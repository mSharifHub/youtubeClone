import { Maybe } from '../graphql/types.ts';

interface SliceTextProps {
  isDescription?: boolean;
  s?: Maybe<string> | string | undefined;
}

export function sliceText({ isDescription, s }: SliceTextProps): string {
  if (!s) return '';
  const parsedString = s.replace(/\s+/g, '');
  const MAX = isDescription ? 60 : 36;
  return parsedString.length >= MAX ? s.slice(0, MAX) + '...' : s;
}
