import { getCookie } from './getCookie';
import { verifyAccessToken } from '../auth/tokens';
import { User } from '@/types/users';
import { COOKIE_KEYS } from '@/types/cookies';

export type Session = { user: User } | null;

export async function getSession(): Promise<Session> {
  const token = await getCookie(COOKIE_KEYS.accessToken);

  if (!token) return null;

  try {
    const payload = verifyAccessToken(token);

    const user: User = {
      id: payload.id,
      role: payload.role,
      email: payload.email,
      theme: payload.theme,
    };
    return { user };
  } catch {
    return null;
  }
}
