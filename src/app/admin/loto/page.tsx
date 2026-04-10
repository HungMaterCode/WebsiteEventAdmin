'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, Shuffle, Trophy, Users, Zap, RefreshCw, Play, X, RotateCcw, UserPlus } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminLotoPage() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentDraw, setCurrentDraw] = useState<number | null>(null);
  const [showWinner, setShowWinner] = useState(false);
  const [winner, setWinner] = useState<any>(null);
  
  const [players, setPlayers] = useState<any[]>([]);
  const [drawnNumbers, setDrawnNumbers] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/loto');
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      setPlayers(data.players || []);
      setDrawnNumbers(data.drawnNumbers || []);
      if (data.drawnNumbers?.length > 0) {
        setCurrentDraw(data.drawnNumbers[data.drawnNumbers.length - 1]);
      }
    } catch (err: any) {
      toast.error('Lỗi tải dữ liệu loto: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDraw = async () => {
    setIsSpinning(true);
    try {
      const res = await fetch('/api/admin/loto', { method: 'POST' });
      const data = await res.json();
      
      if (data.error) throw new Error(data.error);

      // Animation logic
      let count = 0;
      const interval = setInterval(() => {
        setCurrentDraw(Math.floor(Math.random() * 75) + 1);
        count++;
        if (count > 20) {
          clearInterval(interval);
          setCurrentDraw(data.newNumber);
          setDrawnNumbers(data.drawnNumbers);
          setIsSpinning(false);
          // Refresh players to update matched status
          fetchData();
        }
      }, 70);

    } catch (err: any) {
      toast.error(err.message);
      setIsSpinning(false);
    }
  };

  const handleReset = async () => {
    if (!confirm('Bạn có chắc muốn reset toàn bộ số đã rút?')) return;
    try {
      const res = await fetch('/api/admin/loto', { method: 'DELETE' });
      if (res.ok) {
        setDrawnNumbers([]);
        setCurrentDraw(null);
        toast.success('Đã reset game');
        fetchData();
      }
    } catch (err: any) {
      toast.error('Lỗi reset: ' + err.message);
    }
  };

  const handleAssignNumbers = async () => {
    setAssigning(true);
    try {
      const res = await fetch('/api/admin/loto/assign', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        toast.success(`Đã cấp số cho ${data.count} người chơi mới`);
        fetchData();
      }
    } catch (err: any) {
      toast.error('Lỗi cấp số: ' + err.message);
    } finally {
      setAssigning(false);
    }
  };

  const checkWinner = (p: any) => {
    setWinner(p);
    setShowWinner(true);
  };

  const winners = players.filter(p => p.matched.length === p.card.length && p.card.length > 0);

  if (loading) return <div className="flex items-center justify-center h-screen text-admin-text-muted animate-pulse font-display font-bold uppercase tracking-widest">Đang tải hệ thống Loto...</div>;

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-black uppercase text-admin-text">Trò Chơi Loto</h2>
          <p className="text-admin-text-muted text-sm mt-1">Điều phối sự kiện rút thăm ngẫu nhiên, trao thưởng và quản lý người chơi</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleAssignNumbers} disabled={assigning}
            className="px-4 py-3 bg-cyan/10 hover:bg-cyan/20 text-cyan font-bold rounded-xl flex items-center gap-2 border border-cyan/30 transition-all">
            {assigning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />} Cấp số người chơi
          </button>
          <button onClick={handleReset}
            className="px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold rounded-xl flex items-center gap-2 border border-red-500/30 transition-all">
            <RotateCcw className="w-4 h-4" /> Reset Game
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Người Chơi', value: players.length.toString(), icon: Users, color: 'text-cyan', bg: 'bg-cyan/10 border-cyan/20' },
          { label: 'Số Đã Rút', value: drawnNumbers.length.toString(), icon: Shuffle, color: 'text-magenta', bg: 'bg-magenta/10 border-magenta/20' },
          { label: 'Số Còn Lại', value: (75 - drawnNumbers.length).toString(), icon: Zap, color: 'text-gold', bg: 'bg-gold/10 border-gold/20' },
          { label: 'Người Thắng', value: winners.length.toString(), icon: Trophy, color: 'text-emerald', bg: 'bg-emerald/10 border-emerald/20' },
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
          <div className="w-40 h-40 rounded-full border-4 border-gold bg-admin-bg flex items-center justify-center relative shadow-[0_0_40px_rgba(230,199,83,0.3)]">
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,_rgba(230,199,83,0.1)_0%,_transparent_70%)]" />
            <AnimatePresence mode="wait">
              <motion.span key={currentDraw} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.5, opacity: 0 }}
                className="font-display font-black text-5xl text-gold glow-gold">
                {currentDraw ?? '?'}
              </motion.span>
            </AnimatePresence>
          </div>

          <div className="flex gap-3 w-full">
            <button onClick={handleDraw} disabled={isSpinning || drawnNumbers.length >= 75}
              className="flex-1 py-4 rounded-xl bg-gradient-to-r from-gold to-magenta text-midnight font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_5px_15px_rgba(230,199,83,0.3)]">
              {isSpinning ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
              {isSpinning ? 'Đang quay...' : 'Rút Số'}
            </button>
          </div>

          {/* Drawn Numbers */}
          <div className="w-full">
            <div className="text-[10px] font-bold text-admin-text-muted uppercase tracking-widest mb-3 text-center">Các Số Đã Rút</div>
            <div className="flex flex-wrap gap-2 justify-center max-h-40 overflow-y-auto p-2 custom-scrollbar">
              {drawnNumbers.map(n => (
                <motion.div key={n} initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className="w-9 h-9 rounded-full bg-magenta/20 border border-magenta/50 flex items-center justify-center text-magenta font-bold text-sm glow-magenta">
                  {n}
                </motion.div>
              ))}
              {drawnNumbers.length === 0 && <div className="text-xs italic text-admin-text-muted/50">Chưa rút số nào</div>}
            </div>
          </div>
        </div>

        {/* Player Cards */}
        <div className="lg:col-span-2 glass-card rounded-[2rem] bg-admin-panel/80 backdrop-blur-md border border-admin-border overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-admin-border bg-white/5 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-display font-black text-admin-text uppercase tracking-wider">Thẻ Loto Người Chơi</h3>
              <p className="text-[10px] text-admin-text-muted font-bold uppercase tracking-widest mt-0.5">Số được tô màu = đã trúng</p>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-admin-text-muted font-bold uppercase">Tổng số vé</div>
              <div className="text-xl font-display font-black text-cyan">{players.length}</div>
            </div>
          </div>
          <div className="p-6 space-y-4 overflow-y-auto h-[500px] custom-scrollbar">
            {players.length === 0 && (
              <div className="text-center py-20">
                <Users className="w-12 h-12 text-admin-text-muted/20 mx-auto mb-4" />
                <p className="text-admin-text-muted italic">Chưa có người chơi nào tham gia.</p>
                <button onClick={handleAssignNumbers} className="mt-4 text-cyan font-bold hover:underline">Hãy cấp số cho các vé đã mua</button>
              </div>
            )}
            {players.map((player, i) => {
              const isWinner = player.matched.length === player.card.length && player.card.length > 0;
              return (
                <motion.div key={player.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: Math.min(i * 0.05, 1) }}
                  className={`p-5 rounded-2xl border transition-all ${isWinner ? 'bg-gold/10 border-gold/30' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="font-bold text-admin-text">{player.name}</div>
                        <div className="text-xs text-admin-text-muted font-mono mt-0.5">{player.ticket}</div>
                      </div>
                      {isWinner && (
                        <button onClick={() => checkWinner(player)} className="p-1.5 rounded-lg bg-gold text-midnight hover:scale-110 transition-transform">
                          <Trophy className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest border ${
                      isWinner ? 'text-gold bg-gold/10 border-gold/20' : 'text-cyan bg-cyan/10 border-cyan/20'
                    }`}>
                      {player.matched.length}/{player.card.length} Số
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {player.card.map((n: number) => (
                      <div key={n}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-display font-black text-sm transition-all ${
                          player.matched.includes(n)
                            ? 'bg-gold text-midnight shadow-[0_0_12px_rgba(230,199,83,0.5)]'
                            : 'bg-admin-bg/5 border border-admin-border/10 text-admin-text-muted'
                        }`}>
                        {n}
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Winner Modal */}
      <AnimatePresence>
        {showWinner && winner && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowWinner(false)} className="absolute inset-0 bg-admin-bg/95 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}
              className="relative w-full max-w-md bg-admin-panel border-2 border-gold/60 rounded-[2rem] shadow-[0_0_60px_rgba(230,199,83,0.3)] overflow-hidden text-center p-10">
              <button onClick={() => setShowWinner(false)} className="absolute top-4 right-4 text-admin-text-muted hover:text-admin-text"><X className="w-6 h-6" /></button>
              <div className="text-6xl mb-4">🏆</div>
              <h2 className="text-3xl font-display font-black text-gold glow-gold uppercase tracking-wider mb-2">Chúc Mừng!</h2>
              <h3 className="text-xl font-bold text-admin-text mb-4">{winner.name}</h3>
              <p className="text-admin-text-muted text-sm">Đã trúng toàn bộ <span className="text-gold font-bold">{winner.card.length} số</span> trên thẻ Loto!</p>
              <div className="flex justify-center flex-wrap gap-2 mt-6">
                {winner.card.map((n: number) => (
                  <div key={n} className="w-12 h-12 rounded-full bg-gold text-midnight font-display font-black text-lg flex items-center justify-center glow-gold">
                    {n}
                  </div>
                ))}
              </div>
              <button 
                onClick={() => setShowWinner(false)}
                className="mt-8 w-full py-3 bg-gold/10 text-gold border border-gold/30 rounded-xl font-bold hover:bg-gold/20 transition-all uppercase tracking-widest text-xs"
              >
                Tiếp tục quay số
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
