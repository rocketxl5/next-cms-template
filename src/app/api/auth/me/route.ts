/**
 * ME / SESSION ROUTE
 * -------------------------------------------------------
 * Purpose:
 *   Returns the currently authenticated user based on
 *   the access token stored in HTTP-only cookies.
 *
 * Flow:
 *   1. Read accessToken from cookies
 *   2. Verify and decode JWT payload
 *   3. Fetch the user from the database
 *   4. Return user-safe data only
 *
 * Failure cases:
 *   - Missing token
 *   - Invalid or expired token
 *   - User no longer exists
 *
 * Security notes:
 *   - Password and tokens are NEVER returned
 *   - Requires a valid access token
 * -------------------------------------------------------
 *
 * Method:   GET /api/auth/me
 * Access:   Protected
 */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';

type AccessTokenPayload = {
  id: string;
  email: string;
  role: string;
};

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
      return NextResponse.json({ error: 'Not Authenticated' }, { status: 401 });
    }

    const decoded = jwt.verify(
      accessToken,
      process.env.JWT_ACCESS_SECRET!
    ) as AccessTokenPayload;

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('ME ROUTE ERROR:', error);

    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 401 }
    );
  }
}
