import type { NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';

export const authConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ], // Cấu hình nhà cung cấp sẽ được đưa vào auth.ts
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdminRoute = nextUrl.pathname.startsWith('/admin');
      const isLoginPage = nextUrl.pathname === '/admin/login';

      if (isAdminRoute && !isLoginPage) {
        if (!isLoggedIn) return false;
        // Check for specific role, allowing only ADMIN, etc.
        const user = auth.user as { role?: string } | undefined;
        return user?.role !== 'USER';
      }
      return true;
    },
  },
} satisfies NextAuthConfig;
