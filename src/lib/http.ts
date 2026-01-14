/**
 * responseHelpers.ts
 * -------------------------------------------------------
 * Centralized HTTP response helpers for API routes.
 * Provides ready-to-use functions for common status codes:
 * - 400 Bad Request
 * - 401 Unauthorized
 * - 403 Forbidden
 * - 404 Not Found
 * - 500 Internal Server Error
 *
 * Optional integration with auth cookies for 401 responses.
 * -------------------------------------------------------
 */

import { NextResponse } from 'next/server';
import { clearAuthCookies } from './auth/auth-cookies'; // adjust path

/**
 * Helper to return 401 Unauthorized.
 * Clears auth cookies if route is auth-protected.
 */
export function unauthorized(message = 'Unauthorized', clearCookies = true) {
  const res = NextResponse.json({ error: message }, { status: 401 });
  if (clearCookies) clearAuthCookies(res);
  return res;
}

/**
 * Helper to return 403 Forbidden
 */
export function forbidden(message = 'Forbidden') {
  return NextResponse.json({ error: message }, { status: 403 });
}

/**
 * Helper to return 400 Bad Request
 */
export function badRequest(message = 'Bad Request') {
  return NextResponse.json({ error: message }, { status: 400 });
}

/**
 * Helper to return 404 Not Found
 */
export function notFound(message = 'Not Found') {
  return NextResponse.json({ error: message }, { status: 404 });
}

/**
 * Helper to return 500 Internal Server Error
 */
export function internalServerError(message = 'Internal Server Error') {
  return NextResponse.json({ error: message }, { status: 500 });
}

/**
 * Helper to return 409 Conflict (e.g., resource already exists)
 */
export function conflict(message = 'Resource already exists') {
  return NextResponse.json({ error: message }, { status: 409 });
}
