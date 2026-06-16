import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { getAllThemes } from '../themes/themes';

export const ThemeSwitcher = () => {
  const { currentTheme, switchTheme, theme } = useTheme();
  const themes = getAllThemes();
  const activeTheme = themes.find((item) => item.id === currentTheme) || themes[0];

  return (
    <label
      className="theme-switcher flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold"
      style={{
        fontFamily: "'Avenir', sans-serif",
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border,
        color: theme.colors.foreground,
      }}
    >
      <span
        className="h-3 w-3 rounded-full border"
        style={{
          backgroundColor: activeTheme.colors.primary,
          borderColor: activeTheme.colors.border,
        }}
      />
      <span className="sr-only">
        Theme:
      </span>
      <select
        value={currentTheme}
        onChange={(event) => switchTheme(event.target.value)}
        className="cursor-pointer bg-transparent text-sm font-semibold outline-none"
        style={{
          color: theme.colors.foreground,
        }}
        aria-label="Select theme"
      >
        {themes.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>
    </label>
  );
};

export default ThemeSwitcher;
