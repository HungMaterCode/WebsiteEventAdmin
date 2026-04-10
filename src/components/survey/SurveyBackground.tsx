"use client";

import React from "react";

export default function SurveyBackground() {
  return (
    <>
      <div className="fixed inset-0 pointer-events-none">
        {/* Main Background Gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(79,31,118,0.15)_0%,_transparent_70%)]"></div>
        
        {/* Animated Orbs */}
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-magenta/20 blur-[120px] rounded-full animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-cyan/15 blur-[150px] rounded-full animate-pulse-slower"></div>
        <div className="absolute top-[20%] left-[10%] w-[300px] h-[300px] bg-royal/10 blur-[100px] rounded-full animate-float"></div>
        
        {/* Neon Sparks/Particles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="spark-1 absolute w-1 h-1 bg-cyan rounded-full animate-float-spark opacity-50"></div>
          <div className="spark-2 absolute w-1.5 h-1.5 bg-magenta rounded-full animate-float-spark-delayed opacity-40"></div>
          <div className="spark-3 absolute w-0.5 h-0.5 bg-white rounded-full animate-float-spark opacity-30"></div>
          <div className="spark-4"></div>
          <div className="absolute top-[15%] left-[85%] w-1 h-1 bg-magenta rounded-full animate-pulse blur-[1px]"></div>
          <div className="absolute top-[75%] left-[15%] w-1.5 h-1.5 bg-cyan rounded-full animate-pulse blur-[1px]"></div>
        </div>

        {/* Neon Grid with better visibility */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
      </div>

      <style jsx global>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }
        @keyframes pulse-slower {
          0%, 100% { opacity: 0.3; transform: scale(1.2); }
          50% { opacity: 0.6; transform: scale(1); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0) rotate(0deg); }
          33% { transform: translateY(-20px) translateX(10px) rotate(10deg); }
          66% { transform: translateY(10px) translateX(-15px) rotate(-5deg); }
        }
        @keyframes float-spark {
          0%, 100% { transform: translateY(0) translateX(0) scale(1); opacity: 0.3; }
          50% { transform: translateY(-100px) translateX(50px) scale(2); opacity: 0.8; }
        }
        @keyframes float-spark-delayed {
          0%, 100% { transform: translateY(0) translateX(0) scale(2); opacity: 0.6; }
          50% { transform: translateY(-150px) translateX(-30px) scale(0.5); opacity: 0.2; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 8s infinite ease-in-out;
        }
        .animate-pulse-slower {
          animation: pulse-slower 12s infinite ease-in-out;
        }
        .animate-float {
          animation: float 15s infinite ease-in-out;
        }
        .animate-float-spark {
          animation: float-spark 20s infinite linear;
        }
        .animate-float-spark-delayed {
          animation: float-spark-delayed 25s infinite linear;
        }
        .spark-1 { top: 10%; left: 20%; animation-delay: 0s; }
        .spark-2 { top: 60%; left: 80%; animation-delay: -5s; }
        .spark-3 { top: 40%; left: 10%; animation-delay: -12s; }
        .spark-4 { top: 80%; left: 30%; width: 2px; height: 2px; background: #00FFFF; position: absolute; border-radius: 50%; animation: float-spark 18s infinite linear -7s; }
      `}</style>
    </>
  );
}
