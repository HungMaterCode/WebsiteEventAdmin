'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { X, Clock, Music, Camera, Tv } from 'lucide-react';

export function VideoModal({ isOpen, onClose, videoUrl }: { isOpen: boolean, onClose: () => void, videoUrl?: string }) {
  if (!isOpen) return null;

  const getEmbedUrl = (url: string) => {
    if (!url) return "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1";
    try {
      const videoId = url.split('v=')[1]?.split('&')[0] || url.split('be/')[1]?.split('?')[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : url;
    } catch {
      return url;
    }
  };

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-midnight/95 backdrop-blur-2xl" />
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative w-full max-w-5xl aspect-video bg-black rounded-3xl overflow-hidden border border-royal/50 shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all"><X className="w-6 h-6" /></button>
        <iframe className="w-full h-full" src={getEmbedUrl(videoUrl as string)} title="Concert Teaser" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
      </motion.div>
    </div>
  );
}

export function ArtistDetailModal({ isOpen, onClose, artist }: { isOpen: boolean, onClose: () => void, artist: any }) {
  if (!isOpen || !artist) return null;
  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-midnight/95 backdrop-blur-xl" />
      <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} className="relative w-full max-w-5xl bg-gradient-to-br from-royal/20 to-midnight border border-royal/50 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] overflow-y-auto md:max-h-none md:overflow-visible">
        <div className="w-full md:w-2/5 aspect-[3/4] md:aspect-auto relative shrink-0">
          <img src={artist.image} alt={artist.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-gradient-to-t from-midnight via-transparent to-transparent"></div>
          <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8">
            <h3 className="text-3xl md:text-4xl font-display font-black text-silver uppercase tracking-wider mb-2">{artist.name}</h3>
            <span className="px-4 py-1.5 bg-cyan/20 border border-cyan/50 text-cyan text-[10px] md:text-xs font-bold uppercase tracking-widest rounded-full backdrop-blur-md">{artist.genre}</span>
          </div>
        </div>
        <div className="w-full md:w-3/5 p-6 md:p-12 flex flex-col">
          <button onClick={onClose} className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-all z-20"><X className="w-6 h-6" /></button>
          <div className="flex items-center gap-4 mb-6 md:mb-8">
            <div className="flex -space-x-2">
              {[1,2,3].map(i => (<div key={i} className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-midnight bg-royal/30 flex items-center justify-center overflow-hidden"><img src={`https://picsum.photos/seed/fan${i}/100/100`} alt="fan" className="w-full h-full object-cover" /></div>))}
            </div>
            <span className="text-xs md:text-sm text-gray-400 font-medium">1.2M+ người hâm mộ đang chờ đợi</span>
          </div>
          <div className="prose prose-invert max-w-none mb-8 md:mb-10">
            <p className="text-gray-300 text-base md:text-lg leading-relaxed">{artist.name} là một trong những nghệ sĩ hàng đầu trong dòng nhạc {artist.genre}. Sự xuất hiện tại Neon Heritage Festival hứa hẹn sẽ mang đến một đêm nhạc bùng nổ.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-8 md:mb-10">
            <div className="p-4 bg-royal/10 border border-royal/30 rounded-2xl flex items-center gap-4 sm:block"><div className="text-cyan mb-0 sm:mb-2"><Clock className="w-5 h-5" /></div><div><div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Thời gian diễn</div><div className="text-silver font-bold text-sm md:text-base">{artist.performanceTime || 'TBD'}</div></div></div>
            <div className="p-4 bg-royal/10 border border-royal/30 rounded-2xl flex items-center gap-4 sm:block"><div className="text-magenta mb-0 sm:mb-2"><Music className="w-5 h-5" /></div><div><div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Số lượng bài hát</div><div className="text-silver font-bold text-sm md:text-base">8 Tracks (Exclusive)</div></div></div>
          </div>
          <div className="mt-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-4 md:gap-6">
            <button className="flex-1 py-4 bg-gradient-primary rounded-xl font-bold uppercase tracking-widest text-white glow-magenta hover:scale-[1.02] transition-all text-xs md:text-sm">Nghe Teaser Ngay</button>
            <div className="flex gap-4 justify-center">
              <a href="#" className="w-12 h-12 rounded-xl bg-royal/20 flex items-center justify-center text-gray-400 hover:text-cyan transition-all border border-royal/30"><Camera className="w-5 h-5" /></a>
              <a href="#" className="w-12 h-12 rounded-xl bg-royal/20 flex items-center justify-center text-gray-400 hover:text-cyan transition-all border border-royal/30"><Tv className="w-5 h-5" /></a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function ProductDetailModal({ isOpen, onClose, product }: { isOpen: boolean, onClose: () => void, product: any }) {
  if (!isOpen || !product) return null;
  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={onClose} className="absolute inset-0 bg-midnight/95 backdrop-blur-xl" />
      <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} className="relative w-full max-w-4xl bg-gradient-to-br from-royal/20 to-midnight border border-royal/50 rounded-[2rem] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] overflow-y-auto">
        <div className="w-full md:w-1/2 aspect-square md:aspect-auto relative shrink-0">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          <div className="absolute top-4 left-4 md:top-6 md:left-6"><span className="px-4 py-1.5 bg-magenta text-white text-[10px] font-bold uppercase tracking-widest rounded-full glow-magenta">{product.category || product.tag}</span></div>
        </div>
        <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col justify-center">
          <button onClick={onClose} className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-all z-20"><X className="w-6 h-6" /></button>
          <h3 className="text-2xl md:text-3xl font-display font-black text-silver uppercase tracking-wider mb-4">{product.name}</h3>
          <p className="text-gray-400 text-base md:text-lg leading-relaxed mb-6">{product.description || product.desc} Sản phẩm độc quyền cho Neon Heritage Festival 2024.</p>
          <button className="py-4 bg-gradient-primary rounded-xl font-bold uppercase tracking-widest text-white glow-magenta hover:scale-[1.02] transition-all flex items-center justify-center gap-3 text-xs md:text-sm">Đặt mua ngay</button>
        </div>
      </motion.div>
    </div>
  );
}
