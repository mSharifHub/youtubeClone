import { createContext, useContext } from 'react';

// Types of the themes
export type Theme = 'light' | 'dark' | 'system';

interface ThemeContextProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDarkMode: boolean;
  darkModeText: Theme;
}

export const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }

  return context;
};
