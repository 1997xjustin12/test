import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
 console.log("test")
  if (pathname === '/forbidden') {
    return NextResponse.redirect(new URL('/error', req.url));
  }

  return NextResponse.next();
}