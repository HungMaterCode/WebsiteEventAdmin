import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth.config';
import { NextResponse } from 'next/server';

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  const { pathname } = req.nextUrl;
  const isAdminRoute = pathname.startsWith('/admin');
  const isLoginPage = pathname === '/admin/login';
  const isApiRoute = pathname.startsWith('/api');
  const isMaintenancePage = pathname === '/maintenance';
  const isStaticFile = pathname.includes('.') || pathname.startsWith('/_next');

  // 1. Luôn cho phép các route API Authentication và Static files
  if (isApiRoute || isStaticFile || isMaintenancePage) {
    return NextResponse.next();
  }

  // 2. Logic kiểm tra bảo trì (Chỉ chạy cho các trang Public)
  if (!isAdminRoute) {
    try {
      // Lưu ý: Fetch từ middleware có thể gây chậm trễ trên Vercel Edge.
      // Cân nhắc sử dụng Edge Config hoặc Vercel Blob để lưu trạng thái bảo trì.
      const baseUrl = req.nextUrl.origin;
      const response = await fetch(`${baseUrl}/api/settings/system`, { 
        next: { revalidate: 60 } 
      });
      
      if (response.ok) {
        const settings = await response.json();
        if (settings?.maintenanceMode) {
          // Nếu đang bảo trì, kiểm tra role người dùng
          const role = (req.auth?.user as any)?.role;
          if (role !== 'ADMIN') {
            const url = req.nextUrl.clone();
            url.pathname = '/maintenance';
            return NextResponse.redirect(url);
          }
        }
      }
    } catch (error) {
      console.error('[MIDDLEWARE] Maintenance check failed:', error);
    }
  }

  // 3. Logic bảo vệ trang Admin
  if (isAdminRoute && !isLoginPage) {
    if (!req.auth) {
      const url = req.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
    const role = (req.auth.user as any)?.role;
    if (role === 'USER') {
      const url = req.nextUrl.clone();
      url.pathname = '/admin/login';
      url.searchParams.set('error', 'unauthorized');
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)'],
};
