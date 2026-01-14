import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function redirectToSignin(req: NextRequest) {
  const url = new URL('/auth/signin', req.url);
  url.searchParams.set('from', req.nextUrl.pathname);

  return NextResponse.redirect(url);
}
