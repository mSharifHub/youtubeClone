export const decodeHtmlEntities = (str: string | undefined) => {
  if (!str) return;
  return str.replace(/<\/?[^>]+(>|$)/g, '');
};
