import React, { createContext, useContext, useEffect, useState } from 'react';
import { getTheme, defaultTheme } from '../themes/themes';

// Create Theme Context
const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    // Get saved theme from localStorage or use default
    if (typeof window !== 'undefined') {
      return localStorage.getItem('appTheme') || defaultTheme;
    }
    return defaultTheme;
  });

  useEffect(() => {
    // Apply theme to document
    const theme = getTheme(currentTheme);
    const root = document.documentElement;
    const body = document.body;
    const hexToRgb = (hex) => {
      const normalized = hex.replace('#', '');
      const value = normalized.length === 3
        ? normalized.split('').map((char) => char + char).join('')
        : normalized;
      const number = parseInt(value, 16);

      return `${(number >> 16) & 255} ${(number >> 8) & 255} ${number & 255}`;
    };

    // Set CSS variables
    Object.entries(theme.css).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    root.style.setProperty('--color-primary', theme.colors.primary);
    root.style.setProperty('--color-secondary', theme.colors.secondary);
    root.style.setProperty('--color-accent', theme.colors.accent);
    root.style.setProperty('--color-muted', theme.colors.muted);
    root.style.setProperty('--primary-rgb', hexToRgb(theme.colors.primary));
    root.style.setProperty('--secondary-rgb', hexToRgb(theme.colors.secondary));
    root.style.setProperty('--accent-rgb', hexToRgb(theme.colors.accent));
    root.style.setProperty('--surface-rgb', hexToRgb(theme.colors.surface));
    root.style.setProperty('--border-rgb', hexToRgb(theme.colors.border));

    // Set data attribute for theme
    root.setAttribute('data-theme', currentTheme);
    body.setAttribute('data-theme', currentTheme);

    // Save to localStorage
    localStorage.setItem('appTheme', currentTheme);

    // Add Avenir font to document
    document.documentElement.style.fontFamily = "'Avenir', 'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  }, [currentTheme]);

  const switchTheme = (themeName) => {
    setCurrentTheme(themeName);
  };

  const value = {
    currentTheme,
    switchTheme,
    theme: getTheme(currentTheme),
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
