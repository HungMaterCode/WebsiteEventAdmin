'use client';

import React from 'react';

export default function CountdownTimer({ targetDate }: { targetDate?: string | Date }) {
  const [timeLeft, setTimeLeft] = React.useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  React.useEffect(() => {
    const finalTargetDate = targetDate ? new Date(targetDate).getTime() : new Date('2024-12-31T20:00:00').getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = finalTargetDate - now;
      if (distance < 0) { 
        clearInterval(interval); 
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return; 
      }
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="flex gap-4 md:gap-8 justify-center mt-8">
      {[
        { label: 'Ngày', value: timeLeft.days },
        { label: 'Giờ', value: timeLeft.hours },
        { label: 'Phút', value: timeLeft.minutes },
        { label: 'Giây', value: timeLeft.seconds },
      ].map((item, i) => (
        <div key={i} className="flex flex-col items-center">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-royal/20 border border-cyan/30 rounded-xl flex items-center justify-center backdrop-blur-md glow-cyan">
            <span className="text-2xl md:text-3xl font-display font-black text-silver">{String(item.value).padStart(2, '0')}</span>
          </div>
          <span className="text-[10px] md:text-xs uppercase tracking-widest text-teal mt-2 font-bold">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
