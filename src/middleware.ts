import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth.config';
import { NextResponse } from 'next/server';

const { auth } = NextAuth(authConfig);

interface SessionUser {
  id: string;
  role?: string;
  name?: string | null;
  email?: string | null;
}

export default auth((req) => {
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');
  const isLoginPage = req.nextUrl.pathname === '/admin/login';
  const isApiAuth = req.nextUrl.pathname.startsWith('/api/auth');

  if (isApiAuth) return NextResponse.next();

  if (isAdminRoute && !isLoginPage) {
    if (!req.auth) {
      const url = req.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
    const user = req.auth.user as SessionUser | undefined;
    if (user?.role === 'USER') {
      const url = req.nextUrl.clone();
      url.pathname = '/admin/login';
      url.searchParams.set('error', 'unauthorized');
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
