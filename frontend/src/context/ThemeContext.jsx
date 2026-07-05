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
      if (!hex || typeof hex !== 'string') return '255 255 255';
      const normalized = hex.replace('#', '');
      const value = normalized.length === 3
        ? normalized.split('').map((char) => char + char).join('')
        : normalized;
      const number = parseInt(value, 16);

      return `${(number >> 16) & 255} ${(number >> 8) & 255} ${number & 255}`;
    };

    const isHex = (val) => typeof val === 'string' && val.startsWith('#');

    // Set CSS variables and dynamically generate RGB variables for any hex colors
    Object.entries(theme.css).forEach(([key, value]) => {
      root.style.setProperty(key, value);
      if (isHex(value)) {
        root.style.setProperty(`${key}-rgb`, hexToRgb(value));
      }
    });

    // Backward compatibility mappings
    const primaryColor = theme.colors.primaryAccent || theme.colors.primary;
    const secondaryColor = theme.colors.accentHover || theme.colors.secondary;
    const accentColor = theme.colors.primaryAccent || theme.colors.accent;
    const mutedColor = theme.colors.textMuted || theme.colors.muted;
    const surfaceColor = theme.colors.surface;
    const borderColor = theme.colors.border;
    const bgColor = theme.colors.background;
    const textOnPrimaryColor = theme.colors.textOnPrimary || '#ffffff';

    root.style.setProperty('--color-primary', primaryColor);
    root.style.setProperty('--color-secondary', secondaryColor);
    root.style.setProperty('--color-accent', accentColor);
    root.style.setProperty('--color-muted', mutedColor);
    root.style.setProperty('--text-on-primary', textOnPrimaryColor);
    root.style.setProperty('--primary-rgb', hexToRgb(primaryColor));
    root.style.setProperty('--secondary-rgb', hexToRgb(secondaryColor));
    root.style.setProperty('--accent-rgb', hexToRgb(accentColor));
    root.style.setProperty('--surface-rgb', hexToRgb(surfaceColor));
    root.style.setProperty('--border-rgb', hexToRgb(borderColor));
    root.style.setProperty('--bg-rgb', hexToRgb(bgColor));

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

  const activeTheme = getTheme(currentTheme);
  const compatTheme = {
    ...activeTheme,
    colors: {
      ...activeTheme.colors,
      background: activeTheme.colors.background,
      foreground: activeTheme.colors.textPrimary || activeTheme.colors.foreground || '#000000',
      primary: activeTheme.colors.primaryAccent || activeTheme.colors.primary,
      secondary: activeTheme.colors.accentHover || activeTheme.colors.secondary,
      accent: activeTheme.colors.primaryAccent || activeTheme.colors.accent,
      muted: activeTheme.colors.textMuted || activeTheme.colors.muted,
      border: activeTheme.colors.border,
      surface: activeTheme.colors.surface,
      textOnPrimary: activeTheme.colors.textOnPrimary || '#ffffff',
      footerBackground: activeTheme.colors.footerBackground,
      footerHeading: activeTheme.colors.footerHeading,
      footerText: activeTheme.colors.footerText,
      footerMuted: activeTheme.colors.footerMuted,
      footerBorder: activeTheme.colors.footerBorder,
      footerIcon: activeTheme.colors.footerIcon,
      footerHover: activeTheme.colors.footerHover,
    }
  };

  const value = {
    currentTheme,
    switchTheme,
    theme: compatTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
