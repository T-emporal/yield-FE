import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/api') || pathname.startsWith('/_next/static') || pathname === '/login') {
    return NextResponse.next();
  }

  const token = req.cookies.get('session_token');
  if (token) {
    const parts = token.value.split('-');
    const timestamp = parts[parts.length - 1];
    const tokenExpiry = parseInt(timestamp, 10);
    const now = Date.now();

    if (now < tokenExpiry + 3600000) { // Token not expired
      return NextResponse.next();
    } else {
      // Token expired, delete the tokens
      const response = NextResponse.redirect(new URL('/login', req.url));
      response.cookies.delete('session_token');
      response.cookies.delete('username');
      return response;
    }
  } else {
    // No token found, redirect to login for HTML requests
    if (req.headers.get('accept')?.includes('text/html')) {
      const response = NextResponse.redirect(new URL('/login', req.url));
      // Optionally delete cookies even if token not found, to ensure clean state
      response.cookies.delete('session_token');
      response.cookies.delete('username');
      return response;
    }
    return NextResponse.next();
  }
}
