/**
 * CLIENT SIGN OUT HELPER
 * -------------------------------------------------------
 * Purpose:
 *   Performs a client-side logout by calling the server-side
 *   /api/auth/signout endpoint.
 *
 * Responsibilities:
 *   - Sends a POST request to the signout route
 *   - Relies on server to revoke refresh token and clear cookies
 *   - Does NOT handle any cookies or token logic on the client
 *
 * Usage:
 *   import { signOut } from '@/lib/auth/client';
 *
 *   await signOut();
 *
 * Security notes:
 *   - Does not expose or manipulate tokens
 *   - Relies entirely on server-side logic for safe logout
 * -------------------------------------------------------
 */
export async function signOut() {
  await fetch('/api/auth/signout', {
    method: 'POST',
    credentials: 'include',
    cache: 'no-store',
  });
}
