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

import {
  normalizeEmail,
  normalizeObject,
  assertRequired,
} from '@/lib/utils/normalizers';

import { createAccessToken, createRefreshToken } from '@/lib/auth/tokens';
import { setAuthCookies } from '@/lib/auth/auth-cookies';
import { mapDatabaseThemeToCss } from '@/lib/theme/mapTheme';
import { unauthorized, internalServerError } from '@/lib/http';

const prisma = new PrismaClient();

/**
 * Shape of the data we expect AFTER validation.
 * This is NOT what comes from req.json().
 */
interface SigninPayload {
  email: string;
  password: string;
}

export async function POST(req: NextRequest) {
  try {
    /**
     * 1️⃣ Parse raw JSON body
     *
     * - req.json() returns `unknown` data at runtime
     * - We intentionally type it as Record<string, unknown>
     *   to force validation & normalization
     */
    const body: Record<string, unknown> = await req.json();

    /**
     * 2️⃣ Normalize ONLY fields that benefit from normalization
     *
     * - Email is normalized (trim + lowercase)
     * - Password is NOT normalized:
     *   - passwords are opaque secrets
     *   - changing them would break authentication
     */
    const normalized = {
      ...normalizeObject<SigninPayload>(body, { email: normalizeEmail }), // normalize email
      password: body.password, // copy password untouched
    };

    /**
     * 3️⃣ Assert required fields
     *
     * Runtime:
     * - Throws if email or password is missing/null/undefined
     *
     * TypeScript:
     * - After this line, `normalized` is treated as SigninPayload
     * - email and password are guaranteed to exist
     */
    assertRequired(normalized, ['email', 'password']);

    const { email, password } = normalized;

    /**
     * 4️⃣ Fetch user by normalized email
     *
     * - Email casing and whitespace no longer matter
     * - Prevents login bugs caused by user input formatting
     */
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return unauthorized('Wrong credentials');
    }

    /**
     * 5️⃣ Verify password
     *
     * - bcrypt.compare handles timing-safe comparison
     * - Never reveal which part was incorrect
     */
    if (typeof password !== 'string') {
      return unauthorized('Wrong credentials');
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return unauthorized('Wrong credentials');
    }

    /**
     * 6️⃣ Create access & refresh tokens
     *
     * - Access token: short-lived, contains identity & role
     * - Refresh token: long-lived, stored hashed in DB
     */
    const accessToken = createAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = createRefreshToken({
      id: user.id,
    });

    /**
     * 7️⃣ Hash refresh token before storing
     *
     * - Never store raw refresh tokens
     * - Same principle as password hashing
     */
    const hashedRefresh = await bcrypt.hash(refreshToken, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshTokenHash: hashedRefresh },
    });

    /**
     * 8️⃣ Build response payload
     *
     * - Return only safe user fields
     * - Force role to uppercase for frontend consistency
     */
    const res = NextResponse.json({
      message: 'Signin successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role.toUpperCase(), // force uppercase
        theme: mapDatabaseThemeToCss(user.theme),
      },
    });

    /**
     * 9️⃣ Attach auth cookies
     *
     * - HTTP-only cookies
     * - Access + refresh token pair
     */
    setAuthCookies(res, { accessToken, refreshToken });

    return res;
  } catch (error) {
    console.error('SIGNIN ERROR:', error);

    return internalServerError();
  }
}
