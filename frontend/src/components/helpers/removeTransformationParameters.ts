export const removeTransformationParameters = (url: string | undefined) => {
  if (!url) return url;
  const urlObject = new URL(url);
  urlObject.pathname = urlObject.pathname.replace(/=s\d+.*$/, '');
  return urlObject.toString();
};
