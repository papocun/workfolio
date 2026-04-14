'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'theme';
const LEGACY_STORAGE_KEY = 'workfolio-theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Always initialize to 'dark' for SSR & default rule
  const [theme, setThemeState] = useState<Theme>('dark');
  const transitionTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Synchronize state with early head script & localStorage on mount
  useEffect(() => {
    try {
      const saved = (localStorage.getItem(STORAGE_KEY) ||
        localStorage.getItem(LEGACY_STORAGE_KEY)) as Theme | null;

      if (saved === 'light') {
        setThemeState('light');
        document.documentElement.classList.remove('dark');
      } else if (saved === 'dark') {
        setThemeState('dark');
        document.documentElement.classList.add('dark');
      } else {
        // No saved preference -> ALWAYS DARK MODE
        // Never use system or browser preference
        setThemeState('dark');
        document.documentElement.classList.add('dark');
      }
    } catch {
      // Fallback to dark mode on storage error
      setThemeState('dark');
      document.documentElement.classList.add('dark');
    }

    return () => {
      if (transitionTimerRef.current) {
        clearTimeout(transitionTimerRef.current);
      }
    };
  }, []);

  const setTheme = (t: Theme) => {
    if (t === theme) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Apply coordinated theme-transitioning class only for manual user switches
    if (!prefersReducedMotion && typeof document !== 'undefined') {
      if (transitionTimerRef.current) {
        clearTimeout(transitionTimerRef.current);
      }
      document.documentElement.classList.add('theme-transitioning');
      transitionTimerRef.current = setTimeout(() => {
        document.documentElement.classList.remove('theme-transitioning');
        transitionTimerRef.current = null;
      }, 250);
    }

    setThemeState(t);
    try {
      localStorage.setItem(STORAGE_KEY, t);
      localStorage.setItem(LEGACY_STORAGE_KEY, t);
    } catch {
      // Ignore storage errors (e.g. private browsing quota)
    }

    if (t === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleTheme = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark: theme === 'dark',
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
