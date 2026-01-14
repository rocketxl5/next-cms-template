
import { Role } from '@prisma/client';
/**
 * Resolve post-auth redirect path
 * --------------------------------
 * - Honors explicit `from` param when provided
 * - Falls back to role-based default routes
 * - Pure helper (no redirects, no side effects)
 */

export function getRedirectPathname(
  role: Role,
  from?: string | null
): string {
  if (from) return from;
 
  switch (role) {
    case 'ADMIN': 
    case 'SUPER_ADMIN':
      return '/admin'
    case 'USER': 
      return '/user'
    default: 
      return '/'
  }
}
