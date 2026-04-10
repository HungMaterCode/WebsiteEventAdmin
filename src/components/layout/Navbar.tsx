'use client';
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Menu, User, LogOut, ChevronDown, Ticket, ChevronRight, ShieldOff } from 'lucide-react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import GoogleLoginButton from '../auth/GoogleLoginButton';

export default function Navbar({ 
  onOpenBooking, 
  onOpenStatus,
  onOpenMyTickets,
  isLoginModalOpen: propIsLoginModalOpen, 
  setIsLoginModalOpen: propSetIsLoginModalOpen 
}: { 
  onOpenBooking?: (type: 'GA' | 'VIP' | null) => void, 
  onOpenStatus?: () => void,
  onOpenMyTickets?: () => void,
  isLoginModalOpen?: boolean,
  setIsLoginModalOpen?: (open: boolean) => void
}) {
  const { data: session } = useSession();
  const [internalLoginModalOpen, setInternalLoginModalOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
  const [isMobileSubMenuOpen, setIsMobileSubMenuOpen] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [systemSettings, setSystemSettings] = React.useState<any>(null);

  const isLoginModalOpen = propIsLoginModalOpen ?? internalLoginModalOpen;
  const setIsLoginModalOpen = propSetIsLoginModalOpen ?? setInternalLoginModalOpen;

  const isLoggedIn = !!session?.user;
  const isUserAccount = session?.user && (session.user as any).role === 'USER';
  const isAdmin = session?.user && (session.user as any).role === 'ADMIN';

  React.useEffect(() => {
    setMounted(true);
    fetch('/api/settings/system')
      .then(res => res.ok ? res.json() : null)
      .then(data => setSystemSettings(data))
      .catch(() => {});
  }, []);

  const navLinks = [
    { name: "Nghệ Sĩ", href: "#lineup" },
    { name: "Lộ Trình", href: "#timeline" },
    { name: "Sản Phẩm", href: "#merch" },
    { name: "Địa Điểm", href: "#location" },
  ];

  if (!mounted) return null;

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-100 bg-midnight/80 backdrop-blur-md border-b border-royal/30">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xl font-display font-black uppercase tracking-widest">
              <span className="text-gradient">Neon</span><span className="text-silver">Heritage</span>
            </Link>
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
              <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Live Experience</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} className="text-sm font-bold uppercase tracking-wider text-gray-300 hover:text-cyan transition-colors">{link.name}</a>
            ))}
            
            {isUserAccount ? (
              <div className="relative">
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                >
                   {session?.user?.image && !imageError ? (
                    <img 
                      src={session.user.image!} 
                      alt={session.user.name ?? ''} 
                      className="w-6 h-6 rounded-full border border-cyan/30" 
                      referrerPolicy="no-referrer"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <User className="w-5 h-5 text-cyan" />
                  )}
                  <span className="text-sm font-bold text-silver truncate max-w-[100px]">
                    {session?.user?.name?.split(' ').length === 1 
                      ? session?.user?.name 
                      : session?.user?.name?.split(' ').pop()}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-3 w-48 bg-midnight/95 backdrop-blur-xl border border-royal/30 rounded-2xl overflow-hidden shadow-2xl"
                    >
                      <div className="p-4 border-b border-royal/10">
                        <p className="text-xs text-gray-500 mb-1">Đã đăng nhập</p>
                        <p className="text-sm font-bold text-silver truncate">{session?.user?.email}</p>
                      </div>
                      <button 
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onOpenMyTickets?.();
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-cyan transition-all border-b border-royal/10"
                      >
                        <Ticket className="w-4 h-4" />
                        Lịch sử mua vé
                      </button>
                      <button 
                        onClick={() => signOut()}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-magenta hover:bg-magenta/5 transition-all"
                      >
                        <LogOut className="w-4 h-4" />
                        Đăng xuất
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : isAdmin ? (
              <div className="flex items-center gap-3">
                <Link 
                  href="/admin"
                  className="px-6 py-2 rounded-full bg-cyan/10 border border-cyan/30 text-cyan font-bold uppercase tracking-wider hover:bg-cyan/20 transition-all text-sm flex items-center gap-2"
                >
                  <ShieldOff className="w-4 h-4" />
                  Quản trị
                </Link>
                <button 
                  onClick={() => signOut()}
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 text-magenta flex items-center justify-center hover:bg-magenta/10 transition-all"
                  title="Đăng xuất"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsLoginModalOpen(true)}
                className="px-6 py-2 rounded-full bg-white/5 border border-white/10 text-gray-400 font-bold uppercase tracking-wider hover:bg-white/10 hover:text-cyan transition-all text-sm flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                Đăng nhập
              </button>
            )}

            <button suppressHydrationWarning onClick={() => onOpenBooking ? onOpenBooking(null) : window.location.href = '/'} className="px-6 py-2 rounded-full bg-magenta/10 border border-magenta text-magenta font-bold uppercase tracking-wider hover:bg-magenta hover:text-white transition-all glow-magenta text-sm">Mua Vé</button>
          </div>
          <button suppressHydrationWarning onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-silver">
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        <motion.div initial={false} animate={{ height: isMobileMenuOpen ? 'auto' : 0, opacity: isMobileMenuOpen ? 1 : 0 }} className="md:hidden overflow-hidden bg-midnight/95 backdrop-blur-xl border-b border-royal/30">
          <div className="p-6 space-y-6">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} onClick={() => setIsMobileMenuOpen(false)} className="block text-lg font-bold uppercase tracking-widest text-silver hover:text-cyan transition-colors">{link.name}</a>
            ))}
            
            {isUserAccount ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <button 
                    onClick={() => setIsMobileSubMenuOpen(!isMobileSubMenuOpen)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 transition-all group ${isMobileSubMenuOpen ? 'border-[#00FFFF]/50 bg-[#00FFFF]/5' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      {session?.user?.image && !imageError ? (
                        <img 
                          src={session.user.image!} 
                          alt="" 
                          className="w-8 h-8 rounded-full border border-cyan/30" 
                          referrerPolicy="no-referrer"
                          onError={() => setImageError(true)}
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                          <User className="w-4 h-4 text-cyan" />
                        </div>
                      )}
                      <div className="text-left">
                        <p className="text-sm font-bold text-silver">{session?.user?.name}</p>
                        <p className="text-xs text-gray-500">{session?.user?.email}</p>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 text-gray-500 group-hover:text-cyan transition-transform ${isMobileSubMenuOpen ? 'rotate-90' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isMobileSubMenuOpen && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-white/[0.02] rounded-xl border border-white/5"
                      >
                        <button 
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            setIsMobileSubMenuOpen(false);
                            onOpenMyTickets?.();
                          }}
                          className="w-full flex items-center gap-3 px-6 py-4 text-sm text-gray-300 hover:text-cyan transition-all"
                        >
                          <Ticket className="w-4 h-4" />
                          Lịch sử mua vé
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button suppressHydrationWarning onClick={() => { setIsMobileMenuOpen(false); signOut(); }} className="w-full py-4 rounded-xl bg-magenta/10 border border-magenta text-magenta font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                  <LogOut className="w-4 h-4" />
                  Đăng xuất
                </button>
              </div>
            ) : isAdmin ? (
              <div className="space-y-4">
                <Link 
                  href="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-4 rounded-xl bg-cyan/10 border border-cyan/50 text-cyan font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  <ShieldOff className="w-4 h-4" />
                  Bảng Quản Trị
                </Link>
                <button 
                  onClick={() => { setIsMobileMenuOpen(false); signOut(); }}
                  className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-magenta font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Đăng xuất
                </button>
              </div>
            ) : (
              <button suppressHydrationWarning onClick={() => { setIsMobileMenuOpen(false); setIsLoginModalOpen(true); }} className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-silver font-bold uppercase tracking-widest">Đăng nhập</button>
            )}
            
            <button suppressHydrationWarning onClick={() => { setIsMobileMenuOpen(false); onOpenBooking ? onOpenBooking('GA') : window.location.href = '/'; }} className="w-full py-4 rounded-xl bg-gradient-primary text-white font-bold uppercase tracking-widest glow-magenta">Mua Vé Ngay</button>
          </div>
        </motion.div>
      </nav>

      {/* Login Modal */}
      <AnimatePresence>
        {isLoginModalOpen && (
          <div className="fixed inset-0 z-1000 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLoginModalOpen(false)}
              className="absolute inset-0 bg-midnight/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm glass-card p-8 rounded-3xl border border-royal/30 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-magenta/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
              <button 
                onClick={() => setIsLoginModalOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center mb-8">
                <h2 className="text-2xl font-display font-black uppercase tracking-widest mb-2"><span className="text-magenta text-glow">User</span> <span className="text-silver">Portal</span></h2>
                <p className="text-gray-400 text-sm">Đăng nhập để quản lý vé và nhận ưu đãi độc quyền.</p>
              </div>

              <GoogleLoginButton />

              <p className="mt-8 text-[10px] text-gray-600 text-center uppercase tracking-widest">Neon Heritage Experience &copy; 2024</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

