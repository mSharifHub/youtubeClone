export const formatNumber = (value: number | string | undefined): string => {
  if (value === undefined || (typeof value === 'string' && value.trim() === '') || (typeof value === 'number' && isNaN(value))) return '0';

  const num = typeof value === 'string' ? parseInt(value, 10) : value;
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(num % 1_000_000_000 === 0 ? 0 : 1) + 'B';
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(num % 1_000_000 === 0 ? 0 : 1) + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(num % 1_000 === 0 ? 0 : 1) + 'K';

  return num.toString();
};
