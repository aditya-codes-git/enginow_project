import React, { useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';
import { getAllThemes } from '../themes/themes';
import { FluidDropdown } from './ui/FluidDropdown';
import {
  Sun,
  Moon,
  Waves,
  TreePine,
  Circle,
} from 'lucide-react';

// Map each theme id to a Lucide icon that represents it visually
const THEME_ICONS = {
  light:       Sun,
  dark:        Moon,
  ocean:       Waves,
  forest:      TreePine,
  monochrome:  Circle,
};

export const ThemeSwitcher = () => {
  const { currentTheme, switchTheme, theme } = useTheme();

  // Build the item list once
  const items = useMemo(
    () =>
      getAllThemes().map((t) => ({
        id:      t.id,
        name:    t.name,
        accent:  t.colors?.primaryAccent || t.colors?.primary || '#2563eb',
        surface: t.colors?.surface       || '#ffffff',
        border:  t.colors?.border        || '#e2e8f0',
        text:    t.colors?.textPrimary   || t.colors?.foreground || '#0f172a',
        hover:   t.colors?.hoverSurface  || '#f8fafc',
      })),
    [],
  );

  const active = items.find((i) => i.id === currentTheme) || items[0];
  const ActiveIcon = THEME_ICONS[active.id] || Sun;

  // Solid panel styling derived from the current theme
  const panelBg     = theme.colors.surface      || '#ffffff';
  const panelBorder = theme.colors.border       || '#e2e8f0';

  return (
    <FluidDropdown
      // Trigger label shows active icon + swatch dot + name
      trigger={
        <>
          <span
            className="h-3 w-3 shrink-0 rounded-full border"
            style={{
              backgroundColor: active.accent,
              borderColor:     theme.colors.border,
            }}
          />
          <ActiveIcon
            className="h-3.5 w-3.5 shrink-0"
            style={{ color: theme.colors.textSecondary }}
          />
          <span style={{ color: theme.colors.textPrimary }}>
            {active.name}
          </span>
        </>
      }
      items={items}
      selectedId={currentTheme}
      onSelect={(item) => switchTheme(item.id)}
      // Trigger button style: matches current surface
      triggerStyle={{
        backgroundColor: theme.colors.surface,
        borderColor:     theme.colors.border,
        color:           theme.colors.textPrimary,
        fontFamily:      "'Avenir', sans-serif",
      }}
      // Panel style: opaque, no bleed-through
      panelStyle={{
        backgroundColor: panelBg,
        borderColor:     panelBorder,
      }}
      // Render each item row
      renderItem={(item, isHovered, isSelected) => {
        const Icon = THEME_ICONS[item.id] || Sun;
        return (
          <>
            {/* Accent swatch */}
            <span
              className="h-3 w-3 shrink-0 rounded-full border transition-transform duration-200"
              style={{
                backgroundColor: item.accent,
                borderColor:     isSelected ? item.accent : 'rgba(128,128,128,0.3)',
                transform:       isHovered || isSelected ? 'scale(1.25)' : 'scale(1)',
              }}
            />
            {/* Icon */}
            <Icon
              className="h-4 w-4 shrink-0 transition-colors duration-150"
              style={{
                color: isHovered || isSelected
                  ? item.accent
                  : theme.colors.textMuted,
              }}
            />
            {/* Label */}
            <span
              className="flex-1 text-left transition-colors duration-150"
              style={{
                color: isHovered || isSelected
                  ? theme.colors.textPrimary
                  : theme.colors.textSecondary,
                fontWeight: isSelected ? 600 : 400,
              }}
            >
              {item.name}
            </span>
            {/* Selected check dot */}
            {isSelected && (
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: item.accent }}
              />
            )}
          </>
        );
      }}
    />
  );
};

export default ThemeSwitcher;
