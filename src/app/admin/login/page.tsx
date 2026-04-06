import React from 'react';
import { signIn } from '@/lib/auth';

export default function LoginPage({ searchParams }: { searchParams: { error?: string } }) {
  // next-auth adds error=CredentialsSignin in the URL when login fails
  const isError = searchParams?.error === 'CredentialsSignin';

  return (
    <div className="min-h-screen w-full bg-midnight text-silver font-sans flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-md p-8 rounded-3xl relative overflow-hidden border border-royal/30">
        <div className="absolute top-0 right-0 w-32 h-32 bg-magenta/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan/10 rounded-full blur-3xl -ml-16 -mb-16"></div>
        
        <div className="relative z-10 text-center">
          <h1 className="text-3xl font-display font-black uppercase tracking-widest mb-2"><span className="text-magenta">Cyber</span><span className="text-cyan">Admin</span></h1>
          <p className="text-gray-400 text-sm mb-8">Hệ thống quản trị Neon Heritage Festival</p>
          
          {isError && (
            <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium">
              Thông tin đăng nhập không chính xác!
            </div>
          )}
          
          <form 
            action={async (formData) => {
              'use server';
              await signIn('credentials', { 
                email: formData.get('email'), 
                password: formData.get('password'),
                redirectTo: '/admin' 
              });
            }}
            className="space-y-4"
          >
            <div>
              <input 
                name="email"
                type="email" 
                placeholder="Email tài khoản" 
                required
                className="w-full bg-[#060010]/50 border border-[#4F1F76]/50 rounded-xl px-4 py-3 text-[#FFFFFF] font-mono focus:outline-none focus:border-[#00FFFF]/50 transition-colors"
              />
            </div>
            
            <div>
              <input 
                name="password"
                type="password" 
                placeholder="Mật khẩu" 
                required
                className="w-full bg-[#060010]/50 border border-[#4F1F76]/50 rounded-xl px-4 py-3 text-[#FFFFFF] font-mono focus:outline-none focus:border-[#00FFFF]/50 transition-colors"
              />
            </div>

            <button type="submit" className="w-full py-4 mt-2 bg-[#4F1F76] hover:bg-[#4F1F76]/80 border border-[#4F1F76] rounded-xl font-bold transition-all flex items-center justify-center gap-3">
              <span>Đăng nhập hệ thống</span>
            </button>
          </form>
          
          <div className="mt-8 text-xs text-gray-500">
            Khu vực dành riêng cho Ban Tổ Chức.<br/>Mọi hành vi truy cập trái phép sẽ bị ghi nhận.
          </div>
        </div>
      </div>
    </div>
  );
}
