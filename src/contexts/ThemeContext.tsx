import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'cosmic' | 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = 'cosmic',
  storageKey = 'cosmic-focus-theme',
}) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Try to get theme from localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(storageKey);
      if (stored && ['cosmic', 'light', 'dark'].includes(stored)) {
        return stored as Theme;
      }
    }
    return defaultTheme;
  });

  useEffect(() => {
    // Save theme to localStorage
    localStorage.setItem(storageKey, theme);
    
    // Apply theme to document
    const root = window.document.documentElement;
    root.classList.remove('cosmic', 'light', 'dark');
    root.classList.add(theme);
    
    // Update meta theme color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      if (theme === 'light') {
        metaThemeColor.setAttribute('content', '#f8fafc');
      } else if (theme === 'dark') {
        metaThemeColor.setAttribute('content', '#0f172a');
      } else {
        metaThemeColor.setAttribute('content', '#0a0a1a');
      }
    }
  }, [theme, storageKey]);

  const value = {
    theme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
