import { cookies } from 'next/headers';
import { COOKIE_KEYS, CookieKey } from '@/types/cookies';
/**
 * Read a cookie value on the server
 * --------------------------------------------------
 * - Server-only helper
 * - Safe for layouts, middleware, route handlers
 * - Returns undefined if cookie does not exist
 */
export async function getCookie(key: CookieKey): Promise<string | undefined> {
  const store = await cookies();
  return store.get(COOKIE_KEYS[key])?.value;
}
