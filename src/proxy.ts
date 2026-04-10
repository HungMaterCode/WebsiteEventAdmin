import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth.config';
import { NextResponse } from 'next/server';

const { auth } = NextAuth(authConfig);

async function proxyHandler(req: any) {
  const { pathname } = req.nextUrl;
  console.log(`[PROXY] Requesting: ${pathname}`);

  // 1. Bỏ qua ngay lập tức các request nội bộ hoặc API/Static để tránh treo
  const isInternal = req.headers.get('x-middleware-request') === 'true';
  const isApiRoute = pathname.startsWith('/api');
  const isStaticFile = pathname.includes('.') || pathname.startsWith('/_next') || pathname.startsWith('/favicon.ico');
  const isMaintenancePage = pathname === '/maintenance';

  if (isInternal || isApiRoute || isStaticFile || isMaintenancePage) {
    return NextResponse.next();
  }

  const isAdminRoute = pathname.startsWith('/admin');
  const isLoginPage = pathname === '/admin/login';

  // 2. Kiểm tra chế độ bảo trì (Chỉ chạy cho trang Public)
  if (!isAdminRoute) {
    try {
      const baseUrl = req.nextUrl.origin;

      // Sử dụng Promise.race để áp đặt timeout tránh treo khi Dev server đang tải
      const fetchPromise = fetch(`${baseUrl}/api/settings/system`, {
        next: { revalidate: 60 },
        headers: { 'x-middleware-request': 'true' }
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), 2000)
      );

      const response = await Promise.race([fetchPromise, timeoutPromise]) as Response;
      
      if (response.ok) {
        const settings = await response.json();
        if (settings?.maintenanceMode) {
          const role = (req.auth?.user as any)?.role;
          console.log(`[PROXY] Maintenance Mode: ACTIVE. User role: ${role || 'GUEST'}`);
          
          if (role !== 'ADMIN') {
            console.log(`[PROXY] Not an Admin. Redirecting to /maintenance...`);
            const url = req.nextUrl.clone();
            url.pathname = '/maintenance';
            return NextResponse.redirect(url);
          } else {
            console.log(`[PROXY] User is ADMIN. Bypassing maintenance check.`);
          }
        }
      }
    } catch (error) {
      console.error('[PROXY] Maintenance Check Error:', error instanceof Error ? error.message : error);
    }
  }

  // 3. Bảo vệ trang Admin (Giữ nguyên logic cũ)
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
}

// Next.js 16 yêu cầu export tường minh hàm proxy. 
// Sử dụng hàm bọc để đảm bảo tương thích với adapterFn của Next.js
export const proxy = auth(proxyHandler);

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)'],
};
