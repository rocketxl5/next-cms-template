/**
 * AUTH COOKIE HELPERS
 * -------------------------------------------------------
 * Purpose:
 *   Centralizes all cookie-related logic for authentication
 *   to keep route handlers clean, consistent, and secure.
 *
 * Responsibilities:
 *   - Define secure default options for auth cookies
 *   - Set access & refresh tokens as HTTP-only cookies
 *   - Clear / remove auth cookies on logout or invalidation
 *
 * Design goals:
 *   - Single source of truth for cookie configuration
 *   - Prevent duplication across auth routes
 *   - Ensure consistent security settings (path, httpOnly, etc.)
 *
 * Security notes:
 *   - Cookies are HTTP-only (not accessible via JS)
 *   - Cookies are set to `secure` in production
 *   - `sameSite: strict` reduces CSRF risk
 *   - Cookies are scoped to the root path ("/")
 *
 * Used by:
 *   - /api/auth/signin
 *   - /api/auth/signup
 *   - /api/auth/refresh
 *   - /api/auth/logout
 * -------------------------------------------------------
 */
import { COOKIE_KEYS } from '@/types/cookies';
import { NextResponse } from 'next/server';
const isProd = process.env.NODE_ENV === 'production';

const accessCookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: 'strict' as const,
  path: '/',
  maxAge: 60 * 15, // 15 minutes
};

const refreshCookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: 'strict' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 7, // 7 days
};

type AuthTokens = { accessToken: string; refreshToken: string };

/**
 * Sets both access + refresh cookies on a NextResponse using the object-shape
 * signature required by recent Next versions.
 */
export function setAuthCookies(res: NextResponse, tokens: AuthTokens) {
  res.cookies.set({
    name: COOKIE_KEYS.accessToken,
    value: tokens.accessToken,
    ...accessCookieOptions,
  });

  res.cookies.set({
    name: COOKIE_KEYS.refreshToken,
    value: tokens.refreshToken,
    ...refreshCookieOptions,
  });
}

/**
 * Clears auth cookies (useful for logout).
 */
export function clearAuthCookies(res: NextResponse) {
  res.cookies.set({
    name: COOKIE_KEYS.accessToken,
    value: '',
    ...accessCookieOptions,
    maxAge: 0,
  });

  res.cookies.set({
    name: COOKIE_KEYS.refreshToken,
    value: '',
    ...refreshCookieOptions,
    maxAge: 0,
  });
}
