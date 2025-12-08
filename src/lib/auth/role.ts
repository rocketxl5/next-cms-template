/**
 * REQUIRE ROLE HELPER
 * -------------------------------------------------------
 * Purpose:
 *   Enforces role-based access control in server-side code.
 *
 * Responsibilities:
 *   - Check if the currently authenticated user has at least
 *     one of the required roles
 *   - Throw an error or redirect if the user lacks permissions
 *
 * Design goals:
 *   - Keep role checks centralized and reusable
 *   - Integrate seamlessly with JWT payloads from access tokens
 *   - Compatible with both API routes and server components
 *   - Avoid duplicating role logic throughout the app
 *
 * Step-by-step behavior:
 *   1. Accept an array of required roles (e.g., ["ADMIN", "SUPER_ADMIN"])
 *   2. Retrieve the current user from request context or JWT
 *   3. Compare the user’s role against the required roles
 *   4. If the user’s role matches, return the user object
 *   5. If the user’s role does not match, throw an error or handle
 *      unauthorized access (redirect / API error)
 *
 * Security notes:
 *   - Assumes accessToken payload contains an uppercase role
 *   - Roles are compared case-insensitively if normalization is applied
 *   - Prevents unauthorized access to admin/protected pages
 *
 * Used by:
 *   - Admin pages and components
 *   - Middleware for protected routes
 *   - API endpoints requiring specific roles
 *
 * -------------------------------------------------------
 */


import { cookies } from 'next/headers';
import jwt, { JwtPayload } from 'jsonwebtoken';

type AllowdRoles = string | string[];

export async function requireRole(roles: AllowdRoles) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    throw new Error('Not authenticated');
  }

  const secret = process.env.JWT_ACCESS_SECRET!;
  let decoded: JwtPayload;

  try {
    decoded = jwt.verify(accessToken, secret) as JwtPayload;
  } catch (error) {
    console.error(error);
    throw new Error('Invalid or expired token');
  }

  const userRole = decoded.role;

  if (!userRole) {
    throw new Error('Token missing role');
  }

  const allowed = Array.isArray(roles) ? roles : [roles];

  if (!allowed.includes(userRole)) {
    throw new Error('Not authorized');
  }

  return decoded;
}
