'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { ThemeClassName } from '@/lib/theme/mapTheme';

type ThemeContextValue = {
  theme: ThemeClassName;
  toggleTheme: () => void;
  setDefaultTheme: () => void;
  setUserTheme: (theme: ThemeClassName) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({
  initialTheme,
  children,
}: {
  initialTheme: ThemeClassName;
  children: ReactNode;
}) {
  const [theme, setTheme] = useState<ThemeClassName>(initialTheme);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const setDefaultTheme = () => {
    setTheme('light'); // or 'light'
  };

  const setUserTheme = (userTheme: ThemeClassName) => {
    setTheme(userTheme); // explicit setter for user-preference
  };

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    // Persist theme for guests in cookie (1 year)
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

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
