/**
 * ADMIN USERS API — CRUD
 * -------------------------------------------------------
 * Purpose:
 *   Provides admins and super admins full management access
 *   to all users in the system for auditing, updates, or removal.
 *
 * Routes / Methods:
 *   GET    : List all users
 *   POST   : Create a new user
 *   PUT    : Update an existing user by ID
 *   DELETE : Remove a user by ID
 *
 * Auth:
 *   - Requires a valid access token (handled by middleware)
 *   - Role: ADMIN or SUPER_ADMIN (requireRole())
 *
 * Implementation Notes:
 *   - Uses Prisma User model
 *   - Returns only safe fields (excludes password, refreshTokenHash)
 *   - POST/PUT expects { name, email, role, isActive, isVerified }
 *   - DELETE expects user ID as query parameter
 *   - Errors are caught and returned as JSON with HTTP 500
 *
 * Related Files:
 *   - /lib/auth/role.ts → requireRole()
 *   - /lib/prisma.ts    → Prisma instance
 *   - prisma/schema.prisma
 *
 * Usage (Postman / Frontend):
 *   - GET    /api/admin/users
 *   - POST   /api/admin/users → JSON body { name, email, password, role }
 *   - PUT    /api/admin/users?id=<id> → JSON body { name?, role?, isActive?, isVerified? }
 *   - DELETE /api/admin/users?id=<id>
 *   Headers: Authorization: Bearer <access_token>
 * -------------------------------------------------------
 */

import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth/role';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// --------------------
// GET — List all users
// --------------------
export async function GET() {
  await requireRole(['ADMIN', 'SUPER_ADMIN']);

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// --------------------
// POST — Create a new user
// --------------------
export async function POST(req: Request) {
  await requireRole(['ADMIN', 'SUPER_ADMIN']);
  const data = await req.json();

  if (!data.email || !data.password || !data.role) {
    return NextResponse.json(
      { error: 'Email, password, and role are required' },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  try {
    const newUser = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role,
        isActive: data.isActive ?? true,
        isVerified: data.isVerified ?? false,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('❌ Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}

// --------------------
// PUT — Update existing user
// --------------------
export async function PUT(req: Request) {
  await requireRole(['ADMIN', 'SUPER_ADMIN']);
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  if (!id)
    return NextResponse.json({ error: 'User ID required' }, { status: 400 });

  const data = await req.json();

  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name: data.name,
        role: data.role,
        isActive: data.isActive,
        isVerified: data.isVerified,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('❌ Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

// --------------------
// DELETE — Remove user
// --------------------
export async function DELETE(req: Request) {
  await requireRole(['ADMIN', 'SUPER_ADMIN']);
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  if (!id)
    return NextResponse.json({ error: 'User ID required' }, { status: 400 });

  try {
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
