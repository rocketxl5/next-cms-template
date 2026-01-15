import { getSession } from '../server/getSession';
import { getCookie } from '../server/getCookie';
import { ThemeClassName } from './mapTheme';

/**
 * Resolves the current theme class name for the application.
 *
 * Priority:
 * 1. Authenticated users → theme stored in session.user.theme
 * 2. Unauthenticated users → theme stored in cookie ("theme")
 * 3. Fallback → "light"
 *
 * This helper always returns a valid ThemeClassName
 * ("light" | "dark") and never propagates invalid values.
 */
export async function getTheme(): Promise<ThemeClassName> {
  // Attempt to resolve the current user session (server-side)
  const session = await getSession();

  /**
   * Normalizes any theme-like input into a valid ThemeClassName.
   *
   * Only "dark" is treated explicitly; all other values
   * (including undefined, null, or unexpected strings)
   * safely fall back to "light".
   */
  const setTheme = (theme?: string): ThemeClassName => {
    return theme === 'dark' ? 'dark' : 'light';
  };

  // If the user is not authenticated, rely on the persisted cookie
  if (!session) {
    const theme = await getCookie('theme');
    return setTheme(theme);
  }

  // Authenticated users: theme is sourced from the session user record
  return setTheme(session.user.theme);
}