/**
 * USERS ROLE HELPER
 * ---------------------------
 * Server-side authorization utility.
 *
 * 1. Reads the accessToken from Next.js server cookies
 * 2. Verifies the JWT
 * 3. Ensures the user's role is included in the allowed roles
 * 4. Returns the decoded user payload if authorized
 * 5. Throws an error if not authenticated or not authorized
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
