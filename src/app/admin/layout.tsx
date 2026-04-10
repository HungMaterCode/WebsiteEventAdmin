'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LogOut, LayoutDashboard, Ticket, Map, Users, ShoppingBag, 
  CreditCard, DollarSign, QrCode, Gamepad2, Megaphone, ListTodo, 
  Newspaper, Lock, BarChart3, Settings,
  ChevronLeft, ChevronRight, CheckCircle2, ChevronDown, Menu, Star
} from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';

const MENU_ITEMS = [
  { id: 'dashboard', label: 'Tổng quan Dashboard', icon: <LayoutDashboard />, role: ['ADMIN', 'SALES', 'ANALYST'], path: '/admin' },
  { 
    id: 'landing-page', 
    label: 'LandingPage', 
    icon: <Megaphone />, 
    role: ['ADMIN'],
    children: [
      { id: 'banner', label: 'Banner', path: '/admin/landing-page/banner' },
      { id: 'artists', label: 'Nghệ sĩ tham gia', path: '/admin/landing-page/artists' },
      { id: 'video', label: 'Video', path: '/admin/landing-page/video' },
      { id: 'art', label: 'Nghệ thuật', path: '/admin/landing-page/art' },
      { id: 'gallery', label: 'Khoảnh khắc', path: '/admin/landing-page/gallery' },
      { id: 'timeline', label: 'Lộ trình', path: '/admin/landing-page/timeline' },
      { id: 'community', label: 'Cộng đồng', path: '/admin/landing-page/community' },
      { id: 'faqs', label: 'Câu hỏi', path: '/admin/landing-page/faqs' },
      { id: 'travel', label: 'Di chuyển', path: '/admin/landing-page/travel' },
      { id: 'location', label: 'Địa điểm', path: '/admin/landing-page/location' },
    ]

  },
  { id: 'tickets', label: 'Quản lý Vé', icon: <Ticket />, role: ['ADMIN', 'SALES'], path: '/admin/tickets' },
  { id: 'zones', label: 'Quản lý Khu vực', icon: <Map />, role: ['ADMIN'], path: '/admin/zones' },
  { id: 'customers', label: 'Quản lý Khách hàng', icon: <Users />, role: ['ADMIN', 'SALES'], path: '/admin/customers' },
  { id: 'products', label: 'Quản lý Sản phẩm', icon: <ShoppingBag />, role: ['ADMIN', 'SALES'], path: '/admin/products' },
  { id: 'orders', label: 'Quản lý Đơn hàng', icon: <CreditCard />, role: ['ADMIN', 'SALES'], path: '/admin/orders' },
  { id: 'transactions', label: 'Quản lý Giao dịch', icon: <DollarSign />, role: ['ADMIN', 'SALES'], path: '/admin/transactions' },
  { id: 'checkin', label: 'Hệ thống Check-in', icon: <QrCode />, role: ['ADMIN', 'CHECKIN'], path: '/admin/checkin' },
  { id: 'loto', label: 'Trò chơi (Loto)', icon: <Gamepad2 />, role: ['ADMIN', 'CHECKIN'], path: '/admin/loto' },
  { id: 'marketing', label: 'Marketing & Khuyến mãi', icon: <Megaphone />, role: ['ADMIN'], path: '/admin/marketing' },
  { id: 'reviews', label: 'Quản lý Đánh giá', icon: <Star />, role: ['ADMIN', 'ANALYST'], path: '/admin/reviews' },
  { id: 'news', label: 'Quản lý Tin tức', icon: <Newspaper />, role: ['ADMIN'], path: '/admin/news' },
  { id: 'roles', label: 'Vai trò & Quyền hạn', icon: <Lock />, role: ['ADMIN'], path: '/admin/roles' },
  { 
    id: 'analytics', 
    label: 'Phân tích & Báo cáo', 
    icon: <BarChart3 />, 
    role: ['ADMIN', 'ANALYST'], 
    path: '/admin/analytics',
    children: [
      { id: 'analytics-overview', label: 'Tổng quan', path: '/admin/analytics/overview' },
      { id: 'analytics-tickets', label: 'Vé & Doanh thu', path: '/admin/analytics/tickets-revenue' },
      { id: 'analytics-checkin', label: 'Báo cáo Check-in', path: '/admin/analytics/checkin-checkout' },
      { id: 'analytics-customers', label: 'Phân tích Khách hàng', path: '/admin/analytics/customers' },
      { id: 'analytics-feedback', label: 'Đánh giá', path: '/admin/analytics/feedback' },
      { id: 'analytics-export', label: 'Xuất Excel', path: '/admin/analytics/export' },
    ]
  },
  { id: 'settings', label: 'Cài đặt (Nhật ký)', icon: <Settings />, role: ['ADMIN'], path: '/admin/settings' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);
  const [showProfileMenu, setShowProfileMenu] = React.useState(false);
  const [expandedMenus, setExpandedMenus] = React.useState<string[]>(['landing-page', 'analytics']);
  const [mounted, setMounted] = React.useState(false);


  const toggleMenu = (id: string) => {
    setExpandedMenus(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  React.useEffect(() => {
    setMounted(true);
  }, []);



  // Mock roles for now until auth is fully implemented on client side
  const roles = ['ADMIN']; 
  const allowedMenuItems = MENU_ITEMS.filter(m => roles.some(r => m.role.includes(r as any)));

  const { data: session } = useSession();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/', redirect: true });
  };

  // Idle Timeout logic
  React.useEffect(() => {
    if (!mounted || !session?.user || pathname === '/admin/login' || pathname === '/admin/verify-otp') return;

    let timeoutId: NodeJS.Timeout;
    let timeoutMs = 24 * 60 * 60 * 1000; // Default 24h
    
    const fetchSettingsAndSetupTimer = async () => {
      try {
        const resp = await fetch('/api/settings/system');
        const data = await resp.json();
        const timeoutStr = data?.sessionTimeout || '24h';
        
        let calculatedMs = 24 * 60 * 60 * 1000;
        const value = parseInt(timeoutStr);
        if (timeoutStr.endsWith('h')) calculatedMs = value * 60 * 60 * 1000;
        else if (timeoutStr.endsWith('d')) calculatedMs = value * 24 * 60 * 60 * 1000;
        else if (timeoutStr.endsWith('m')) calculatedMs = value * 60 * 1000;
        else if (timeoutStr.endsWith('s')) calculatedMs = value * 1000;
        
        timeoutMs = calculatedMs;
        console.log(`[AUTH] Idle timeout set to: ${timeoutStr} (${timeoutMs}ms)`);
        
        // Bắt đầu đếm ngược sau khi đã có cấu hình
        resetTimer();
      } catch (err) {
        console.error('Failed to fetch session timeout:', err);
        resetTimer(); // Vẫn bắt đầu timer với mặc định nếu lỗi
      }
    };

    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      
      // Log để debug (có thể xóa sau khi xong)
      if (timeoutMs < 3600000) { // Chỉ log nếu thời gian chờ ngắn để tránh spam console
        console.log(`[IDLE TIMER] Resetting idle timer to ${timeoutMs}ms...`);
      }

      timeoutId = setTimeout(() => {
        console.log('[AUTH] Session idle timeout reached. Signing out...');
        handleSignOut();
      }, timeoutMs);
    };

    const events = ['mousemove', 'keydown', 'mousedown', 'touchstart', 'scroll'];
    const handler = () => resetTimer();
    
    events.forEach(event => window.addEventListener(event, handler));
    
    // Khởi tạo lấy dữ liệu và chạy timer
    fetchSettingsAndSetupTimer();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      events.forEach(event => window.removeEventListener(event, handler));
    };
  }, [mounted, session, pathname]);

  if (pathname === '/admin/login' || pathname === '/admin/verify-otp') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-admin-bg text-admin-text font-sans selection:bg-magenta selection:text-admin-text flex overflow-hidden">
      {/* Sidebar Overlay (Mobile) */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-admin-bg/80 backdrop-blur-sm z-40 lg:hidden" 
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar components */}
      <motion.aside 
        initial={false}
        animate={{ 
          width: isSidebarCollapsed ? 80 : 280,
          x: mounted && typeof window !== 'undefined' && window.innerWidth < 1024 
            ? (isMobileSidebarOpen ? 0 : -280) 
            : 0
        }}
        transition={{ type: 'spring', damping: 20, stiffness: 200 }}
        className="fixed lg:relative z-50 h-screen bg-admin-panel border-r border-admin-border flex flex-col pt-6 shrink-0"
      >
        <div className="px-6 mb-8 flex items-center justify-between">
          <Link href="/" className={`font-display font-black uppercase tracking-widest ${isSidebarCollapsed ? 'hidden' : 'block'}`}>
            <span className="text-magenta">Cyber</span><br/><span className="text-cyan">Admin</span>
          </Link>
          {isSidebarCollapsed && <span className="text-gold font-display font-black text-xl mx-auto">CA</span>}
        </div>

        <nav className="flex-1 overflow-y-auto px-4 space-y-2 pb-6 custom-scrollbar">
          {allowedMenuItems.map((item: any) => {
            const hasChildren = item.children && item.children.length > 0;
            const isExpanded = expandedMenus.includes(item.id);
            const isActive = item.path ? (pathname === item.path || (pathname?.startsWith(item.path) && item.path !== '/admin')) : false;

            if (hasChildren) {
              return (
                <div key={item.id} className="flex flex-col gap-1">
                  <button
                    onClick={() => toggleMenu(item.id)}
                    className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group w-full
                      ${isExpanded ? 'bg-admin-bg/50 text-admin-text' : 'text-admin-text-muted hover:bg-admin-bg/80 hover:text-admin-text'}`}
                  >
                    <div className={`shrink-0 flex items-center justify-center [&>svg]:w-5 [&>svg]:h-5 ${isExpanded ? 'text-magenta' : 'text-admin-text-muted group-hover:text-magenta'}`}>
                      {item.icon}
                    </div>
                    {!isSidebarCollapsed && (
                      <span className="font-semibold text-sm tracking-wide whitespace-nowrap">{item.label}</span>
                    )}
                    {!isSidebarCollapsed && (
                      <ChevronDown className={`ml-auto w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-cyan' : 'text-admin-text-muted'}`} />
                    )}
                  </button>
                  
                  <AnimatePresence>
                    {isExpanded && !isSidebarCollapsed && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden flex flex-col gap-1 ml-4 pl-4 border-l border-admin-border"
                      >
                        {item.children.map((child: any) => {
                          const isChildActive = pathname === child.path;
                          return (
                            <Link
                              key={child.id}
                              href={child.path}
                              onClick={() => {
                                if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                                  setIsMobileSidebarOpen(false);
                                }
                              }}
                              className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all duration-300
                                ${isChildActive 
                                  ? 'text-cyan font-bold bg-cyan/10' 
                                  : 'text-admin-text-muted hover:text-admin-text hover:bg-admin-bg/50'}`}
                            >
                              <div className={`w-1.5 h-1.5 rounded-full ${isChildActive ? 'bg-cyan glow-cyan' : 'bg-admin-bg'}`}></div>
                              {child.label}
                            </Link>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            return (
              <Link
                key={item.id}
                href={item.path}
                onClick={() => {
                  if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                    setIsMobileSidebarOpen(false);
                  }
                }}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group
                  ${isActive 
                    ? 'bg-gradient-to-r from-cyan/10 to-transparent border-l-4 border-cyan text-cyan' 
                    : 'text-admin-text-muted hover:bg-admin-bg/50 hover:text-admin-text'}`}
                title={item.label}
              >
                <div className={`shrink-0 flex items-center justify-center [&>svg]:w-5 [&>svg]:h-5 ${isActive ? 'text-cyan' : 'text-admin-text-muted group-hover:text-magenta'}`}>
                  {item.icon}
                </div>
                {!isSidebarCollapsed && (
                  <span className="font-semibold text-sm tracking-wide whitespace-nowrap">{item.label}</span>
                )}
                {isActive && !isSidebarCollapsed && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-gold glow-gold"></div>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-admin-border mt-auto">
          {!isSidebarCollapsed && (
            <div className="px-4 py-3 bg-admin-bg/50 rounded-xl border border-admin-border mb-4 flex items-center justify-between">
              <div>
                <div className="text-xs text-admin-text-muted">Quyền hạn</div>
                <div className="text-sm font-bold text-gold">ADMIN</div>
              </div>
              <CheckCircle2 className="w-5 h-5 text-cyan" />
            </div>
          )}
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
            className="w-full flex items-center justify-center p-2 rounded-lg text-admin-text-muted hover:bg-black/5 dark:hover:bg-white/10 hover:text-admin-text transition-colors"
          >
            {isSidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-transparent via-admin-bg to-admin-bg">
        
        {/* Top Header */}
        <header className="h-20 bg-admin-panel/80 backdrop-blur-md border-b border-admin-border flex items-center justify-between px-6 shrink-0 relative z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-admin-bg/50 border border-admin-border text-admin-text-muted hover:text-admin-text transition-all"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-xl md:text-2xl font-display font-bold uppercase tracking-widest text-admin-text">Quản Trị Hệ Thống</h1>
          </div>

          <div className="flex items-center gap-6 relative">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan/10 border border-cyan/30">
              <div className="w-2 h-2 rounded-full bg-cyan animate-pulse glow-cyan"></div>
              <span className="text-xs font-bold text-cyan tracking-widest uppercase">Live Network</span>
            </div>
            
            <div className="w-px h-8 bg-admin-border/50"></div>
            
            <div className="relative">
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-3 hover:bg-admin-bg/50 py-2 px-3 rounded-xl transition-colors"
              >
                <div className="w-10 h-10 rounded-full border-2 border-gold p-0.5 glow-gold shadow-[0_0_10px_rgba(230,199,83,0.3)] shrink-0">
                  <div className="w-full h-full rounded-full bg-admin-bg/50 flex items-center justify-center">
                    <span className="text-admin-text font-bold text-sm">TVH</span>
                  </div>
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-bold text-admin-text">Trần Vũ Hùng</div>
                  <div className="text-[10px] uppercase tracking-widest text-admin-text-muted">admin@eventadmin.vn</div>
                </div>
                <ChevronDown className={`w-4 h-4 text-admin-text-muted transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-56 bg-admin-panel border border-admin-border rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden z-50"
                  >
                    <div className="p-4 border-b border-admin-border bg-gradient-to-br from-admin-bg/20 to-transparent">
                      <div className="font-bold text-gold mb-1">Phiên bản: 1.0.0</div>
                      <div className="text-xs text-admin-text-muted">Bản quyền thuộc Neon Heritage</div>
                    </div>
                    <button 
                      onClick={handleSignOut}
                      className="w-full px-4 py-3 flex items-center gap-3 text-red-500 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="font-bold">Đăng xuất hệ thống</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Content Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 custom-scrollbar">
          {children}
        </div>
      </main>
    </div>
  );
}
