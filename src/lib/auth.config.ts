import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  providers: [], // Cấu hình nhà cung cấp sẽ được đưa vào auth.ts
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || 'USER';
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdminRoute = nextUrl.pathname.startsWith('/admin');
      const isLoginPage = nextUrl.pathname === '/admin/login';
      
      if (isAdminRoute && !isLoginPage) {
        if (!isLoggedIn) return false;
        const role = (auth.user as any)?.role;
        return role !== 'USER'; // Chỉ cho phép ADMIN (hoặc các quyền cao hơn USER)
      }
      return true;
    },
  },
} satisfies NextAuthConfig;
