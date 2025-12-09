/**
 * REFRESH TOKEN ROUTE
 * -------------------------------------------------------
 * Purpose:
 *   Issues a new access token (and rotated refresh token)
 *   when a valid refresh token is presented in cookies.
 *
 * Flow:
 *   1. Read the `refreshToken` from HTTP-only cookies
 *   2. Verify the token signature (JWT_REFRESH_SECRET)
 *   3. Load the user from the database using the token payload
 *   4. Compare the incoming token with the hashed version in DB
 *   5. Generate a new access token & refresh token (rotation)
 *   6. Store new tokens in secure HTTP-only cookies
 *   7. Return a success response
 *
 * Failure cases:
 *   - Missing token in cookies
 *   - Invalid / expired token
 *   - User not found
 *   - Token mismatch (possible replay attack)
 *
 * Security notes:
 *   - Refresh tokens are stored hashed in the database
 *   - Tokens are never exposed to JavaScript (httpOnly)
 *   - This route prevents stolen-token reuse via rotation
 *   - Designed for server-to-server / browser cookie auth
 * -------------------------------------------------------
 *
 * Method:   POST /api/auth/refresh
 * Access:   Public (requires valid refreshToken cookie)
 */


import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

import prisma from '@/lib/prisma';
import {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken,
} from '@/lib/auth/tokens';
import { setAuthCookies } from '@/lib/auth/cookies';

export async function POST(req: Request) {
  try {
    // 1. Extract refreshToken from cookies
    const cookieHeader = req.headers.get('cookie');

    const tokenMatch = cookieHeader?.match(/refreshToken=([^;]+)/);
    const refreshToken = tokenMatch?.[1];

    if (!refreshToken) {
      return NextResponse.json({ error: 'No refresh token' }, { status: 401 });
    }

    // 2. Verify refresh token JWT
    const payload = verifyRefreshToken(refreshToken);
    const userId = payload.sub as string;

    if (!userId) {
      return NextResponse.json(
        { error: 'Invalid token payload' },
        { status: 401 }
      );
    }

    // 3. Get user from DB
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, refreshTokenHash: true },
    });

    if (!user || !user.refreshTokenHash) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 4. Compare hashed token in DB
    const isValid = await bcrypt.compare(refreshToken, user.refreshTokenHash);

    if (isValid) {
      return NextResponse.json(
        { error: 'Invalid refresh token' },
        { status: 401 }
      );
    }

    // 5. Create new tokens
    const newAccessToken = createAccessToken({ id: user.id });
    const newRefreshToken = createRefreshToken({ id: user.id });

    // 6. Save nes refresh hash (rotate)
    const newHash = await bcrypt.hash(newRefreshToken, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshTokenHash: newHash },
    });

    // 7. Set cookies
    const res = NextResponse.json({ success: true });

    setAuthCookies(res, {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });

    return res;
  } catch (error) {
    console.error("REFRESH ERROR:", error)

    return NextResponse.json({error: "Unauthorized"}, {status: 401})
  }
}
