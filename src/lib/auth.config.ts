import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  providers: [], // Cấu hình nhà cung cấp sẽ được đưa vào auth.ts
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || 'USER';
        token.twoFactorEnabled = (user as any).twoFactorEnabled || false;
        token.twoFactorVerified = !token.twoFactorEnabled; // Nếu không bật 2FA thì coi như đã xác thực
      }
      
      // Cho phép cập nhật trạng thái đã xác thực 2FA qua session update
      if (trigger === 'update' && session?.twoFactorVerified) {
        token.twoFactorVerified = true;
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).twoFactorEnabled = token.twoFactorEnabled;
        (session.user as any).twoFactorVerified = token.twoFactorVerified;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdminRoute = nextUrl.pathname.startsWith('/admin');
      const isLoginPage = nextUrl.pathname === '/admin/login';
      const isVerifyOtpPage = nextUrl.pathname === '/admin/verify-otp';
      
      if (isAdminRoute && !isLoginPage) {
        if (!isLoggedIn) return false;
        
        const user = auth.user as any;
        const role = user?.role;
        const is2FAVerified = user?.twoFactorVerified;
        const is2FAEnabled = user?.twoFactorEnabled;

        // Nếu đã bật 2FA nhưng chưa xác thực mã, bắt buộc phải vào trang nhập mã
        if (is2FAEnabled && !is2FAVerified && !isVerifyOtpPage) {
          return Response.redirect(new URL('/admin/verify-otp', nextUrl));
        }

        // Nếu đã xác thực xong hoặc không bật 2FA, không cho quay lại trang nhập mã nữa
        if (isVerifyOtpPage && is2FAVerified) {
          return Response.redirect(new URL('/admin', nextUrl));
        }

        return role !== 'USER';
      }
      return true;
    },
  },
} satisfies NextAuthConfig;
