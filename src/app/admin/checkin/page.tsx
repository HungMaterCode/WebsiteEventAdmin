'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  QrCode, CheckCircle2, XCircle, Clock, Search, Zap, 
  Users, TrendingUp, LogIn, LogOut, Loader2, RefreshCw 
} from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';

interface CheckinLog {
  id: string;
  bookingCode: string;
  guestName: string;
  type: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  updatedAt: string;
}

interface Stats {
  totalTickets: number;
  checkedIn: number;
  checkedOut: number;
  currentlyPresent: number;
  errorCount: number;
}

export default function AdminCheckinPage() {
  const [scanInput, setScanInput] = React.useState('');
  const [mode, setMode] = React.useState<'IN' | 'OUT'>('IN');
  const [stats, setStats] = React.useState<Stats | null>(null);
  const [logs, setLogs] = React.useState<CheckinLog[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [lastScanResult, setLastScanResult] = React.useState<{ 
    success: boolean; 
    message: string; 
    guest?: string;
    type?: string;
  } | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/checkin');
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        setLogs(data.logs);
      }
    } catch (error) {
      console.error('Failed to fetch checkin data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
    
    // Initialize QR Scanner
    const scanner = new Html5QrcodeScanner(
      "reader", 
      { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
    );

    scanner.render(onScanSuccess, onScanFailure);

    function onScanSuccess(decodedText: string) {
      // Avoid multiple scans of the same code quickly
      handleCodeCheck(decodedText);
    }

    function onScanFailure(error: any) {
      // console.warn(`Code scan error = ${error}`);
    }

    return () => {
      scanner.clear().catch(error => console.error("Failed to clear scanner", error));
    };
  }, []);

  // Effect to handle mode change influence on scanner logic if needed
  // But usually we just read the current state of 'mode' inside handleCodeCheck

  // Since handleCodeCheck is called from a callback that might have stale closure, 
  // we use a ref or just rely on the fact that scanning is relatively slow.
  // Better: use a Ref for mode or re-init scanner? No, let's use a function that 
  // we refresh or just use the current 'mode' state in a way that works.
  
  // Actually, we can just use the input form to test first.
  
  const handleCodeCheck = async (code: string) => {
    if (isProcessing) return;
    setIsProcessing(true);
    
    try {
      // Visual feedback: clear last result
      setLastScanResult(null);

      const res = await fetch('/api/admin/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim(), mode })
      });

      const data = await res.json();

      if (res.ok) {
        setLastScanResult({
          success: true,
          message: data.message,
          guest: data.guestName,
          type: data.type
        });
        // Play success sound if desired
        fetchData(); // Refresh stats and logs
      } else {
        setLastScanResult({
          success: false,
          message: data.error,
          guest: data.guestName
        });
      }
    } catch (error) {
      setLastScanResult({
        success: false,
        message: 'Lỗi kết nối máy chủ'
      });
    } finally {
      setIsProcessing(false);
      setScanInput('');
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (scanInput.trim()) {
      handleCodeCheck(scanInput);
    }
  };

  const getLogStatus = (log: CheckinLog) => {
    // If both are present, show the most recent one
    const isCheckInRecent = !log.checkOutTime || (log.checkInTime && new Date(log.checkInTime) > new Date(log.checkOutTime));
    
    if (log.checkOutTime && !isCheckInRecent) {
      return { 
        label: 'RA (OUT)', 
        style: 'bg-gold/10 text-gold border-gold/30', 
        icon: LogOut,
        time: log.checkOutTime
      };
    }
    return { 
      label: 'VÀO (IN)', 
      style: 'bg-emerald/10 text-emerald border-emerald/30', 
      icon: LogIn,
      time: log.checkInTime
    };
  };

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-black uppercase text-admin-text">Hệ Thống Check-In/Out</h2>
          <p className="text-admin-text-muted text-sm mt-1">Xác thực vé và kiểm soát luồng người tham dự thực tế</p>
        </div>
        
        <div className="flex bg-admin-bg p-1 rounded-2xl border border-admin-border/30">
          <button 
            onClick={() => setMode('IN')}
            className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2
              ${mode === 'IN' ? 'bg-cyan text-midnight glow-cyan' : 'text-admin-text-muted hover:text-admin-text'}`}
          >
            <LogIn className="w-4 h-4" /> Lối Vào
          </button>
          <button 
            onClick={() => setMode('OUT')}
            className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2
              ${mode === 'OUT' ? 'bg-magenta text-white glow-magenta' : 'text-admin-text-muted hover:text-admin-text'}`}
          >
            <LogOut className="w-4 h-4" /> Lối Ra
          </button>
        </div>
      </div>

      {/* Live Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Tổng Vé Bán', value: stats?.totalTickets.toLocaleString() || '0', color: 'text-admin-text', bg: 'bg-admin-text/5 border-admin-text/10', icon: Users },
          { label: 'Đã Check-In', value: stats?.checkedIn.toLocaleString() || '0', color: 'text-cyan', bg: 'bg-cyan/10 border-cyan/20', icon: LogIn },
          { label: 'Đang Ở Lại', value: stats?.currentlyPresent.toLocaleString() || '0', color: 'text-gold', bg: 'bg-gold/10 border-gold/20', icon: TrendingUp },
          { label: 'Đã Ra Về', value: stats?.checkedOut.toLocaleString() || '0', color: 'text-magenta', bg: 'bg-magenta/10 border-magenta/20', icon: LogOut },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className={`p-5 rounded-2xl border bg-white/5 backdrop-blur-md relative overflow-hidden group hover:scale-[1.02] transition-all shadow-xl ${s.bg}`}>
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <s.icon className={`w-16 h-16 ${s.color}`} />
            </div>
            <div className="text-admin-text-muted text-[10px] font-bold uppercase tracking-widest mb-2 font-mono">{s.label}</div>
            <div className={`text-2xl font-display font-black ${s.color}`}>{s.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* QR Scanner Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-6 rounded-[2rem] bg-admin-panel/80 backdrop-blur-md border border-admin-border/30 shadow-2xl overflow-hidden relative">
            <div className={`absolute top-0 left-0 w-full h-1 animate-pulse ${mode === 'IN' ? 'bg-cyan' : 'bg-magenta'}`} />
            
            <div className="flex items-center gap-3 mb-6">
              <div className={`p-3 rounded-2xl border transition-colors ${mode === 'IN' ? 'bg-cyan/10 border-cyan/20' : 'bg-magenta/10 border-magenta/20'}`}>
                <QrCode className={`w-6 h-6 ${mode === 'IN' ? 'text-cyan' : 'text-magenta'}`} />
              </div>
              <div>
                <h3 className="text-lg font-display font-black text-admin-text uppercase tracking-wider">
                  QUÉT {mode === 'IN' ? 'LỐI VÀO' : 'LỐI RA'}
                </h3>
                <p className="text-[10px] text-admin-text-muted tracking-widest font-bold uppercase mt-0.5">Sử dụng Camera thiết bị</p>
              </div>
            </div>

            {/* QR Scanner Container */}
            <div id="reader" className="w-full rounded-2xl overflow-hidden bg-admin-bg border border-admin-border/30 shadow-inner mb-6 min-h-[300px]">
              {/* html5-qrcode will render here */}
            </div>

            <form onSubmit={handleManualSubmit} className="space-y-3">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-admin-text-muted" />
                <input 
                  type="text" 
                  value={scanInput} 
                  onChange={e => setScanInput(e.target.value)}
                  placeholder="Hoặc nhập mã tay..."
                  className="w-full bg-admin-bg border border-admin-border/30 rounded-xl pl-12 pr-4 py-3 text-sm text-admin-text focus:outline-none focus:border-cyan transition-all" 
                />
              </div>
              <button 
                type="submit" 
                disabled={isProcessing}
                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all transform active:scale-95
                  ${mode === 'IN' 
                    ? 'bg-gradient-to-r from-cyan to-emerald text-midnight glow-cyan' 
                    : 'bg-gradient-to-r from-magenta to-purple text-white glow-magenta'
                  }`}
              >
                {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                XÁC NHẬN {mode === 'IN' ? 'VÀO' : 'RA'}
              </button>
            </form>
          </div>

          <AnimatePresence mode="wait">
            {lastScanResult && (
              <motion.div 
                key={lastScanResult.message}
                initial={{ opacity: 0, scale: 0.95, y: 10 }} 
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className={`p-6 rounded-[2rem] border-2 shadow-2xl relative overflow-hidden
                  ${lastScanResult.success 
                    ? 'bg-emerald/10 border-emerald/30 text-emerald' 
                    : 'bg-red-500/10 border-red-500/30 text-red-500'}`}
              >
                <div className="flex items-start gap-4">
                  {lastScanResult.success ? (
                    <div className="p-3 rounded-full bg-emerald/20 shadow-[0_0_20px_rgba(0,192,153,0.3)]">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                  ) : (
                    <div className="p-3 rounded-full bg-red-500/20">
                      <XCircle className="w-6 h-6" />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="text-xl font-display font-black uppercase tracking-tight mb-1">{lastScanResult.message}</div>
                    {lastScanResult.guest && (
                      <div className="space-y-1">
                        <div className="text-sm font-bold text-admin-text">{lastScanResult.guest}</div>
                        {lastScanResult.type && (
                          <div className={`text-[10px] font-black tracking-widest uppercase px-2 py-0.5 rounded border inline-block
                            ${lastScanResult.type === 'VIP' ? 'border-magenta text-magenta' : 'border-admin-border text-admin-text-muted'}`}>
                            Hạng vé: {lastScanResult.type}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Recent Checkins Feed */}
        <div className="lg:col-span-2 glass-card rounded-[2rem] bg-admin-panel/80 backdrop-blur-md border border-admin-border/30 overflow-hidden shadow-2xl flex flex-col h-[700px]">
          <div className="p-6 border-b border-admin-border/30 bg-admin-bg/5 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-display font-black text-admin-text uppercase tracking-wider">Log Hoạt Động Thời Gian Thực</h3>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse" />
                <p className="text-[10px] text-cyan font-bold uppercase tracking-widest">Live Updates Available</p>
              </div>
            </div>
            <button onClick={fetchData} className="p-2 rounded-xl bg-admin-bg/5 text-admin-text-muted hover:text-cyan transition-all">
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
          <div className="overflow-y-auto flex-1 custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 z-10 bg-admin-bg shadow-lg">
                <tr className="text-admin-text-muted text-[10px] uppercase tracking-widest">
                  <th className="p-4 font-black border-b border-admin-border/30 pl-8">Khách Hàng</th>
                  <th className="p-4 font-black border-b border-admin-border/30 hidden sm:table-cell">Hạng Vé</th>
                  <th className="p-4 font-black border-b border-admin-border/30 text-center">Trạng Thái</th>
                  <th className="p-4 font-black border-b border-admin-border/30 text-right pr-8">Thời Gian</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="p-20 text-center">
                      <Loader2 className="w-8 h-8 text-cyan animate-spin mx-auto mb-4" />
                      <p className="text-xs text-admin-text-muted uppercase tracking-widest font-bold">Đang nạp nhật ký...</p>
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-20 text-center text-admin-text-muted">
                      <p className="text-sm">Chưa có hoạt động nào được ghi nhận hôm nay.</p>
                    </td>
                  </tr>
                ) : (
                  logs.map((log, i) => {
                    const status = getLogStatus(log);
                    const StatusIcon = status.icon;
                    return (
                      <motion.tr 
                        key={`${log.id}-${log.updatedAt}`} 
                        initial={{ opacity: 0, x: 20 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        transition={{ delay: i * 0.05 }}
                        className="border-b border-admin-border/10 hover:bg-admin-bg/5 transition-colors group"
                      >
                        <td className="p-4 pl-8">
                          <div className="font-bold text-admin-text text-sm group-hover:text-cyan transition-colors">{log.guestName}</div>
                          <div className="text-[10px] text-admin-text-muted font-mono mt-0.5 tracking-tighter opacity-70">{log.bookingCode}</div>
                        </td>
                        <td className="p-4 hidden sm:table-cell">
                          <span className={`text-[10px] font-black tracking-widest px-2 py-0.5 rounded border 
                            ${log.type === 'VIP' ? 'border-magenta text-magenta bg-magenta/5' : 'border-admin-border text-admin-text-muted'}`}>
                            {log.type}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black border tracking-wider
                            ${status.style}`}>
                            <StatusIcon className="w-3.5 h-3.5" /> {status.label}
                          </span>
                        </td>
                        <td className="p-4 text-right pr-8 font-mono text-xs text-admin-text">
                          {status.time ? new Date(status.time).toLocaleTimeString('vi-VN', { hour12: false }) : '--:--:--'}
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <style jsx global>{`
        #reader {
          background-color: var(--midnight);
        }
        #reader video {
          object-fit: cover !important;
          width: 100% !important;
          height: 100% !important;
          border-radius: 1rem;
        }
        #reader__dashboard_section_csr button {
          background: var(--cyan) !important;
          color: var(--midnight) !important;
          border: none !important;
          padding: 8px 16px !important;
          border-radius: 8px !important;
          font-weight: bold !important;
          font-size: 11px !important;
          text-transform: uppercase !important;
          cursor: pointer !important;
          margin-top: 10px !important;
        }
        #reader img {
          display: none !important;
        }
      `}</style>
    </div>
  );
}
