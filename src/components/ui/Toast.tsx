'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, AlertCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

const toastConfig = {
  success: {
    icon: <CheckCircle2 className="w-5 h-5" />,
    bg: 'bg-[#00C099]/10',
    border: 'border-[#00C099]/30',
    text: 'text-[#00C099]',
    glow: 'shadow-[0_0_15px_rgba(0,192,153,0.2)]'
  },
  error: {
    icon: <XCircle className="w-5 h-5" />,
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    text: 'text-red-500',
    glow: 'shadow-[0_0_15px_rgba(239,68,68,0.2)]'
  },
  warning: {
    icon: <AlertCircle className="w-5 h-5" />,
    bg: 'bg-[#E6C753]/10',
    border: 'border-[#E6C753]/30',
    text: 'text-[#E6C753]',
    glow: 'shadow-[0_0_15px_rgba(230,199,83,0.2)]'
  },
  info: {
    icon: <AlertCircle className="w-5 h-5" />,
    bg: 'bg-[#00FFFF]/10',
    border: 'border-[#00FFFF]/30',
    text: 'text-[#00FFFF]',
    glow: 'shadow-[0_0_15px_rgba(0,255,255,0.2)]'
  }
};

export default function Toast({ message, type, isVisible, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose, duration]);

  const config = toastConfig[type];

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed top-24 right-6 z-[999] pointer-events-none">
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95, transition: { duration: 0.2 } }}
            className={`pointer-events-auto flex items-center gap-3 px-5 py-4 rounded-2xl backdrop-blur-xl border ${config.bg} ${config.border} ${config.glow} min-w-[300px] max-w-md shadow-2xl overflow-hidden relative`}
          >
            {/* Animated Progress Bar */}
            <motion.div 
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: duration / 1000, ease: "linear" }}
              className={`absolute bottom-0 left-0 right-0 h-1 origin-left ${config.text} opacity-30 bg-current`}
            />

            <div className={`${config.text} shrink-0`}>
              {config.icon}
            </div>
            <div className="flex-1 text-sm font-bold text-white tracking-wide">
              {message}
            </div>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
