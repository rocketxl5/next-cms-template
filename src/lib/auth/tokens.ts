/**
 * AUTH TOKEN HELPERS
 * -------------------------------------------------------
 * Purpose:
 *   Centralizes all JWT token creation and verification logic
 *   to ensure consistency, security, and auditability.
 *
 * Responsibilities:
 *   - Generate short-lived access tokens (JWT)
 *   - Generate long-lived refresh tokens (JWT)
 *   - Verify and decode tokens in Node.js runtimes
 *   - Provide Edge-safe verification helpers for middleware
 *
 * Runtime awareness (IMPORTANT):
 *   This file intentionally supports TWO runtimes:
 *
 *   1) Node.js runtime (API routes)
 *      - Used by: /api/auth/*
 *      - Library: jsonwebtoken
 *      - Reason: Simple API + full Node.js crypto support
 *
 *   2) Edge runtime (middleware.ts)
 *      - Used by: middleware route protection
 *      - Library: jose
 *      - Reason: Edge does NOT support Node's crypto module
 *
 *   ⚠️ Do NOT use `jsonwebtoken` in middleware.
 *   ⚠️ Do NOT use Node-specific APIs in Edge runtime code.
 *
 * Design goals:
 *   - Keep token logic isolated from route handlers
 *   - Ensure identical token format across runtimes
 *   - Make token behavior easy to reason about and change
 *   - Prevent runtime-specific failures in production
 *
 * Security notes:
 *   - Secrets are loaded from environment variables
 *   - Access tokens are short-lived to limit exposure
 *   - Refresh tokens support rotation and revocation
 *   - Refresh tokens are never stored in plaintext
 *   - JWT payloads contain no sensitive data
 *
 * Used by:
 *   - /api/auth/signin        (Node runtime)
 *   - /api/auth/signup        (Node runtime)
 *   - /api/auth/refresh       (Node runtime)
 *   - /api/auth/signout       (Node runtime)
 *   - middleware.ts           (Edge runtime via jose)
 * -------------------------------------------------------
 */


import jwt, { JwtPayload } from 'jsonwebtoken';
import { jwtVerify } from 'jose';
import { authConfig } from './config';

/**
 * Token payload shared across auth flows
 */
type TokenPayload = {
  id: string;
  email?: string;
  role?: string;
};

/**
 * Create short-lived access token
 */
export function createAccessToken(payload: TokenPayload) {
  return jwt.sign(payload, authConfig.accessSecret, {
    expiresIn: authConfig.accessExpires,
  });
}

/**
 * Create long-lived refresh token
 * (minimal payload by design)
 */
export function createRefreshToken(payload: { id: string }) {
  return jwt.sign(payload, authConfig.refreshSecret, {
    expiresIn: authConfig.refreshExpires,
  });
}

/**
 * Verify and decode refresh token
 */
export function verifyRefreshToken(token: string): JwtPayload {
  const decoded = jwt.verify(token, authConfig.refreshSecret);

  if (typeof decoded === 'string') {
    throw new Error('Invalid refresh token payload');
  }

  return decoded;
}

/**
 * Verify and decode access token
 */
export function verifyAccessToken(token: string): JwtPayload {
  const decoded = jwt.verify(token, authConfig.accessSecret);

  if (typeof decoded === 'string') {
    throw new Error('Invalid token payload');
  }

  return decoded;
}

/**
 * EDGE RUNTIME TOKENS (MIDDLEWARE)
 */
const encoder = new TextEncoder();

export async function verifyAccessTokenEdge(token: string) {
  const secret = encoder.encode(authConfig.accessSecret);

  const {payload} = await jwtVerify(token, secret);

  return payload // { id, role, email, exp, ... }
}
