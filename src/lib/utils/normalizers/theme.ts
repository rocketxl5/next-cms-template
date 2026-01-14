import { ThemeClassName } from '@/lib/theme/mapTheme';

export function isThemeClassName(
  value: string | undefined
): value is ThemeClassName {
  return value === 'light' || value === 'dark';
}