import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  providers: [], // Cấu hình nhà cung cấp sẽ được đưa vào auth.ts
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
        const role = (auth.user as any)?.role;
        return role !== 'USER'; // Allow ADMIN, etc.
      }
      return true;
    },
  },
} satisfies NextAuthConfig;
