'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Hammer, Clock, Globe, ShieldCheck } from 'lucide-react';

export default function MaintenancePage() {
  const [settings, setSettings] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('/api/settings/system');
        const data = await res.json();
        setSettings(data);
        
        if (data.maintenanceEnd) {
          const end = new Date(data.maintenanceEnd).getTime();
          const timer = setInterval(() => {
            const now = new Date().getTime();
            const diff = end - now;
            
            if (diff <= 0) {
              setTimeLeft('Sắp hoàn thành...');
              clearInterval(timer);
            } else {
              const h = Math.floor(diff / (1000 * 60 * 60));
              const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
              const s = Math.floor((diff % (1000 * 60)) / 1000);
              setTimeLeft(`${h}h ${m}m ${s}s`);
            }
          }, 1000);
          return () => clearInterval(timer);
        }
      } catch (e) {
        console.error(e);
      }
    }
    fetchSettings();
  }, []);

  return (
    <div className="min-h-screen bg-[#060010] text-[#E0E0E0] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-magenta/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan/10 rounded-full blur-[120px]"></div>
      
      {/* Maintenance Icon with Animation */}
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative mb-12"
      >
        <div className="absolute inset-0 bg-cyan blur-3xl opacity-20 animate-pulse"></div>
        <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-[#00FFFF]/20 to-transparent border border-[#00FFFF]/30 flex items-center justify-center relative z-10 backdrop-blur-xl">
          <Hammer className="w-16 h-16 text-[#00FFFF] glow-cyan" />
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-2xl w-full text-center space-y-6 relative z-10">
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-4xl md:text-6xl font-black uppercase tracking-widest font-display"
        >
          Hệ Thống <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] glow-text">Đang Bảo Trì</span>
        </motion.h1>

        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-lg text-gray-400 font-medium"
        >
          {settings?.maintenanceMessage || "Chúng tôi đang nâng cấp hệ thống để mang lại trải nghiệm tốt nhất cho bạn. Vui lòng quay lại sau ít phút."}
        </motion.p>

        {/* Countdown / Stats */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12"
        >
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col items-center">
            <Clock className="w-6 h-6 text-[#FF00FF] mb-2" />
            <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Thời gian còn lại</div>
            <div className="text-2xl font-bold text-[#FF00FF] font-mono">{timeLeft || '--h --m --s'}</div>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col items-center">
            <Globe className="w-6 h-6 text-[#00FFFF] mb-2" />
            <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Trạng thái</div>
            <div className="text-2xl font-bold text-[#00FFFF] font-mono tracking-wider uppercase">UPDATING</div>
          </div>
        </motion.div>
      </div>

      {/* Footer Info */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-0 right-0 text-center"
      >
        <div className="flex items-center justify-center gap-2 text-xs font-bold tracking-widest text-gray-500 uppercase">
          <ShieldCheck className="w-4 h-4" />
          <span>Neon Heritage Security & Management System</span>
        </div>
      </motion.div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&display=swap');
        
        :root {
          --cyan: #00FFFF;
          --magenta: #FF00FF;
        }
        
        .font-display {
          font-family: 'Outfit', sans-serif;
        }
        
        .glow-cyan {
          filter: drop-shadow(0 0 10px rgba(0, 255, 255, 0.8));
        }
        
        .glow-text {
          filter: drop-shadow(0 0 20px rgba(0, 255, 255, 0.4));
        }
      `}</style>
    </div>
  );
}
