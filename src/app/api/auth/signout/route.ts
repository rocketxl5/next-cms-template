/**
 * SIGN OUT ROUTE
 * -------------------------------------------------------
 * Purpose:
 *   Terminates the current user session by removing all
 *   client-side authentication state and best-effort
 *   server-side refresh token data.
 *
 * Key guarantees:
 *   - The user is ALWAYS logged out from the client
 *   - Cookies are ALWAYS cleared, even if errors occur
 *   - The route NEVER throws due to token or DB issues
 *
 * Flow:
 *   1. Create a response object early
 *   2. Read refresh token from HTTP-only cookies (if present)
 *   3. Attempt to verify the refresh token
 *   4. If verification succeeds:
 *        - Extract userId from token payload
 *        - Clear stored refreshTokenHash in the database
 *   5. If verification fails:
 *        - Skip database cleanup (identity cannot be trusted)
 *   6. Always clear auth cookies in a `finally` block
 *   7. Return a successful response (204 No Content)
 *
 * Failure handling:
 *   - Invalid / expired / missing refresh token → ignored
 *   - User no longer exists → ignored
 *   - Database errors → ignored
 *
 * Security notes:
 *   - Database mutations are performed ONLY when identity
 *     is verified from a valid refresh token
 *   - No sensitive information is returned
 *   - Logout is idempotent and safe to call multiple times
 *
 * Method:   POST /api/auth/signout
 * Access:   Authenticated (best-effort; token optional)
 * Response: 204 No Content
 * -------------------------------------------------------
 */

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { verifyRefreshToken } from '@/lib/auth/tokens';
import { clearAuthCookies } from '@/lib/auth/auth-cookies';

export async function POST() {
  const res = NextResponse.json(null, { status: 200 });
  const cookieStore = await cookies();

  try {
    // const refreshToken = await getCookie('refreshToken');
    const refreshToken = cookieStore.get('refreshToken')?.value;

    if (refreshToken) {
      try {
        const decoded = verifyRefreshToken(refreshToken);
        const userId = decoded.id as string | undefined;

        if (userId) {
          await prisma.user.update({
            where: { id: userId },
            data: { refreshTokenHash: null },
          });
        }
      } catch {
        //  Token may be expired or invalid => ok on signout
        console.warn('SIGNOUT: refresh token invalid or expired');
      }
    }
  } finally {
    // Always clear cookies
    clearAuthCookies(res);
  }

  return res;
}
