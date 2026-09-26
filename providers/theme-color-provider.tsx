'use client';

import { createContext, useContext, useEffect, useState } from 'react';

export type AccentColor = 'deep-green' | 'maroon' | 'gold' | 'royal-blue' | 'charcoal';

interface ThemeColorContextType {
  accentColor: AccentColor;
  setAccentColor: (color: AccentColor) => void;
}

const ThemeColorContext = createContext<ThemeColorContextType | undefined>(undefined);

const ACCENT_COLORS: Record<AccentColor, { primary: string; accent: string; glow: string }> = {
  'deep-green': {
    primary: '142 71% 45%', // Bangladeshi flag green
    accent: '199 89% 48%',
    glow: '142 71% 45%',
  },
  maroon: {
    primary: '0 60% 45%', // Tribute red/maroon
    accent: '0 70% 55%',
    glow: '0 60% 45%',
  },
  gold: {
    primary: '38 92% 50%', // Festive gold/amber
    accent: '45 95% 55%',
    glow: '38 92% 50%',
  },
  'royal-blue': {
    primary: '221 83% 53%', // Modern campaign blue
    accent: '199 89% 48%',
    glow: '221 83% 53%',
  },
  charcoal: {
    primary: '220 15% 20%', // Minimal charcoal
    accent: '220 20% 30%',
    glow: '220 15% 20%',
  },
};

export function ThemeColorProvider({ children }: { children: React.ReactNode }) {
  const [accentColor, setAccentColorState] = useState<AccentColor>('deep-green');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('accent-color') as AccentColor;
    if (saved && ACCENT_COLORS[saved]) {
      setAccentColorState(saved);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const colors = ACCENT_COLORS[accentColor];
    const root = document.documentElement;

    root.style.setProperty('--primary', colors.primary);
    root.style.setProperty('--accent', colors.accent);
    root.style.setProperty('--ring', colors.glow);
    root.style.setProperty('--chart-1', colors.primary);
    root.style.setProperty('--chart-2', colors.accent);

    localStorage.setItem('accent-color', accentColor);
  }, [accentColor, mounted]);

  const setAccentColor = (color: AccentColor) => {
    setAccentColorState(color);
  };

  return (
    <ThemeColorContext.Provider value={{ accentColor, setAccentColor }}>
      {children}
    </ThemeColorContext.Provider>
  );
}

export function useThemeColor() {
  const context = useContext(ThemeColorContext);
  if (context === undefined) {
    // Return a fallback during SSR to prevent build errors
    return {
      accentColor: 'deep-green' as AccentColor,
      setAccentColor: () => {},
    };
  }
  return context;
}
