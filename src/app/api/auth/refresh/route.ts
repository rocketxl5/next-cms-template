/**
 * REFRESH TOKEN ROUTE
 * -------------------------------------------------------
 * Purpose:
 *   Rotates refresh tokens and issues a new access token.
 *
 * Flow:
 *   1. Read refreshToken cookie
 *   2. Verify JWT and check against hashed token in DB
 *   3. If valid:
 *        - Generate new access token
 *        - Optionally generate new refresh token
 *        - Store hashed refresh token in DB
 *        - Set cookies
 *        - Return user info (optional)
 *   4. If invalid:
 *        - Clear cookies
 *        - Return 401 Unauthorized
 *
 * Security notes:
 *   - Refresh token is httpOnly
 *   - Database stores only hashed refresh token
 *   - Rotation prevents reuse of old refresh tokens
 *
 * Method: POST /api/auth/refresh
 * Access: Authenticated (via refresh token)
 * -------------------------------------------------------
 */

import { NextResponse } from 'next/server';
import { getCookie } from '@/lib/server/getCookie';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import {
  verifyRefreshToken,
  createAccessToken,
  createRefreshToken,
} from '@/lib/auth/tokens';
import { setAuthCookies } from '@/lib/auth/auth-cookies';
import { unauthorized, internalServerError } from '@/lib/http';

export async function POST() {
  try {
    const refreshToken = await getCookie('refreshToken');

    if (!refreshToken) {
      return unauthorized('Missing refresh token');
    }

    let decoded;

    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch {
      return unauthorized('Invalid refresh token');
    }

    const userId = decoded.id as string;

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user || !user.refreshTokenHash) {
      return unauthorized();
    }

    const isValid = await bcrypt.compare(refreshToken, user.refreshTokenHash);

    if (!isValid) {
      return unauthorized();
    }

    // Token rotation
    const accessToken = createAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const newRefreshToken = createRefreshToken({ id: user.id });
    const hashedRefreshToken = await bcrypt.hash(newRefreshToken, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshTokenHash: hashedRefreshToken },
    });

    const res = NextResponse.json(
      { user: { id: user.id, email: user.email, role: user.role } },
      { status: 200 }
    );

    // Set access & refresh cookies
    setAuthCookies(res, {
      accessToken,
      refreshToken: newRefreshToken,
    });

    return res;
  } catch (error) {
    console.error('REFRESH ERROR:', error);
    return internalServerError();
  }
}
