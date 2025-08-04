import { NextResponse } from 'next/server'
import Cookies from 'js-cookie';

const block_links = ["/my-account"]; // "/cart", "/checkout" 

export function middleware(request) {
  const { pathname } = request.nextUrl
  const cartCookie = request.cookies.get('cart')?.value;

  if (block_links.includes(pathname)) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if(pathname === "/checkout"){
    // allow access only if cart items !== to zero
    const cart = cartCookie ? JSON.parse(cartCookie) : [];

    if (cart.length === 0) {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }
  

  return NextResponse.next()
}

export const config = {
  matcher: block_links
}