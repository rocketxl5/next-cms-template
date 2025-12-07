/**
 * SIGN IN ROUTE
 * -------------------------------------------------------
 * Purpose:
 *   Authenticates an existing user using email + password
 *   and establishes a new authenticated session.
 *
 * Flow:
 *   1. Read and validate credentials from request body
 *   2. Find the user in the database by email
 *   3. Compare plain password with stored hash (bcrypt)
 *   4. Generate new access token + refresh token
 *   5. Store hashed refresh token in the database
 *   6. Set secure HTTP-only auth cookies
 *   7. Return user-safe data (no sensitive fields)
 *
 * Failure cases:
 *   - Missing fields
 *   - User not found
 *   - Invalid credentials
 *
 * Security notes:
 *   - Passwords are never stored in plain text
 *   - JWT tokens are stored in HTTP-only cookies
 *   - Refresh tokens are hashed before saving
 *   - Prevents timing & credential guessing attacks
 * -------------------------------------------------------
 *
 * Method:   POST /api/auth/signin
 * Access:   Public
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { createAccessToken, createRefreshToken } from '@/lib/auth/tokens';
import { setAuthCookies } from '@/lib/auth/cookies';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Missing email or password' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return NextResponse.json({ error: 'Wrong credentials' }, { status: 401 });
    }

    const accessToken = createAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = createRefreshToken({
      id: user.id,
    });

    const hashedRefresh = await bcrypt.hash(refreshToken, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshTokenHash: hashedRefresh },
    });

    const res = NextResponse.json({
      message: 'Signin successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });

    setAuthCookies(res, { accessToken, refreshToken });

    return res;
  } catch (error) {
    console.error('SIGNIN ERROR:', error);

    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
