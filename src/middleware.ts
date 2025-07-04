import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import * as jose from 'jose'

export async function middleware(request: NextRequest) {
  const authToken = request.cookies.get('auth-token')?.value;
  const { pathname } = request.nextUrl;

  const protectedRoutes = ['/merger', '/admin'];
  const publicAuthRoutes = ['/login', '/register'];

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    console.error('JWT_SECRET is not defined');
    if (protectedRoutes.some(route => pathname.startsWith(route))) {
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('error', 'Configuration-Error');
        return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }
  
  const secret = new TextEncoder().encode(jwtSecret);

  let isAuthenticated = false;
  try {
    if (authToken) {
      await jose.jwtVerify(authToken, secret);
      isAuthenticated = true;
    }
  } catch (err) {
    isAuthenticated = false;
  }

  if (!isAuthenticated && protectedRoutes.some(route => pathname.startsWith(route))) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthenticated && publicAuthRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/merger', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/merger/:path*', '/admin/:path*', '/login', '/register'],
}
