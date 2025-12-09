// Signout route:
//
// Destroys the user session by:
// 1. Clearing accessToken and refreshToken cookies
// 2. Removing the refreshTokenHash from the database
// 3. Preventing any further token rotation
//
// This fully logs the user out of all current sessions
// and requires a fresh signin to regain access

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (accessToken) {
      const decode = jwt.decode(accessToken) as { id?: string };

      if (decode?.id) {
        await prisma.user.update({
          where: { id: decode.id },
          data: { refreshTokenHash: null },
        });
      }
    }

    // Clear cookies
    cookieStore.set('accessToken', '', { maxAge: 0, path: '/' });
    cookieStore.set('refreshToken', '', { maxAge: 0, path: '/' });

    return NextResponse.json({ message: 'Signed out successfully' });
  } catch (error) {
    console.error('SIGNOUT ERROR:', error);

    return NextResponse.json({ error: 'Failed to sign out' }, { status: 500 });
  }
}
