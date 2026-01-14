// app/api/auth/signup/route.ts

/**
 * Signup API endpoint
 *
 * This route handles new user registration safely, type-safely, and consistently:
 *
 * Steps:
 * 1️⃣ Parse incoming JSON payload from the client
 * 2️⃣ Normalize selected fields (email, name) using reusable `normalizeObject`
 * 3️⃣ Assert that required fields exist using `assertRequired` (runtime + TypeScript safety)
 * 4️⃣ Validate and handle password separately (check existence + hash)
 * 5️⃣ Insert the normalized, validated user into the database (Prisma)
 * 6️⃣ Return minimal safe user information to the client
 *
 * Principles:
 * - TypeScript 5 strict type safety (no `any`)
 * - Separation of normalization vs validation
 * - Runtime checks for required fields
 * - Passwords handled securely (hashed, never returned)
 */

import bcrypt from 'bcryptjs'; // For secure password hashing
import { prisma } from '@/lib/prisma'; // Prisma client
import {
  normalizeEmail,
  normalizeSlug,
  normalizeObject,
  assertRequired,
} from '@/lib/utils/normalizers'; // Normalization + validation utilities
import { NextResponse } from 'next/server'; // Optional: cleaner JSON responses

/**
 * Interface representing the expected shape of the signup payload
 */
interface SignupPayload {
  email: string; // Required, normalized
  password: string; // Required, validated separately
  name: string; // Required, normalized
}

/**
 * POST /api/auth/signup
 * Handles user registration
 */
export async function POST(req: Request) {
  try {
    // ------------------------------------------------------------
    // 1️⃣ Parse incoming JSON body
    // ------------------------------------------------------------
    // `req.json()` parses the stringified JSON sent by the client into a JS object
    const body: Record<string, unknown> = await req.json();

    // ------------------------------------------------------------
    // 2️⃣ Normalize fields
    // ------------------------------------------------------------
    // Only normalize fields we care about:
    // - email: trimmed and lowercased
    // - name: trimmed
    // Password is intentionally left raw for hashing
    const normalized = normalizeObject<SignupPayload>(body, {
      email: normalizeEmail,
      name: normalizeSlug, // Using your normalizeSlug utility as an example for names
    });

    // ------------------------------------------------------------
    // 3️⃣ Runtime + TypeScript safety check
    // ------------------------------------------------------------
    // Throws if any required field is missing
    assertRequired(normalized, ['email', 'name']);

    // Destructure normalized fields
    const { email, name } = normalized as SignupPayload;

    // ------------------------------------------------------------
    // 4️⃣ Handle password separately
    // ------------------------------------------------------------
    const password = body.password;
    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    // ------------------------------------------------------------
    // 5️⃣ Hash password
    // ------------------------------------------------------------
    const hashedPassword = await bcrypt.hash(password, 10);

    // ------------------------------------------------------------
    // 6️⃣ Create user in the database
    // ------------------------------------------------------------
    const user = await prisma.user.create({
      data: {
        email, // Normalized email
        name, // Normalized display name
        password: hashedPassword, // Secure hashed password
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    // ------------------------------------------------------------
    // 7️⃣ Return minimal safe user info
    // ------------------------------------------------------------
    // Using NextResponse.json() for cleaner syntax
    return NextResponse.json(
      { id: user.id, email: user.email, name: user.name },
      { status: 201 }
    );
  } catch (err) {
    // ------------------------------------------------------------
    // Error handling
    // ------------------------------------------------------------
    console.error('SIGNUP ERROR:', err);

    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : 'Signup failed',
      },
      { status: 500 }
    );
  }
}
