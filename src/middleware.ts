import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth.config';
import { NextResponse } from 'next/server';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');
  const isLoginPage = req.nextUrl.pathname === '/admin/login';
  const isApiAuth = req.nextUrl.pathname.startsWith('/api/auth');

  if (isApiAuth) return NextResponse.next();

  if (isAdminRoute && !isLoginPage) {
    if (!req.auth) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
    const role = (req.auth.user as any)?.role;
    if (role === 'USER') {
      return NextResponse.redirect(new URL('/admin/login?error=unauthorized', req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/admin/:path*'],
};
