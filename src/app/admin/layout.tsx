'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LogOut, LayoutDashboard, Ticket, Map, Users, ShoppingBag, 
  CreditCard, DollarSign, QrCode, Gamepad2, Megaphone, Star, 
  Newspaper, Lock, BarChart3, Settings,
  ChevronLeft, ChevronRight, CheckCircle2, ChevronDown
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
  { id: 'analytics', label: 'Phân tích & Báo cáo', icon: <BarChart3 />, role: ['ADMIN', 'ANALYST'], path: '/admin/analytics' },
  { id: 'settings', label: 'Cài đặt (Nhật ký)', icon: <Settings />, role: ['ADMIN'], path: '/admin/settings' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);
  const [showProfileMenu, setShowProfileMenu] = React.useState(false);
  const [expandedMenus, setExpandedMenus] = React.useState<string[]>(['landing-page']);

  const toggleMenu = (id: string) => {
    setExpandedMenus(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  // Mock roles for now until auth is fully implemented on client side
  const roles = ['ADMIN']; 
  const allowedMenuItems = MENU_ITEMS.filter(m => roles.some(r => m.role.includes(r as any)));

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#060010] text-[#FFFFFF] font-sans selection:bg-[#E6C753] selection:text-[#060010] flex overflow-hidden">
      {/* Sidebar Overlay (Mobile) */}
      <div className={`fixed inset-0 bg-[#060010]/80 backdrop-blur-sm z-40 lg:hidden ${false ? 'block' : 'hidden'}`} onClick={() => {}}></div>

      {/* Sidebar components */}
      <motion.aside 
        animate={{ width: isSidebarCollapsed ? 80 : 280 }}
        className="fixed lg:relative z-50 h-screen bg-[#0D0716] border-r border-[#4F1F76]/30 flex flex-col pt-6 shrink-0"
      >
        <div className="px-6 mb-8 flex items-center justify-between">
          <Link href="/" className={`font-display font-black uppercase tracking-widest ${isSidebarCollapsed ? 'hidden' : 'block'}`}>
            <span className="text-[#FF0088]">Cyber</span><br/><span className="text-[#00FFFF]">Admin</span>
          </Link>
          {isSidebarCollapsed && <span className="text-[#E6C753] font-display font-black text-xl mx-auto">CA</span>}
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
                      ${isExpanded ? 'bg-[#4F1F76]/10 text-[#FFFFFF]' : 'text-[#8A8F98] hover:bg-[#4F1F76]/20 hover:text-[#FFFFFF]'}`}
                  >
                    <div className={`shrink-0 flex items-center justify-center [&>svg]:w-5 [&>svg]:h-5 ${isExpanded ? 'text-[#FF0088]' : 'text-[#8A8F98] group-hover:text-[#FF0088]'}`}>
                      {item.icon}
                    </div>
                    {!isSidebarCollapsed && (
                      <span className="font-semibold text-sm tracking-wide whitespace-nowrap">{item.label}</span>
                    )}
                    {!isSidebarCollapsed && (
                      <ChevronDown className={`ml-auto w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-[#00FFFF]' : 'text-[#8A8F98]'}`} />
                    )}
                  </button>
                  
                  <AnimatePresence>
                    {isExpanded && !isSidebarCollapsed && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden flex flex-col gap-1 ml-4 pl-4 border-l border-[#4F1F76]/30"
                      >
                        {item.children.map((child: any) => {
                          const isChildActive = pathname === child.path;
                          return (
                            <Link
                              key={child.id}
                              href={child.path}
                              className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all duration-300
                                ${isChildActive 
                                  ? 'text-[#00FFFF] font-bold bg-[#00FFFF]/10' 
                                  : 'text-[#8A8F98] hover:text-[#FFFFFF] hover:bg-[#4F1F76]/20'}`}
                            >
                              <div className={`w-1.5 h-1.5 rounded-full ${isChildActive ? 'bg-[#00FFFF] glow-cyan' : 'bg-[#4F1F76]'}`}></div>
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
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group
                  ${isActive 
                    ? 'bg-gradient-to-r from-[#00FFFF]/20 to-transparent border-l-4 border-[#00FFFF] text-[#00FFFF]' 
                    : 'text-[#8A8F98] hover:bg-[#4F1F76]/20 hover:text-[#FFFFFF]'
                  }`}
                title={item.label}
              >
                <div className={`shrink-0 flex items-center justify-center [&>svg]:w-5 [&>svg]:h-5 ${isActive ? 'text-[#00FFFF]' : 'text-[#8A8F98] group-hover:text-[#FF0088]'}`}>
                  {item.icon}
                </div>
                {!isSidebarCollapsed && (
                  <span className="font-semibold text-sm tracking-wide whitespace-nowrap">{item.label}</span>
                )}
                {isActive && !isSidebarCollapsed && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#E6C753] glow-gold shadow-[0_0_10px_#E6C753]"></div>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#4F1F76]/30 mt-auto">
          {!isSidebarCollapsed && (
            <div className="px-4 py-3 bg-[#4F1F76]/10 rounded-xl border border-[#4F1F76]/30 mb-4 flex items-center justify-between">
              <div>
                <div className="text-xs text-[#8A8F98]">Quyền hạn</div>
                <div className="text-sm font-bold text-[#E6C753]">ADMIN</div>
              </div>
              <CheckCircle2 className="w-5 h-5 text-[#00FFFF]" />
            </div>
          )}
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
            className="w-full flex items-center justify-center p-2 rounded-lg text-[#8A8F98] hover:bg-[#4F1F76]/20 hover:text-white transition-colors"
          >
            {isSidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#4F1F76]/10 via-[#060010] to-[#060010]">
        
        {/* Top Header */}
        <header className="h-20 bg-[#0D0716]/80 backdrop-blur-md border-b border-[#4F1F76]/30 flex items-center justify-between px-6 shrink-0 relative z-30">
          <div className="flex items-center gap-4">
            <h1 className="text-xl md:text-2xl font-display font-bold uppercase tracking-widest text-[#FFFFFF]">Quản Trị Hệ Thống</h1>
          </div>

          <div className="flex items-center gap-6 relative">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00FFFF]/10 border border-[#00FFFF]/30">
              <div className="w-2 h-2 rounded-full bg-[#00FFFF] animate-pulse glow-cyan"></div>
              <span className="text-xs font-bold text-[#00FFFF] tracking-widest uppercase">Live Network</span>
            </div>
            
            <div className="w-px h-8 bg-[#4F1F76]/50"></div>
            
            <div className="relative">
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-3 hover:bg-[#4F1F76]/20 py-2 px-3 rounded-xl transition-colors"
              >
                <div className="w-10 h-10 rounded-full border-2 border-[#E6C753] p-0.5 glow-gold shadow-[0_0_10px_rgba(230,199,83,0.3)] shrink-0">
                  <div className="w-full h-full rounded-full bg-[#4F1F76]/50 flex items-center justify-center">
                    <span className="text-[#FFFFFF] font-bold text-sm">TVH</span>
                  </div>
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-bold text-[#FFFFFF]">Trần Vũ Hùng</div>
                  <div className="text-[10px] uppercase tracking-widest text-[#8A8F98]">admin@eventadmin.vn</div>
                </div>
                <ChevronDown className={`w-4 h-4 text-[#8A8F98] transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-56 bg-[#0D0716] border border-[#4F1F76]/50 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden z-50"
                  >
                    <div className="p-4 border-b border-[#4F1F76]/30 bg-gradient-to-br from-[#4F1F76]/20 to-transparent">
                      <div className="font-bold text-[#E6C753] mb-1">Phiên bản: 1.0.0</div>
                      <div className="text-xs text-[#8A8F98]">Bản quyền thuộc Neon Heritage</div>
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
