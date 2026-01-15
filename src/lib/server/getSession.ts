import { getCookie } from './getCookie';
import { verifyAccessToken } from '../auth/tokens';
import { User } from '@/types/users';
import { COOKIE_KEYS } from '@/types/cookies';

/**
 * The resolved session object.
 *
 * - `{ user: User }` when a valid session exists
 * - `null` when no valid session is found
 */
export type Session = { user: User } | null;

/**
 * Retrieves the current user's session from cookies.
 *
 * Steps:
 * 1. Read the access token from the cookies.
 * 2. If no token exists, return `null` (unauthenticated).
 * 3. Verify the token and extract payload.
 * 4. Map payload to a `User` object.
 * 5. If verification fails (invalid/expired token), return `null`.
 *
 * Guarantees:
 * - Always returns either a fully-formed `User` object or `null`.
 * - Never throws an error to callers.
 */
export async function getSession(): Promise<Session> {
  // Get the access token from cookies (server-side)
  const token = await getCookie(COOKIE_KEYS.accessToken);

  // No token → unauthenticated
  if (!token) return null;

  try {
    // Verify JWT and extract payload
    const payload = verifyAccessToken(token);

    // Map token payload to application User object
    const user: User = {
      id: payload.id,
      role: payload.role,
      email: payload.email,
      theme: payload.theme,
    };

    return { user };
  } catch {
    // Invalid or expired token → treat as unauthenticated
    return null;
  }
}
