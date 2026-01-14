'use client';

import { useTheme } from "@/components/providers/ThemeProvider";
import { resolveNextTheme } from '@/lib/theme/resolveNextTheme';

export function ToggleThemeBtn() {
  const { theme, toggleTheme } = useTheme();

  const handleClick = async () => {
    const nextTheme = resolveNextTheme(theme);

    toggleTheme(); // UI state update

    try {
      const res = await fetch('/api/user/theme', {
        method: 'PATCH',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ theme: nextTheme }),
      });

      if(!res.ok) {
        console.error('Server error updating theme', res.status)
      }
    } catch (error) {
      console.error('Network error updating theme', error);
    }
  };

  return <button onClick={handleClick}>Toggle theme: {theme}</button>;
}