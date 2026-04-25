'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from 'react';

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

// Exact phase durations for fast, crisp transition (total perceived time ~220ms)
const PHASE1_COVER_MS = 110;
const PHASE3_REVEAL_MS = 110;

// Theme neutral surface colors
const DARK_SURFACE = '#000000';
const LIGHT_SURFACE = '#FAF9F6';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Always initialize to 'dark' for SSR consistency with initial HTML class
  const [theme, setThemeState] = useState<Theme>('dark');
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  const overlayRef = useRef<HTMLDivElement | null>(null);
  const isTransitioningRef = useRef<boolean>(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearAllTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  // Synchronize state with early head script & localStorage on mount
  useEffect(() => {
    try {
      const saved = (localStorage.getItem(STORAGE_KEY) ||
        localStorage.getItem(LEGACY_STORAGE_KEY)) as Theme | null;

      if (saved === 'light') {
        setThemeState('light');
        document.documentElement.classList.remove('dark');
      } else {
        // Default or saved dark -> ALWAYS DARK MODE
        setThemeState('dark');
        document.documentElement.classList.add('dark');
      }
    } catch {
      setThemeState('dark');
      document.documentElement.classList.add('dark');
    }

    return () => {
      clearAllTimers();
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

    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const setTheme = useCallback(
    (targetTheme: Theme) => {
      if (targetTheme === theme) return;
      if (isTransitioningRef.current) return; // Prevent race conditions & overlapping transitions

      // Check prefers-reduced-motion
      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (prefersReducedMotion || !overlayRef.current) {
        executeImmediateThemeChange(targetTheme);
        return;
      }

      const overlay = overlayRef.current;
      isTransitioningRef.current = true;
      setIsTransitioning(true);
      clearAllTimers();

      // Current theme surface color:
      // Dark -> #000000 (covers dark mode seamlessly)
      // Light -> #FAF9F6 (covers light mode seamlessly)
      const currentBg = theme === 'dark' ? DARK_SURFACE : LIGHT_SURFACE;

      // Phase 1 — COVER
      // Prepare overlay with current theme background
      overlay.style.transition = 'none';
      overlay.style.backgroundColor = currentBg;
      overlay.style.opacity = '0';
      overlay.style.display = 'block';

      // Force layout reflow so opacity: 0 is registered before starting transition
      void overlay.offsetHeight;

      // Animate overlay opacity to 1 (cover viewport)
      overlay.style.transition = `opacity ${PHASE1_COVER_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`;
      overlay.style.opacity = '1';

      // Once cover completes:
      const coverTimer = setTimeout(() => {
        // Phase 2 — SWITCH (underneath the 100% opaque overlay)
        if (targetTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        setThemeState(targetTheme);
        try {
          localStorage.setItem(STORAGE_KEY, targetTheme);
          localStorage.setItem(LEGACY_STORAGE_KEY, targetTheme);
        } catch {
          // Ignore storage errors
        }

        // Wait for React & browser render underneath overlay (double rAF)
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            // Phase 3 — REVEAL
            // Fade overlay out to reveal the completed new theme as one unified layer
            overlay.style.transition = `opacity ${PHASE3_REVEAL_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`;
            overlay.style.opacity = '0';

            const revealTimer = setTimeout(() => {
              overlay.style.display = 'none';
              isTransitioningRef.current = false;
              setIsTransitioning(false);
            }, PHASE3_REVEAL_MS);

            timersRef.current.push(revealTimer);
          });
        });
      }, PHASE1_COVER_MS);

      timersRef.current.push(coverTimer);
    },
    [theme, executeImmediateThemeChange]
  );

  const toggleTheme = useCallback(() => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
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
      {/* Global Theme Transition Overlay — sits above all content (z-[999999]) */}
      <div
        ref={overlayRef}
        id="theme-transition-overlay"
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 999999,
          pointerEvents: 'none',
          display: 'none',
          opacity: 0,
          willChange: 'opacity',
        }}
      />
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
