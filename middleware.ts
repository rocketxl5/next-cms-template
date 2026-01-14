import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAccessTokenEdge } from '@/lib/auth/tokens';
import { redirectToSignin } from '@/lib/server/redirects';
import { COOKIE_KEYS } from '@/types/cookies';

const PROTECTED = ['/dashboard', '/admin'];
const ADMIN_ONLY = ['/admin']; // only /admin strictly admin

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ----------------------------
  // 1️⃣ Skip static files & auth API
  // ----------------------------
  if (pathname.startsWith('/_next') || pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // ----------------------------
  // 2️⃣ Only guard protected routes
  // ----------------------------
  const mustProtect = PROTECTED.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
  if (!mustProtect) {
    return NextResponse.next();
  }

  // ----------------------------
  // 3️⃣ Read access token
  // ----------------------------
  const token = req.cookies.get(COOKIE_KEYS.accessToken)?.value;
  if (!token) {
    console.warn('[MIDDLEWARE] No access token, redirecting to signin');
    return redirectToSignin(req);
  }

  // ----------------------------
  // 4️⃣ Verify token
  // ----------------------------
  let payload;
  try {
    payload = await verifyAccessTokenEdge(token);
  } catch {
    console.warn('[MIDDLEWARE] Invalid token, redirecting to signin');
    return redirectToSignin(req);
  }

  // ----------------------------
  // 5️⃣ Role restriction
  // ----------------------------
  const isAdminPage = ADMIN_ONLY.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );

  if (isAdminPage && !['ADMIN', 'SUPER_ADMIN'].includes(payload.role)) {
    console.warn(
      `[MIDDLEWARE] User role "${payload.role}" not allowed on ${pathname}`
    );
    return NextResponse.redirect(new URL('/', req.url));
  }

  // ----------------------------
  // 6️⃣ Everything OK → continue
  // ----------------------------
  return NextResponse.next();
}

// ----------------------------
// 7️⃣ Matcher config
// ----------------------------
export const config = {
  matcher: [
    '/dashboard', // root
    '/dashboard/:path*', // nested
    '/admin', // root
    '/admin/:path*', // nested
  ],
};
