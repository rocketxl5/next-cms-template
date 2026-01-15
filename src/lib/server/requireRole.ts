/**
 * ROLE AUTHORIZATION (SERVER)
 * --------------------------------------------------
 * Purpose:
 * - Perform authorization checks based on user roles
 * - Derive authentication state from the server session
 *
 * What this file DOES:
 * - Calls `getSession()` to obtain the authenticated user
 * - Checks whether the user's role matches allowed roles
 * - Returns an authorization result `{ user }` if authorized
 * - Performs server-side redirects for unauthorized access
 *
 * What this file DOES NOT do:
 * - Read cookies or verify JWTs directly (delegated to getSession)
 * - Throw errors for control flow
 * - Run on client components
 *
 * Design notes:
 * - Pure server-side authorization logic
 * - UX decisions (redirect targets) are configurable but optional
 * - Role values must match the canonical lowercase Role enum values
 *
 * Intended usage:
 * - Used by server-side route handlers and page guards
 * - Not intended for client-side use
 */

import { redirect } from 'next/navigation';
import { getSession } from './getSession';
import { Role } from '@prisma/client';

/**
 * Represents one or multiple allowed roles for a protected resource.
 */
type AllowedRoles = Role | Role[];

/**
 * Options for `requireRole`.
 */
type RequireRoleOptions = {
  /** Allowed role(s) for this resource */
  roles: AllowedRoles;

  /** Where to redirect if user is not authenticated (optional) */
  unauthenticatedRedirect?: string;

  /** Where to redirect if user is authenticated but forbidden (optional) */
  forbiddenRedirect?: string;
};

/**
 * Enforces server-side role-based access control.
 *
 * Steps:
 * 1. Retrieve the current session via `getSession()`.
 * 2. If no session exists → redirect to `unauthenticatedRedirect`.
 * 3. If the user's role is not in `roles` → redirect to `forbiddenRedirect`.
 * 4. If authorized → return the `user` object.
 *
 * Notes:
 * - Uses `next/navigation`'s `redirect` for server-side redirection.
 * - Always returns `User` when access is allowed; otherwise never returns (redirects).
 */
export async function requireRole({
  roles,
  unauthenticatedRedirect = '/auth/signin',
  forbiddenRedirect = '/',
}: RequireRoleOptions) {
  // Get the current user session
  const session = await getSession();

  // Redirect unauthenticated users
  if (!session) {
    redirect(unauthenticatedRedirect);
  }

  // Normalize roles input to an array for uniform checking
  const allowed = Array.isArray(roles) ? roles : [roles];

  // Redirect users who are authenticated but not allowed
  if (!allowed.includes(session.user.role)) {
    redirect(forbiddenRedirect);
  }

  // Access granted: return the user object
  return session.user;
}
