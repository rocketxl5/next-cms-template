import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Redirects the user to the sign-in page, preserving the originally requested path.
 *
 * This is useful in server-side middleware or route handlers when:
 * - The user is unauthenticated
 * - You want to redirect them to login but return them to their original page after signin
 *
 * @param req - The incoming Next.js request
 * @returns A NextResponse that performs a redirect to /auth/signin
 */
export function redirectToSignin(req: NextRequest) {
  // Construct a URL for the signin page relative to the current request
  const url = new URL('/auth/signin', req.url);

  // Store the originally requested path in the query params as "from"
  // This allows post-login redirection back to the original page
  url.searchParams.set('from', req.nextUrl.pathname);

  // Return a Next.js redirect response
  return NextResponse.redirect(url);
}
