import type { Metadata } from "next";
import Link from "next/link";
import SurveyBackground from "@/components/survey/SurveyBackground";

export const metadata: Metadata = {
  title: "Khảo sát ý kiến | Neon Heritage Festival",
  description: "Chúng tôi trân trọng mọi ý kiến đóng góp của bạn để cải thiện chất lượng sự kiện.",
};

export default function SurveyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#020205] text-white flex flex-col font-inter relative overflow-hidden">
      <SurveyBackground />
      
      {/* Header with Logo */}
      <header className="relative z-50 w-full max-w-7xl mx-auto px-6 md:px-10 py-8 md:py-10">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
          <Link href="/" className="text-xl md:text-2xl font-display font-black uppercase tracking-widest group inline-block">
            <span className="text-gradient group-hover:glow-magenta transition-all duration-500">Neon</span>
            <span className="text-silver group-hover:text-white transition-all">Heritage</span>
          </Link>
          <div className="flex items-center self-start sm:self-auto gap-2 px-3 md:px-4 py-1 md:py-1.5 rounded-full bg-red-500/10 border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            <span className="text-[10px] md:text-[11px] font-bold text-red-500 uppercase tracking-widest leading-none">Live Experience</span>
          </div>
        </div>
      </header>
      
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-4">
        {children}
      </main>
    </div>
  );
}
