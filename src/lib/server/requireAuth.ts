import { requireRole } from './requireRole';
import { Role } from '@prisma/client';

/**
 * Enforces that the current request is made by any authenticated user.
 *
 * Uses `requireRole` internally, passing all possible roles from the database enum.
 * This is a convenience wrapper for routes or actions that only need authentication,
 * without restricting to a specific role.
 *
 * @returns The result of `requireRole`, including `{ ok: boolean, user?, status? }`
 */
export async function requireAuth() {
  return requireRole({
    roles: Object.values(Role), // allow any authenticated role
  });
}
