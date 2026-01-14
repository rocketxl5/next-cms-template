/**
 * CURRENT USER ROUTE
 * -------------------------------------------------------
 * Purpose:
 *   Returns the currently authenticated user's information.
 *
 * Flow:
 *   1. Read accessToken from cookies
 *   2. Verify JWT
 *   3. Fetch user info from DB (optional select fields)
 *   4. Return user info
 *   5. On failure: return 401 Unauthorized
 *
 * Security notes:
 *   - Only safe user fields returned (no password / refresh token)
 *   - Access token verification is required
 *
 * Method: GET /api/auth/me
 * Access: Authenticated (access token)
 * -------------------------------------------------------
 */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { verifyAccessToken } from '@/lib/auth/tokens';
import { unauthorized, internalServerError } from '@/lib/http';
import { COOKIE_KEYS } from '@/types/cookies';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(COOKIE_KEYS.accessToken)?.value;

    if (!accessToken) {
      return unauthorized();
    }

    let decoded;
    try {
      decoded = verifyAccessToken(accessToken);
    } catch {
      return unauthorized();
    }

    const userId = decoded.id as string;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return unauthorized();
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error('ME ROUTE ERROR:', error);
    return internalServerError();
  }
}
