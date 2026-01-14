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
 * - Returns an authorization result `{ ok, user? }`
 *
 * What this file DOES NOT do:
 * - Perform redirects
 * - Throw errors for control flow
 * - Read cookies or verify JWTs directly
 *
 * Design notes:
 * - This is a pure authorization layer
 * - Redirects and UX decisions belong to guards/pages
 * - Role values must match the canonical lowercase role union
 *
 * Intended usage:
 * - Used by server-side guards and route handlers
 * - Never used directly in client components
 */

import { redirect } from 'next/navigation';
import { getSession } from './getSession';
import { Role } from '@prisma/client';

type AllowedRoles = Role | Role[];

type RequireRoleOptions = {
  roles: AllowedRoles;
  unauthenticatedRedirect?: string;
  forbiddenRedirect?: string;
};

export async function requireRole({
  roles,
  unauthenticatedRedirect = '/auth/signin',
  forbiddenRedirect = '/',
}: RequireRoleOptions) {
  const session = await getSession();

  if (!session) {
    redirect(unauthenticatedRedirect);
  }

  const allowed = Array.isArray(roles) ? roles : [roles];

  if (!allowed.includes(session.user.role)) {
    redirect(forbiddenRedirect);
  }

  return session.user;
}
