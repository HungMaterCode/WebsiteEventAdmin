'use client';
import React from 'react';
import { motion } from 'motion/react';

export default function CinematicExperience({ onOpenVideo, settings }: { onOpenVideo: () => void, settings?: any }) {
  const title = settings?.videoTitle || "The Cinematic Teaser";
  const subtitle = settings?.videoSubtitle || "Chạm để trải nghiệm không gian 3D Mapping";
  const videoUrl = settings?.videoUrl || "";

  // Hàm lấy Thumbnail từ Video URL
  const getThumbnailUrl = (url: string) => {
    if (!url) return "https://picsum.photos/seed/concert-wide/1920/1080";
    try {
      const videoId = url.split('v=')[1]?.split('&')[0] || url.split('be/')[1]?.split('?')[0];
      return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : "https://picsum.photos/seed/concert-wide/1920/1080";
    } catch {
      return "https://picsum.photos/seed/concert-wide/1920/1080";
    }
  };

  const thumbnailUrl = getThumbnailUrl(videoUrl);

  return (
    <section className="py-24 relative bg-midnight overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          whileInView={{ opacity: 1, scale: 1 }} 
          viewport={{ once: true }} 
          onClick={onOpenVideo} 
          className="relative aspect-video rounded-[2.5rem] overflow-hidden border border-royal/50 shadow-[0_0_50px_rgba(79,31,118,0.3)] group cursor-pointer"
        >
          <img 
            src={thumbnailUrl} 
            alt="Cinematic Teaser" 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
            referrerPolicy="no-referrer" 
            onError={(e) => {
              // Fallback nếu maxresdefault không tồn tại (một số video cũ)
              const target = e.target as HTMLImageElement;
              if (target.src.includes('maxresdefault')) {
                target.src = target.src.replace('maxresdefault', 'hqdefault');
              }
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-midnight via-transparent to-midnight/40 flex items-center justify-center">
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-magenta/20 backdrop-blur-md border border-magenta/50 flex items-center justify-center glow-magenta">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-magenta flex items-center justify-center text-white pl-2">
                <svg viewBox="0 0 24 24" className="w-8 h-8 md:w-10 md:h-10 fill-current"><path d="M8 5v14l11-7z" /></svg>
              </div>
            </motion.div>
          </div>
          <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 text-left">
            <h3 className="text-2xl md:text-4xl font-display font-black uppercase tracking-widest text-silver mb-2 text-glow-cyan italic leading-none">{title}</h3>
            <p className="text-cyan font-bold tracking-widest uppercase text-sm md:text-base">{subtitle}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
