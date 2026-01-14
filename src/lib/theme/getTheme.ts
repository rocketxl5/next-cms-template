import { getSession } from '../server/getSession';
import { getCookie } from '../server/getCookie';
import { ThemeClassName } from './mapTheme';

export async function getTheme(): Promise<ThemeClassName> {
  const session = await getSession();

  const setTheme = (theme?: string): ThemeClassName => {
    return theme === 'dark' ? 'dark' : 'light';
  };

  if (!session) {
    const theme = await getCookie('theme');
    return setTheme(theme);
  }

  return setTheme(session.user.theme);
}
