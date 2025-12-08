/**
 * AUTH TOKEN HELPERS
 * -------------------------------------------------------
 * Purpose:
 *   Centralizes all JWT token creation and verification
 *   to ensure consistent logic and strict security.
 *
 * Responsibilities:
 *   - Generate short-lived access tokens
 *   - Generate long-lived refresh tokens
 *   - Verify token signatures and decode payloads
 *
 * Design goals:
 *   - Keep token logic isolated from route handlers
 *   - Make token behavior easy to audit and change
 *   - Prevent duplication and misconfiguration
 *
 * Security notes:
 *   - Secrets are loaded from environment variables
 *   - Access tokens are short-lived to reduce exposure
 *   - Refresh tokens support rotation and revocation
 *   - No sensitive data is stored in the payload
 *
 * Used by:
 *   - /api/auth/signin
 *   - /api/auth/signup
 *   - /api/auth/refresh
 *   - Middleware / protected route handlers
 * -------------------------------------------------------
 */

import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import { getExpires } from './env';

export const ACCESS_EXPIRES_IN = getExpires('JWT_ACCESS_EXPIRES_IN', '15m');
export const REFRESH_EXPIRES_IN = getExpires('JWT_REFRESH_EXPIRES_IN', '7d');

type TokenPayload = {
  id: string;
  email?: string;
  role?: string;
};

export function createAccessToken(payload: TokenPayload) {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET as Secret, {
    expiresIn: ACCESS_EXPIRES_IN,
  });
}

export function createRefreshToken(payload: { id: string }) {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET as Secret, {
    expiresIn: REFRESH_EXPIRES_IN,
  });
}

export function verifyRefreshToken(token: string): JwtPayload {
  const secret = process.env.JWT_REFRESH_SECRET!;

  const decoded = jwt.verify(token, secret);

  if (typeof decoded === 'string') {
    throw new Error('Invalid token payload');
  }

  return decoded as JwtPayload;
}

export function verifyAccessToken(token: string): JwtPayload {
  const secret = process.env.JWT_ACCESS_SECRET!;

  const decoded = jwt.verify(token, secret);

  if (typeof decoded === 'string') {
    throw new Error('Invalid token payload');
  }

  return decoded as JwtPayload;
}

