'use client';

import React from 'react';
import { LinkIcon, Check } from 'lucide-react';

export default function ShareButtons({ postUrl, postTitle }: { postUrl: string, postTitle: string }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(postUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex gap-4">
      <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full border border-[#4F1F76]/50 flex items-center justify-center text-[#8A8F98] hover:text-[#FFFFFF] hover:bg-[#3b5998] hover:border-[#3b5998] transition-all">
        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
      </a>
      <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(postTitle)}`} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full border border-[#4F1F76]/50 flex items-center justify-center text-[#8A8F98] hover:text-[#FFFFFF] hover:bg-[#1DA1F2] hover:border-[#1DA1F2] transition-all">
        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
      </a>
      <button onClick={handleCopy} className={`w-12 h-12 rounded-full border border-[#4F1F76]/50 flex items-center justify-center transition-all ${copied ? 'text-midnight bg-cyan border-cyan glow-cyan' : 'text-[#8A8F98] hover:text-[#FFFFFF] hover:bg-[#0D0716]'}`} title="Copy Link">
        {copied ? <Check className="w-5 h-5" /> : <LinkIcon className="w-5 h-5" />}
      </button>
    </div>
  );
}
