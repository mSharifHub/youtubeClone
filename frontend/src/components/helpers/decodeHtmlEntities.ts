export const decodeHtmlEntities = (str: string | undefined) => {
  if (!str) return;

  const html = str.replace(/<br\s*\/?>/gi, '\n');
  const div = document.createElement('div');
  div.innerHTML = html;

  return div.textContent || div.innerText || '';
};
