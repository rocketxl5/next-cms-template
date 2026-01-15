import { Role } from '@prisma/client';
import { getSession } from './getSession';

/**
 * Accepts either a single role or a list of roles
 * that are allowed to access a resource.
 */
type AllowedRoles = Role | Role[];

/**
 * Enforces role-based access control using the current session.
 *
 * Behavior:
 * - No session        → 401 Unauthorized
 * - Session + bad role → 403 Forbidden
 * - Session + allowed role → access granted
 *
 * The return type is a discriminated union via `as const`,
 * allowing safe, ergonomic checks at call sites.
 */
export async function enforceRole(roles: AllowedRoles) {
  // Resolve the current authenticated session
  const session = await getSession();

  // No authenticated user → unauthorized
  if (!session) {
    return { ok: false, status: 401 } as const;
  }

  // Normalize input to an array for uniform role checking
  const allowed = Array.isArray(roles) ? roles : [roles];

  // Authenticated but lacking required role → forbidden
  if (!allowed.includes(session.user.role)) {
    return { ok: false, status: 403 } as const;
  }

  // Authorized access; expose the session user to callers
  return { ok: true, user: session.user } as const;
}
