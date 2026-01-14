// lib/server/withRole.ts
import { NextRequest, NextResponse } from 'next/server';
import type { User } from '@/types/users';
import { getSession } from './getSession';

/**
 * Pure role enforcement for API routes
 */
export async function requireRoleApi(
  roles: User['role'] | User['role'][]
): Promise<{
  ok: boolean;
  reason?: 'unauthenticated' | 'forbidden';
  user?: User;
}> {
  const session = await getSession();
  if (!session) return { ok: false, reason: 'unauthenticated' };

  const allowed = Array.isArray(roles) ? roles : [roles];
  if (!allowed.includes(session.user.role))
    return { ok: false, reason: 'forbidden' };

  return { ok: true, user: session.user };
}

/**
 * Higher-order function for API route handlers
 */
export function withRole(
  roles: User['role'] | User['role'][],
  handler: (req: NextRequest, user: User) => Promise<Response>
) {
  return async (
    req: NextRequest,
    context: { params: Promise<Record<string, string>> }
  ) => {
    try {
      const auth = await requireRoleApi(roles);

      if (!auth.ok || !auth.user) {
        const status = auth.reason === 'unauthenticated' ? 401 : 403;
        return NextResponse.json(
          { error: auth.reason || 'Forbidden' },
          { status }
        );
      }

      return handler(req, auth.user);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('withRole error', error);
      return NextResponse.json(
        { error: error.message || 'Internal Server Error' },
        { status: 500 }
      );
    }
  };
}
