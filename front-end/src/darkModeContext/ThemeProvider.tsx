import { Theme, ThemeContext } from './ThemeContext.ts';
import React, { useEffect, useState } from 'react';

// Get the initial theme  from local storage or get the system settings
const getInitialTheme = (): Theme => {
  const savedTheme = localStorage.getItem('theme') as Theme;

  if (savedTheme) {
    return savedTheme;
  }

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  return prefersDark ? 'dark' : 'light';
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [isDarkMode, setDarkMode] = useState<boolean>(theme === 'dark');
  const [darkModeText, setDarkModeText] = useState<Theme>(theme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'system') {
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)',
      ).matches;
      root.classList.toggle('dark', prefersDark);
      setDarkMode(prefersDark);
      setDarkModeText(prefersDark ? 'dark' : 'light');
    } else {
      root.classList.toggle('dark', theme === 'dark');
      setDarkMode(theme === 'dark');
      setDarkModeText(theme);
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{ theme, setTheme, isDarkMode, darkModeText }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
