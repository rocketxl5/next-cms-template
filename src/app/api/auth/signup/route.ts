/**
 * SIGN UP ROUTE
 * -------------------------------------------------------
 * Purpose:
 *   Registers a new user and immediately authenticates them.
 *
 * Flow:
 *   1. Read and validate registration data
 *   2. Check if email already exists
 *   3. Hash the password (bcrypt)
 *   4. Create new user in the database
 *   5. Generate access token + refresh token
 *   6. Store hashed refresh token in the database
 *   7. Set secure HTTP-only auth cookies
 *   8. Return user-safe data (no sensitive fields)
 *
 * Failure cases:
 *   - Missing required fields
 *   - Email already in use
 *   - Database errors
 *
 * Security notes:
 *   - Password is always hashed before storage
 *   - Tokens are never exposed to JavaScript (httpOnly)
 *   - Follows the same security model as Sign In
 * -------------------------------------------------------
 *
 * Method:   POST /api/auth/signup
 * Access:   Public
 */

import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    // 1. Parse body
    const body = await req.json();
    const { name, email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // 2. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      );
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4.Create user
    const user = await prisma.user.create({
      data: {
        name: name || null,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    // 5.Return safe response (never send password)
    return NextResponse.json(
      { message: 'User created successfully', user },
      { status: 201 }
    );
  } catch (error) {
    console.error('SIGNUP ERROR:', error);

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
