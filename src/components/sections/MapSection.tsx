import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Sparkles } from 'lucide-react';

export default function MapSection({ settings }: { settings?: any }) {
  const title = settings?.mapTitle || "Địa Điểm Tổ Chức";
  const subtitle = settings?.mapSubtitle || "Khu Du Lịch Sinh Thái Thung Nham, Ninh Bình.";
  const address = settings?.mapAddress || "Thôn Hải Nham, Xã Ninh Hải, Huyện Hoa Lư, Tỉnh Ninh Bình";
  const description = settings?.mapDescription || "Sân khấu ngoài trời quy mô lớn, hòa mình vào thiên nhiên.";
  const googleMapsUrl = settings?.mapGoogleUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3736.6852504828133!2d105.914972575239!3d20.230485981226162!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313679633633d3c7%3A0x6336d3c73633d3c7!2sKhu%20du%20l%E1%BB%8Bch%20sinh%20th%C3%A1i%20Thung%20Nham!5e0!3m2!1svi!2s!4v1712470000000!5m2!1svi!2s";

  return (
    <section className="py-24 relative bg-midnight border-t border-royal/30" id="location">
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-20 items-center font-sans uppercase">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="w-full lg:w-[55%]">
            <h2 className="text-4xl font-display font-black uppercase tracking-wider mb-6">
              <span className="text-silver">{title.split(' ')[0]} </span>
              <span className="text-gradient block">{title.split(' ').slice(1).join(' ')}</span>
            </h2>
            <p className="text-gray-400 mb-8 text-lg leading-relaxed normal-case tracking-normal">{subtitle}</p>
            <div className="space-y-4">
              <div className="flex items-start gap-4 bg-royal/10 p-5 rounded-2xl border border-royal/30">
                <MapPin className="w-6 h-6 text-magenta shrink-0 mt-1" />
                <div>
                  <h4 className="text-silver font-bold mb-1">Địa chỉ</h4>
                  <p className="text-gray-400 text-sm normal-case tracking-normal opacity-80">{address}</p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-royal/10 p-5 rounded-2xl border border-royal/30">
                <Sparkles className="w-6 h-6 text-cyan shrink-0 mt-1" />
                <div>
                  <h4 className="text-silver font-bold mb-1">Không gian</h4>
                  <p className="text-gray-400 text-sm normal-case tracking-normal opacity-80">{description}</p>
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="w-full lg:w-[45%] relative rounded-3xl overflow-hidden border border-royal/50 aspect-square lg:h-[450px] bg-royal/5">
            <iframe
              src={googleMapsUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="opacity-100 transition-all duration-700"
            ></iframe>
            {/* Branded Marker Overlay - Pulsing and standing out */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none drop-shadow-[0_0_15px_rgba(255,0,128,0.5)]">
              <div className="w-16 h-16 bg-magenta/30 rounded-full animate-ping absolute"></div>
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center relative z-10 glow-magenta border-2 border-white shadow-2xl">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div className="mt-4 bg-midnight/90 backdrop-blur-md px-5 py-2.5 rounded-xl border border-cyan/40 text-cyan font-black tracking-[0.2em] whitespace-nowrap text-[10px] shadow-2xl uppercase italic">
                {settings?.mapSubtitle?.toUpperCase() || "ĐẠI HỌC CẦN THƠ"}
              </div>
            </div>
            {/* Soft Overlay to match theme */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-midnight/40 via-transparent to-transparent"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
