export const visited = (title: string): boolean => {
  const currentPath = location.pathname;

  if (currentPath === '/' && title === 'Home') {
    return true;
  } else {
    return currentPath.toLowerCase().includes(title.toLowerCase());
  }
};
