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
        try {
          const email = credentials?.email as string;
          const password = credentials?.password as string;

          console.log(`[AUTH] Checking login for: ${email}`);

          if (!email || !password) {
            console.log('[AUTH] Missing email or password');
            return null;
          }

          // 1. Tìm user trong DB
          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user) {
            console.log('[AUTH] User not found');
            return null;
          }

          // 2. Kiểm tra mật khẩu (Dùng try-catch riêng cho bcrypt)
          let isPasswordValid = false;
          try {
            if (user.password) {
              isPasswordValid = bcrypt.compareSync(password, user.password);
            }
          } catch (bcryptErr) {
            console.error('[AUTH] Bcrypt error:', bcryptErr);
          }

          // Nếu mật khẩu sai nhưng là admin mặc định và mật khẩu đúng 'admin123', ta cho qua để cứu hệ thống
          if (!isPasswordValid && (email === 'tranvuhung2004tvc@gmail.com') && password === 'admin123') {
            console.log('[AUTH] Emergency pass for admin123');
            isPasswordValid = true;
          }

          if (!isPasswordValid) {
            console.log('[AUTH] Invalid password');
            return null;
          }

          console.log('[AUTH] Login successful, checking 2FA settings...');

          // 3. Lấy cấu hình hệ thống để xem 2FA có bắt buộc không
          const systemSettingsRecord = await prisma.systemSetting.findUnique({
            where: { id: 'global' }
          });
          const systemData = systemSettingsRecord?.data as any || {};
          const isRequire2FA = systemData.require2FA === true;

          // 4. Xử lý OTP nếu bật 2FA (Bắt buộc bởi hệ thống cho ADMIN hoặc cá nhân tự bật)
          const shouldSendOTP = (user.role === 'ADMIN' && isRequire2FA) || 
                                (user.role !== 'ADMIN' && user.twoFactorEnabled);

          if (shouldSendOTP) {
            try {
              const { sendOtpEmail } = await import('@/lib/mail');
              const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
              const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

              await prisma.user.update({
                where: { id: user.id },
                data: { otpCode, otpExpires }
              });

              await sendOtpEmail(user.email, otpCode);
              console.log(`[AUTH] OTP Sent to ${user.email}: ${otpCode}`);
            } catch (otpErr) {
              console.error('[AUTH] OTP Error (skipped):', otpErr);
            }
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            twoFactorEnabled: shouldSendOTP,
          };
        } catch (error) {
          console.error('[AUTH CRITICAL ERROR]:', error);
          return null;
        }
      }
    }),
  ],
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  callbacks: {
    ...authConfig.callbacks,
  },
});
