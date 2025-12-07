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
    name: 'accessToken',
    value: tokens.accessToken,
    ...accessCookieOptions,
  });

  res.cookies.set({
    name: 'refreshToken',
    value: tokens.refreshToken,
    ...refreshCookieOptions,
  });
}

/**
 * Clears auth cookies (useful for logout).
 */
export function clearAuthCookies(res: NextResponse) {
  res.cookies.delete('accessToken');
  res.cookies.delete('refreshToken');
}

// NextResponse already knows the cookie option shape.
// So the best solution is: don’t import CookieOptions at all.
// Just let TypeScript infer the type.
// By using:
// sameSite: "strict" as const
// You safely pin the literal value so TypeScript accepts it everywhere.
// No internal imports.
// No dependency issues.
// No breaking updates
// Your route stays the same
// res.cookies.set("accessToken", accessToken, accessCookieOptions)
// res.cookies.set("refreshToken", refreshToken, refreshCookieOptions)
// No change needed there ✅
