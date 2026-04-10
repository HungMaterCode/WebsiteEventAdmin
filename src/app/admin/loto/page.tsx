'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, Shuffle, Trophy, Users, Zap, RefreshCw, Play, X } from 'lucide-react';

const mockPlayers = [
  { id: 1, name: 'Nguyễn Văn A', ticket: 'TKT-827391', card: [3, 15, 28, 42, 61], matched: [3, 42] },
  { id: 2, name: 'Trần Thị B', ticket: 'TKT-827392', card: [7, 19, 33, 50, 72], matched: [19] },
  { id: 3, name: 'Lê Văn C', ticket: 'TKT-827393', card: [1, 22, 38, 55, 68], matched: [22, 38, 55] },
  { id: 4, name: 'Hoàng Minh D', ticket: 'TKT-827394', card: [9, 25, 40, 58, 75], matched: [] },
];

const drawnNumbers = [3, 42, 19, 22, 38, 55, 7];

export default function AdminLotoPage() {
  const [isSpinning, setIsSpinning] = React.useState(false);
  const [currentDraw, setCurrentDraw] = React.useState<number | null>(null);
  const [showWinner, setShowWinner] = React.useState(false);

  const handleDraw = () => {
    setIsSpinning(true);
    let count = 0;
    const interval = setInterval(() => {
      setCurrentDraw(Math.floor(Math.random() * 75) + 1);
      count++;
      if (count > 15) {
        clearInterval(interval);
        setCurrentDraw(drawnNumbers[drawnNumbers.length - 1]);
        setIsSpinning(false);
      }
    }, 80);
  };

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-black uppercase text-admin-text">Trò Chơi Loto</h2>
          <p className="text-admin-text-muted text-sm mt-1">Điều phối sự kiện rút thăm ngẫu nhiên, trao thưởng và quản lý người chơi</p>
        </div>
        <button onClick={() => setShowWinner(true)}
          className="px-6 py-3 bg-gold hover:bg-gold/80 text-midnight font-bold rounded-xl flex items-center gap-2 transition-all glow-gold">
          <Trophy className="w-5 h-5" /> Công Bố Trúng Thưởng
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Người Chơi', value: '248', icon: Users, color: 'text-cyan', bg: 'bg-cyan/10 border-cyan/20' },
          { label: 'Số Đã Rút', value: drawnNumbers.length.toString(), icon: Shuffle, color: 'text-magenta', bg: 'bg-magenta/10 border-magenta/20' },
          { label: 'Số Còn Lại', value: (75 - drawnNumbers.length).toString(), icon: Zap, color: 'text-gold', bg: 'bg-gold/10 border-gold/20' },
          { label: 'Người Thắng', value: '0', icon: Trophy, color: 'text-emerald', bg: 'bg-emerald/10 border-emerald/20' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className={`p-5 rounded-2xl border bg-white/5 backdrop-blur-md relative overflow-hidden group hover:scale-[1.02] transition-all ${s.bg}`}>
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <s.icon className={`w-16 h-16 ${s.color}`} />
            </div>
            <div className="text-admin-text-muted text-[10px] font-bold uppercase tracking-widest mb-2">{s.label}</div>
            <div className={`text-2xl font-display font-black ${s.color}`}>{s.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Draw Machine */}
        <div className="glass-card p-8 rounded-[2rem] bg-admin-panel/80 backdrop-blur-md border border-admin-border shadow-2xl flex flex-col items-center gap-6">
          <h3 className="text-lg font-display font-black text-admin-text uppercase tracking-wider text-center">Máy Quay Số</h3>

          {/* Number Display */}
          <div className="w-40 h-40 rounded-full border-4 border-gold bg-admin-bg flex items-center justify-center relative shadow-[0_0_40px_rgba(var(--gold-rgb),0.3)]">
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,_rgba(var(--gold-rgb),0.1)_0%,_transparent_70%)]" />
            <AnimatePresence mode="wait">
              <motion.span key={currentDraw} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.5, opacity: 0 }}
                className="font-display font-black text-5xl text-gold glow-gold">
                {currentDraw ?? '?'}
              </motion.span>
            </AnimatePresence>
          </div>

          <div className="flex gap-3 w-full">
            <button onClick={handleDraw} disabled={isSpinning}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-gold to-magenta text-midnight font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:cursor-not-allowed">
              {isSpinning ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
              {isSpinning ? 'Đang quay...' : 'Rút Số'}
            </button>
          </div>

          {/* Drawn Numbers */}
          <div className="w-full">
            <div className="text-[10px] font-bold text-admin-text-muted uppercase tracking-widest mb-3 text-center">Các Số Đã Rút</div>
            <div className="flex flex-wrap gap-2 justify-center">
              {drawnNumbers.map(n => (
                <motion.div key={n} initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className="w-9 h-9 rounded-full bg-magenta/20 border border-magenta/50 flex items-center justify-center text-magenta font-bold text-sm glow-magenta">
                  {n}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Player Cards */}
        <div className="lg:col-span-2 glass-card rounded-[2rem] bg-admin-panel/80 backdrop-blur-md border border-admin-border overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-admin-border bg-[#4F1F76]/5">
            <h3 className="text-lg font-display font-black text-admin-text uppercase tracking-wider">Thẻ Loto Người Chơi</h3>
            <p className="text-[10px] text-admin-text-muted font-bold uppercase tracking-widest mt-0.5">Số được tô màu = đã trúng</p>
          </div>
          <div className="p-6 space-y-4 overflow-y-auto max-h-[500px] custom-scrollbar">
            {mockPlayers.map((player, i) => (
              <motion.div key={player.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-bold text-admin-text">{player.name}</div>
                    <div className="text-xs text-admin-text-muted font-mono mt-0.5">{player.ticket}</div>
                  </div>
                  <div className="text-[10px] font-bold text-cyan bg-cyan/10 border border-cyan/20 px-2.5 py-1 rounded-full uppercase tracking-widest">
                    {player.matched.length}/{player.card.length} Số
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {player.card.map(n => (
                    <div key={n}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-display font-black text-sm transition-all ${
                        player.matched.includes(n)
                          ? 'bg-gold text-midnight shadow-[0_0_12px_rgba(var(--gold-rgb),0.5)]'
                          : 'bg-admin-bg/5 border border-admin-border/10 text-admin-text-muted'
                      }`}>
                      {n}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Winner Modal */}
      <AnimatePresence>
        {showWinner && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowWinner(false)} className="absolute inset-0 bg-admin-bg/95 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}
              className="relative w-full max-w-md bg-admin-panel border-2 border-gold/60 rounded-[2rem] shadow-[0_0_60px_rgba(var(--gold-rgb),0.3)] overflow-hidden text-center p-10">
              <button onClick={() => setShowWinner(false)} className="absolute top-4 right-4 text-admin-text-muted hover:text-admin-text"><X className="w-6 h-6" /></button>
              <div className="text-6xl mb-4">🏆</div>
              <h2 className="text-3xl font-display font-black text-gold glow-gold uppercase tracking-wider mb-2">Chúc Mừng!</h2>
              <h3 className="text-xl font-bold text-admin-text mb-4">Lê Văn C</h3>
              <p className="text-admin-text-muted text-sm">Hoàn thành hàng ngang đầu tiên với <span className="text-gold font-bold">3 số khớp liên tiếp</span>.</p>
              <div className="flex justify-center gap-2 mt-6">
                {[22, 38, 55].map(n => (
                  <div key={n} className="w-12 h-12 rounded-full bg-gold text-midnight font-display font-black text-lg flex items-center justify-center glow-gold">
                    {n}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
