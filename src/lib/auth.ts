import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import { authConfig } from './auth.config';
import CredentialsProvider from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    ...authConfig.providers,
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    CredentialsProvider({

      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        // Auto-provision default admin if requested
        if (email === 'admin@eventadmin.vn' && password === 'admin123') {
          let superAdmin = await prisma.user.findUnique({
            where: { email },
          });

          if (!superAdmin) {
            const hashedPassword = await bcrypt.hash(password, 10);
            superAdmin = await prisma.user.create({
              data: {
                email,
                name: 'Tổng Quản Trị',
                password: hashedPassword,
                role: 'ADMIN',
              },
            });
            return superAdmin;
          }
        }

        // Standard user check
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          return null;
        }

        return user;
      }
    }),
  ],
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { role: true },
        });
        token.role = dbUser?.role || 'USER';
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
  },
});
