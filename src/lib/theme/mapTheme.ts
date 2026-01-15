import { Theme as DbTheme } from '@prisma/client';

/**
 * Exhaustiveness guard used to ensure all enum / union cases
 * are handled at compile time.
 *
 * If a new value is added to the source type and not handled
 * in a switch statement, TypeScript will error before runtime.
 */
function assertNever(x: never): never {
  throw new Error(`Unhandled case: ${x}`);
}

/**
 * Theme values used by the UI layer (CSS / Tailwind / DOM).
 *
 * - "system" represents a user preference, not a concrete color mode
 * - Resolution of "system" → "light" | "dark" happens elsewhere
 */
export type ThemeClassName = 'light' | 'dark' | 'system';

/**
 * Maps a database-stored theme enum to a CSS-compatible theme value.
 *
 * Notes:
 * - DATABASE: enum Theme { LIGHT, DARK, SYSTEM }
 * - UI expects a concrete class name ("light" | "dark")
 * - "SYSTEM" is resolved to "light" as an SSR-safe default
 *   to avoid hydration mismatches and flash issues
 */
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

/**
 * Maps a UI theme value back to the database enum.
 *
 * Used when persisting user preferences.
 * This function performs a strict, explicit mapping
 * to prevent invalid values from reaching the database.
 */
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
