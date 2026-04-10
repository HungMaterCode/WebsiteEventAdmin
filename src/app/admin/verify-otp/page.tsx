'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Mail, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';

export default function VerifyOtpPage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  // Auto focus first input
  useEffect(() => {
    const firstInput = document.getElementById('otp-0');
    if (firstInput) firstInput.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1); // Only take last char
    if (!/^\d*$/.test(value)) return; // Only numbers

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const fullOtp = otp.join('');
    if (fullOtp.length < 6) return;

    setLoading(true);
    setError('');

    try {
      const resp = await fetch('/api/admin/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp: fullOtp }),
      });

      const result = await resp.json();

      if (result.success) {
        // Update session to reflect twoFactorVerified: true
        await update({ twoFactorVerified: true });
        router.push('/admin');
        router.refresh();
      } else {
        setError(result.error || 'Mã xác thực không hợp lệ!');
      }
    } catch (err) {
      setError('Đã có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError('');
    try {
      const resp = await fetch('/api/admin/auth/resend-otp', { method: 'POST' });
      const result = await resp.json();
      if (result.success) {
        alert('Mã mới đã được gửi vào email của bạn!');
      } else {
        setError(result.error || 'Không thể gửi lại mã!');
      }
    } catch (err) {
      setError('Lỗi kết nối khi gửi lại mã.');
    } finally {
      setResending(false);
    }
  };

  // If already verified, go to admin
  useEffect(() => {
    if (session?.user && (session.user as any).twoFactorVerified) {
      router.push('/admin');
    }
  }, [session, router]);

  if (session?.user && (session.user as any).twoFactorVerified) {
    return null;
  }

  return (
    <div className="min-h-screen w-full bg-[#060010] text-white flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Decorative Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#FF0088]/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#00FFFF]/10 rounded-full blur-[120px]"></div>
      
      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in duration-500">
        <div className="bg-black/40 backdrop-blur-2xl border border-white/10 p-8 md:p-10 rounded-[40px] shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-[#4F1F76]/30 border border-[#4F1F76]/50 mb-6 relative">
              <ShieldCheck className="w-10 h-10 text-[#00FFFF] drop-shadow-[0_0_10px_#00FFFF]" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF0088] rounded-full animate-pulse"></div>
            </div>
            <h1 className="text-3xl font-display font-black uppercase tracking-[0.2em] mb-3">Xác Minh <span className="text-[#00FFFF]">OTP</span></h1>
            <p className="text-[#8A8F98] text-sm leading-relaxed max-w-[280px] mx-auto">
              Mã bảo mật đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex justify-between gap-2 md:gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  autoComplete="off"
                  className="w-full aspect-square bg-white/5 border-2 border-white/10 rounded-2xl text-center text-2xl font-bold text-[#FFFFFF] focus:outline-none focus:border-[#00FFFF] focus:shadow-[0_0_20px_rgba(0,255,255,0.2)] transition-all"
                />
              ))}
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center font-medium animate-shake">
                {error}
              </div>
            )}

            <button
              disabled={loading || otp.join('').length < 6}
              className="w-full py-5 bg-gradient-to-r from-[#4F1F76] to-[#2D1245] hover:from-[#00FFFF] hover:to-[#00CCCC] hover:text-black border border-white/10 rounded-2xl font-black uppercase tracking-widest transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed group shadow-[0_10px_30px_rgba(79,31,118,0.3)] hover:shadow-[0_10px_30px_rgba(0,255,255,0.3)]"
            >
              <div className="flex items-center justify-center gap-3">
                {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : (
                  <>
                    XÁC NHẬN TRUY CẬP 
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-white/5 text-center">
            <p className="text-xs text-[#8A8F98] mb-4">Bạn vẫn chưa nhận được mã?</p>
            <button 
              onClick={handleResend}
              disabled={resending}
              className="px-6 py-2 rounded-full border border-white/10 hover:border-[#00FFFF]/50 hover:bg-[#00FFFF]/5 text-[#00FFFF] text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 mx-auto disabled:opacity-50"
            >
              {resending ? <RefreshCw className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
              Gửi lại mã mới
            </button>
          </div>

        </div>

        <p className="mt-8 text-center text-[10px] uppercase tracking-[0.3em] text-[#4F1F76] font-display font-medium">
          Secure Portal &bull; Encrypted &bull; Live
        </p>
      </div>
    </div>
  );
}
