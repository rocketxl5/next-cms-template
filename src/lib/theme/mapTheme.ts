import { Theme as DbTheme } from '@prisma/client';

function assertNever(x: never): never {
  throw new Error(`Unhandled case: ${x}`);
}

export type ThemeClassName = 'light' | 'dark' | 'system';

export function mapDatabaseThemeToCss(theme: DbTheme): ThemeClassName {
  switch (theme) {
    case 'DARK':
      return 'dark';
    case 'LIGHT':
      return 'light';
    case 'SYSTEM':
      return 'light'; // SSR-safe fallback
    default:
      return assertNever(theme);
  }
}

export function mapCssThemeToDatabase(theme: ThemeClassName): DbTheme {
  switch (theme) {
    case 'dark':
      return 'DARK';
    case 'light':
      return 'LIGHT';
    case 'system':
      return 'SYSTEM';
    default:
      return assertNever(theme);
  }
}
