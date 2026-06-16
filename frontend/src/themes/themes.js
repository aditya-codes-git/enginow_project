// Theme configuration for the application
// Provides multiple theme options with consistent Avenir font

export const themes = {
  light: {
    name: 'Light',
    colors: {
      background: '#ffffff',
      foreground: '#000000',
      primary: '#2563eb',
      secondary: '#1d4ed8',
      accent: '#06b6d4',
      muted: '#64748b',
      border: '#e2e8f0',
      surface: '#f8fafc',
    },
    css: {
      '--bg-primary': '#ffffff',
      '--text-primary': '#000000',
      '--text-secondary': '#475569',
      '--border-color': '#e2e8f0',
      '--surface-color': '#f8fafc',
    },
  },
  dark: {
    name: 'Dark',
    colors: {
      background: '#020617',
      foreground: '#ffffff',
      primary: '#3b82f6',
      secondary: '#2563eb',
      accent: '#06b6d4',
      muted: '#94a3b8',
      border: '#1e293b',
      surface: '#0f172a',
    },
    css: {
      '--bg-primary': '#020617',
      '--text-primary': '#ffffff',
      '--text-secondary': '#94a3b8',
      '--border-color': '#1e293b',
      '--surface-color': '#0f172a',
    },
  },
  ocean: {
    name: 'Ocean',
    colors: {
      background: '#e0f2fe',
      foreground: '#0c2d48',
      primary: '#0ea5e9',
      secondary: '#06b6d4',
      accent: '#0369a1',
      muted: '#0c4a6e',
      border: '#7dd3fc',
      surface: '#cffafe',
    },
    css: {
      '--bg-primary': '#e0f2fe',
      '--text-primary': '#0c2d48',
      '--text-secondary': '#0369a1',
      '--border-color': '#7dd3fc',
      '--surface-color': '#cffafe',
    },
  },
  forest: {
    name: 'Forest',
    colors: {
      background: '#f0fdf4',
      foreground: '#1b4332',
      primary: '#16a34a',
      secondary: '#059669',
      accent: '#7c2d12',
      muted: '#15803d',
      border: '#86efac',
      surface: '#dcfce7',
    },
    css: {
      '--bg-primary': '#f0fdf4',
      '--text-primary': '#1b4332',
      '--text-secondary': '#15803d',
      '--border-color': '#86efac',
      '--surface-color': '#dcfce7',
    },
  },
  sunset: {
    name: 'Sunset',
    colors: {
      background: '#fef3c7',
      foreground: '#78350f',
      primary: '#f59e0b',
      secondary: '#f97316',
      accent: '#dc2626',
      muted: '#ea580c',
      border: '#fbbf24',
      surface: '#fcd34d',
    },
    css: {
      '--bg-primary': '#fef3c7',
      '--text-primary': '#78350f',
      '--text-secondary': '#ea580c',
      '--border-color': '#fbbf24',
      '--surface-color': '#fcd34d',
    },
  },
  lavender: {
    name: 'Lavender',
    colors: {
      background: '#faf5ff',
      foreground: '#3f0f8f',
      primary: '#a78bfa',
      secondary: '#d8b4fe',
      accent: '#c084fc',
      muted: '#7c3aed',
      border: '#e9d5ff',
      surface: '#f3e8ff',
    },
    css: {
      '--bg-primary': '#faf5ff',
      '--text-primary': '#3f0f8f',
      '--text-secondary': '#7c3aed',
      '--border-color': '#e9d5ff',
      '--surface-color': '#f3e8ff',
    },
  },
  monochrome: {
    name: 'Monochrome',
    colors: {
      background: '#f5f5f5',
      foreground: '#1a1a1a',
      primary: '#404040',
      secondary: '#595959',
      accent: '#000000',
      muted: '#808080',
      border: '#d9d9d9',
      surface: '#eeeeee',
    },
    css: {
      '--bg-primary': '#f5f5f5',
      '--text-primary': '#1a1a1a',
      '--text-secondary': '#595959',
      '--border-color': '#d9d9d9',
      '--surface-color': '#eeeeee',
    },
  },
};

export const defaultTheme = 'light';

export const getTheme = (themeName) => {
  return themes[themeName] || themes[defaultTheme];
};

export const getAllThemes = () => {
  return Object.entries(themes).map(([key, value]) => ({
    id: key,
    ...value,
  }));
};
