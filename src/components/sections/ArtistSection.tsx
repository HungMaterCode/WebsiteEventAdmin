'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Music } from 'lucide-react';

export default function ArtistSection({ artists, onOpenArtist }: { artists: any[], onOpenArtist: (artist: any) => void }) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section className="py-24 relative bg-midnight" id="lineup">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-black uppercase tracking-wider mb-4">
            <span className="text-silver">Dàn Nghệ Sĩ </span>
            <span className="text-gradient">Tham Gia</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-magenta to-cyan mx-auto rounded-full glow-magenta"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {artists.map((artist: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onOpenArtist(artist)}
              className="group relative rounded-2xl overflow-hidden bg-royal/20 border border-royal/50 hover:border-glow-cyan transition-all duration-500 cursor-pointer"
            >
              <div className="aspect-[3/4] overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/50 to-transparent z-10 opacity-80 group-hover:opacity-60 transition-opacity duration-300"></div>
                <img src={artist.image} alt={artist.name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                <div className="absolute bottom-0 left-0 w-full p-6 z-20 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-2xl font-display font-bold text-silver mb-1 uppercase tracking-wide">{artist.name}</h3>
                  <p className="text-teal font-medium tracking-wider flex items-center gap-2">
                    <Music className="w-4 h-4" />
                    {artist.genre}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
