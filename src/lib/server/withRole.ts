// lib/server/withRole.ts
import { NextRequest, NextResponse } from 'next/server';
import type { User } from '@/types/users';
import { getSession } from './getSession';

/**
 * Pure role enforcement for API routes.
 *
 * This function checks whether the current session exists
 * and if the user has one of the allowed roles.
 *
 * Returns a discriminated object:
 * - { ok: true, user } → authorized
 * - { ok: false, reason: 'unauthenticated' | 'forbidden' } → unauthorized
 *
 * No redirects or side effects; suitable for API logic.
 */
export async function requireRoleApi(
  roles: User['role'] | User['role'][]
): Promise<{
  ok: boolean;
  reason?: 'unauthenticated' | 'forbidden';
  user?: User;
}> {
  // Resolve session
  const session = await getSession();
  if (!session) return { ok: false, reason: 'unauthenticated' };

  // Normalize roles input
  const allowed = Array.isArray(roles) ? roles : [roles];

  // Check if user's role is allowed
  if (!allowed.includes(session.user.role))
    return { ok: false, reason: 'forbidden' };

  // Authorized
  return { ok: true, user: session.user };
}

/**
 * Higher-order function for API route handlers.
 *
 * Wraps a handler function to enforce role-based access control.
 * Handles:
 * - Session lookup and role checking via `requireRoleApi`
 * - Returns proper HTTP status codes:
 *   - 401 Unauthorized for no session
 *   - 403 Forbidden for insufficient role
 *   - 500 Internal Server Error for unexpected exceptions
 *
 * @param roles - Allowed role(s) for this API route
 * @param handler - The actual API route handler to execute on success
 * @returns A wrapped handler ready for Next.js API route use
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
      // Perform role enforcement
      const auth = await requireRoleApi(roles);

      if (!auth.ok || !auth.user) {
        const status = auth.reason === 'unauthenticated' ? 401 : 403;
        return NextResponse.json(
          { error: auth.reason || 'Forbidden' },
          { status }
        );
      }

      // Call the original handler with the authenticated user
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
