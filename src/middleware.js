import { NextResponse } from 'next/server'

const block_links = ["/cart", "/my-account", "/checkout"];

export function middleware(request) {
  const { pathname } = request.nextUrl

  if (block_links.includes(pathname)) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: block_links
}