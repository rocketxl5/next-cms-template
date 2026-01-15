'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { ThemeClassName } from '@/lib/theme/mapTheme';

/**
 * Shape of the theme context value.
 *
 * - theme: current active theme
 * - toggleTheme: switches between 'light' and 'dark'
 * - setDefaultTheme: resets theme to default (light)
 * - setUserTheme: explicitly set user-preference theme
 */
type ThemeContextValue = {
  theme: ThemeClassName;
  toggleTheme: () => void;
  setDefaultTheme: () => void;
  setUserTheme: (theme: ThemeClassName) => void;
};

// Create context with nullable default; must be wrapped in provider
const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * ThemeProvider
 * -----------------------------
 * Wrap your app with this provider to enable theme switching.
 *
 * Responsibilities:
 * - Manage theme state in React
 * - Apply theme class to `<html>` root
 * - Persist guest theme preference in cookies (1 year)
 *
 * @param initialTheme - initial theme to apply (from user session or cookie)
 * @param children - React nodes to render
 */
export function ThemeProvider({
  initialTheme,
  children,
}: {
  initialTheme: ThemeClassName;
  children: ReactNode;
}) {
  const [theme, setTheme] = useState<ThemeClassName>(initialTheme);

  /**
   * Toggles between light and dark themes.
   */
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  /**
   * Resets theme to default (light).
   */
  const setDefaultTheme = () => {
    setTheme('light');
  };

  /**
   * Explicitly sets the theme according to user preference.
   */
  const setUserTheme = (userTheme: ThemeClassName) => {
    setTheme(userTheme);
  };

  /**
   * Side effect: updates DOM and cookie whenever theme changes.
   *
   * - Updates <html> class list for Tailwind dark mode
   * - Persists theme in cookie for guests (1 year)
   */
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);

    // Persist theme for guests in a cookie (1 year)
    document.cookie = `theme=${theme}; path=/; max-age=31536000`;
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{ theme, toggleTheme, setDefaultTheme, setUserTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * useTheme
 * -----------------------------
 * Hook to access current theme and helpers.
 *
 * Throws an error if used outside of ThemeProvider.
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
