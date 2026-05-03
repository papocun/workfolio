'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from 'react';
import { flushSync } from 'react-dom';

export type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  isTransitioning: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'theme';
const LEGACY_STORAGE_KEY = 'workfolio-theme';

// Theme neutral surface colors
const DARK_SURFACE = '#000000';
const LIGHT_SURFACE = '#FAF9F6';

// Helper to synchronize all DOM theme surfaces synchronously
const applyThemeToDOM = (targetTheme: Theme) => {
  if (typeof document === 'undefined') return;
  const isDark = targetTheme === 'dark';
  const root = document.documentElement;

  if (isDark) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

  root.setAttribute('data-theme', targetTheme);
  root.style.backgroundColor = isDark ? DARK_SURFACE : LIGHT_SURFACE;
  root.style.colorScheme = isDark ? 'dark' : 'light';

  const meta = document.getElementById('meta-theme-color');
  if (meta) {
    meta.setAttribute('content', isDark ? DARK_SURFACE : LIGHT_SURFACE);
  }
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Initialize to actual DOM state if available, default to 'dark' for SSR
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof document !== 'undefined') {
      return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    }
    return 'dark';
  });
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const isTransitioningRef = useRef<boolean>(false);

  // Synchronize state with early head script & localStorage on mount
  useEffect(() => {
    try {
      const saved = (localStorage.getItem(STORAGE_KEY) ||
        localStorage.getItem(LEGACY_STORAGE_KEY)) as Theme | null;

      const nextTheme: Theme = saved === 'light' ? 'light' : 'dark';
      setThemeState(nextTheme);
      applyThemeToDOM(nextTheme);
    } catch {
      setThemeState('dark');
      applyThemeToDOM('dark');
    }

    // Safely remove initial load transition blocker after first paint
    const frameId = requestAnimationFrame(() => {
      document.documentElement.classList.remove('no-theme-transition');
    });

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, []);

  const executeImmediateThemeChange = useCallback((nextTheme: Theme) => {
    setThemeState(nextTheme);
    try {
      localStorage.setItem(STORAGE_KEY, nextTheme);
      localStorage.setItem(LEGACY_STORAGE_KEY, nextTheme);
    } catch {
      // Ignore storage errors
    }

    applyThemeToDOM(nextTheme);
  }, []);

  const setTheme = useCallback(
    (targetTheme: Theme) => {
      if (targetTheme === theme) return;
      if (isTransitioningRef.current) return; // Prevent overlapping transitions

      // Check prefers-reduced-motion
      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // Check if browser supports View Transition API
      const supportsViewTransition =
        typeof document !== 'undefined' &&
        'startViewTransition' in document &&
        typeof document.startViewTransition === 'function';

      // Fallback immediately if reduced motion is preferred or View Transition is unsupported
      if (prefersReducedMotion || !supportsViewTransition) {
        executeImmediateThemeChange(targetTheme);
        return;
      }

      isTransitioningRef.current = true;
      setIsTransitioning(true);

      try {
        // Temporarily disable component-level transitions so the new DOM snapshot renders cleanly
        document.documentElement.classList.add('theme-transitioning');

        const transition = document.startViewTransition(() => {
          applyThemeToDOM(targetTheme);

          // Force synchronous React state commit so new tree renders immediately into snapshot
          flushSync(() => {
            setThemeState(targetTheme);
          });

          try {
            localStorage.setItem(STORAGE_KEY, targetTheme);
            localStorage.setItem(LEGACY_STORAGE_KEY, targetTheme);
          } catch {
            // Ignore storage errors
          }
        });

        const cleanup = () => {
          document.documentElement.classList.remove('theme-transitioning');
          isTransitioningRef.current = false;
          setIsTransitioning(false);
        };

        transition.finished.then(cleanup, cleanup);
      } catch {
        // Safe fallback if startViewTransition throws unexpectedly
        executeImmediateThemeChange(targetTheme);
        document.documentElement.classList.remove('theme-transitioning');
        isTransitioningRef.current = false;
        setIsTransitioning(false);
      }
    },
    [theme, executeImmediateThemeChange]
  );

  const toggleTheme = useCallback(() => {
    const isCurrentlyDark =
      typeof document !== 'undefined'
        ? document.documentElement.classList.contains('dark')
        : theme === 'dark';
    const next: Theme = isCurrentlyDark ? 'light' : 'dark';
    setTheme(next);
  }, [theme, setTheme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark: theme === 'dark',
        isTransitioning,
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
