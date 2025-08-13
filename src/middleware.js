import { NextResponse } from 'next/server'

const block_links = ["/my-account"]; // "/cart", "/checkout" 

export function middleware(request) {
  const { pathname } = request.nextUrl
  const cart = JSON.parse(request.cookies.get('cart')?.value || '[]');

  if (block_links.includes(pathname)) {
    return NextResponse.redirect(new URL('/', request.url))
  }
  
  if (pathname === "/checkout" && cart.length === 0) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  

  return NextResponse.next()
}

export const config = {
  matcher: block_links
}