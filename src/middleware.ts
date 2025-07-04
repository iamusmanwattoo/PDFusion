import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import * as jose from 'jose'

export async function middleware(request: NextRequest) {
  const authToken = request.cookies.get('auth-token')?.value;
  const { pathname } = request.nextUrl;

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    console.error('JWT_SECRET is not defined');
    // For protected routes, redirect to login if secret is missing
    if(pathname.startsWith('/merger')) {
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('error', 'Configuration-Error');
        return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }
  
  const secret = new TextEncoder().encode(jwtSecret);

  let isAuthenticated = false;
  if (authToken) {
    try {
      await jose.jwtVerify(authToken, secret);
      isAuthenticated = true;
    } catch (err) {
      isAuthenticated = false;
    }
  }

  // If trying to access a protected route and not authenticated, redirect to login
  if (pathname.startsWith('/merger') && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('next', pathname); // Optional: redirect back after login
    return NextResponse.redirect(loginUrl);
  }

  // If trying to access login or register page and already authenticated, redirect to merger
  if ((pathname.startsWith('/login') || pathname.startsWith('/register')) && isAuthenticated) {
    return NextResponse.redirect(new URL('/merger', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/merger/:path*', '/login', '/register'],
}
