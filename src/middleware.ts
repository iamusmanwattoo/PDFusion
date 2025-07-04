
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import * as jose from 'jose'

const ADMIN_EMAIL = 'admin@pdfusion.com';

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

  if (!authToken && protectedRoutes.some(route => pathname.startsWith(route))) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (authToken) {
    try {
      const { payload } = await jose.jwtVerify(authToken, secret);
      const isAuthenticated = true;
      const isAdmin = payload.email === ADMIN_EMAIL;

      if (isAuthenticated && publicAuthRoutes.some(route => pathname.startsWith(route))) {
        return NextResponse.redirect(new URL('/merger', request.url));
      }

      if (pathname.startsWith('/admin') && !isAdmin) {
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch (err) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.set('auth-token', '', { expires: new Date(0), path: '/' });
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/merger/:path*', '/admin/:path*', '/login', '/register'],
}
