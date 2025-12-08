/**
 * AUTH MIDDLEWARE
 * -------------------------------------------------------
 * Purpose:
 *   Protects server routes in the App Router by validating
 *   JWT access tokens and enforcing role-based access.
 *
 * Responsibilities:
 *   - Guard all routes listed in `PROTECTED` matcher
 *   - Redirect unauthenticated users to /signin
 *   - Enforce role restrictions (e.g., ADMIN-only routes)
 *   - Skip static assets and auth API routes
 *
 * Design goals:
 *   - Keep route protection centralized
 *   - Reuse existing token helpers (verifyAccessToken)
 *   - Fail-safe: invalid or missing token always redirects
 *   - Compatible with App Router (`NextRequest` + `NextResponse`)
 *
 * Step-by-step behavior:
 *   1. Skip static assets (`/_next/...`) and auth APIs (`/api/auth/...`)
 *   2. Check if the request matches a protected route
 *   3. If protected, attempt to read `accessToken` cookie
 *   4. If missing, redirect user to /signin with `from` query param
 *   5. If token exists, verify it using `verifyAccessToken`
 *   6. If token is invalid/expired, redirect to /signin
 *   7. Check role restrictions for admin pages
 *   8. If user lacks required role, redirect to `/`
 *   9. If all checks pass, continue to requested route (`NextResponse.next()`)
 *
 * Security notes:
 *   - Tokens are short-lived (accessToken)
 *   - Role-based access ensures sensitive pages are protected
 *   - Middleware does not expose token payload to client
 *
 * Used by:
 *   - All pages listed in `matcher` (e.g., /dashboard, /admin)
 *   - Works in conjunction with token helpers and requireRole()
 *
 * -------------------------------------------------------
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAccessToken } from "./lib/auth/tokens";
import { redirectToSignin } from "./lib/auth/redirect";

const PROTECTED = ["/dashboard", "/admin"]
const ADMIN_ONLY = ["/admin"]

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Skip static and auth API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth")
  ) {
    return NextResponse.next()
  }

  // Only guard protected routes
  const mustProtect = PROTECTED.some((p) => pathname.startsWith(p))
  if (!mustProtect) return NextResponse.next()

  // Read accessToken cookie
  const token = req.cookies.get("accessToken")?.value
  if (!token) return redirectToSignin(req)

  // Verify token signature
  let payload
  try {
    payload = verifyAccessToken(token)
  } catch {
    return redirectToSignin(req)
  }

  // Role restriction
  const isAdminPage = ADMIN_ONLY.some((a) => pathname.startsWith(a))
  if (isAdminPage && payload.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
  ]
}