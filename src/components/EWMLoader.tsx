import React from 'react';
import { ShieldCheck, Sparkles, Lock } from 'lucide-react';

export const EWMLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md transition-opacity duration-500 p-4">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#00A86B]/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#0F2C59]/30 rounded-full blur-2xl pointer-events-none" />

      {/* Centered Modal Card */}
      <div className="relative w-full max-w-md bg-slate-900/80 border border-slate-800/80 shadow-2xl rounded-3xl p-8 backdrop-blur-xl flex flex-col items-center text-center transform transition-all animate-in fade-in zoom-in duration-300">
        
        {/* Top Decorative Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00A86B]/10 border border-[#00A86B]/30 text-[#00A86B] text-xs font-semibold tracking-wide mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>EWmart Official Campus Gateway</span>
        </div>

        {/* Mascot Container with Floating Animation */}
        <div className="relative mb-6 group cursor-pointer">
          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-[#00A86B]/30 to-transparent blur-xl animate-pulse-glow" />
          <div className="relative w-36 h-36 flex items-center justify-center bg-slate-800/60 border border-slate-700/50 rounded-full shadow-inner animate-float p-3">
            
            {/* CUTE MASCOT SVG: EWU Owl with Graduation Cap */}
            <svg
              viewBox="0 0 200 200"
              className="w-full h-full drop-shadow-lg"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Owl Body Shadow */}
              <ellipse cx="100" cy="180" rx="45" ry="10" fill="#020617" opacity="0.4" />
              
              {/* Outer Body / Head */}
              <path
                d="M 60 70 C 60 40, 140 40, 140 70 C 150 110, 145 165, 100 165 C 55 165, 50 110, 60 70 Z"
                fill="#0F2C59"
                stroke="#1E40AF"
                strokeWidth="3"
              />
              
              {/* Belly / Chest area */}
              <ellipse cx="100" cy="120" rx="30" ry="32" fill="#F8FAFC" />
              {/* Feather detail on belly */}
              <path d="M 88 105 Q 100 112 112 105" stroke="#00A86B" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 85 118 Q 100 126 115 118" stroke="#00A86B" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 90 131 Q 100 138 110 131" stroke="#00A86B" strokeWidth="2.5" strokeLinecap="round" />

              {/* Little Wings */}
              <path d="M 55 85 C 40 100, 45 135, 60 130 C 62 115, 60 95, 55 85 Z" fill="#1E3A8A" />
              <path d="M 145 85 C 160 100, 155 135, 140 130 C 138 115, 140 95, 145 85 Z" fill="#1E3A8A" />

              {/* Feet / Talons */}
              <ellipse cx="85" cy="164" rx="8" ry="4" fill="#F59E0B" />
              <ellipse cx="115" cy="164" rx="8" ry="4" fill="#F59E0B" />

              {/* Big Cute Eyes (Left & Right background rings) */}
              <circle cx="80" cy="80" r="20" fill="#FFFFFF" stroke="#0F2C59" strokeWidth="2" />
              <circle cx="120" cy="80" r="20" fill="#FFFFFF" stroke="#0F2C59" strokeWidth="2" />
              
              {/* Iris */}
              <circle cx="82" cy="80" r="11" fill="#00A86B" />
              <circle cx="118" cy="80" r="11" fill="#00A86B" />
              
              {/* Pupils */}
              <circle cx="83" cy="80" r="6" fill="#090D16" />
              <circle cx="117" cy="80" r="6" fill="#090D16" />
              
              {/* Eye Catchlights (sparkles) */}
              <circle cx="80" cy="77" r="3" fill="#FFFFFF" />
              <circle cx="85" cy="82" r="1.5" fill="#FFFFFF" />
              <circle cx="114" cy="77" r="3" fill="#FFFFFF" />
              <circle cx="119" cy="82" r="1.5" fill="#FFFFFF" />

              {/* Cute Pink Cheeks */}
              <ellipse cx="66" cy="94" rx="5" ry="3" fill="#F472B6" opacity="0.6" />
              <ellipse cx="134" cy="94" rx="5" ry="3" fill="#F472B6" opacity="0.6" />

              {/* Beak */}
              <polygon points="94,88 106,88 100,100" fill="#F59E0B" stroke="#D97706" strokeWidth="1" />

              {/* GRADUATION MORTARBOARD CAP */}
              {/* Cap Base Ring */}
              <path d="M 75 52 C 75 46, 125 46, 125 52 L 122 58 C 122 58, 78 58, 78 58 Z" fill="#090D16" />
              {/* Cap Diamond Top */}
              <polygon points="100,30 155,46 100,60 45,46" fill="#0F2C59" stroke="#00A86B" strokeWidth="2" />
              {/* Cap Top Center Button */}
              <circle cx="100" cy="45" r="3" fill="#F59E0B" />
              {/* Tassel String */}
              <path d="M 100 45 Q 130 46 135 68" stroke="#F59E0B" strokeWidth="2" fill="none" />
              {/* Tassel Fringe */}
              <polygon points="132,68 138,68 135,78" fill="#F59E0B" />
            </svg>
          </div>
        </div>

        {/* Pulsing 3-Dot Sequential Loader using EWmart Emerald Green (#00A86B) */}
        <div className="flex items-center justify-center gap-2 mb-5">
          <span className="w-3.5 h-3.5 rounded-full bg-[#00A86B] shadow-[0_0_10px_#00A86B] dot-1" />
          <span className="w-3.5 h-3.5 rounded-full bg-[#00A86B] shadow-[0_0_10px_#00A86B] dot-2" />
          <span className="w-3.5 h-3.5 rounded-full bg-[#00A86B] shadow-[0_0_10px_#00A86B] dot-3" />
        </div>

        {/* Main Text */}
        <h3 className="text-xl font-bold text-slate-100 mb-1 tracking-tight">
          Connecting EWU Campus Marketplace...
        </h3>

        {/* Secondary Subtext Badge */}
        <div className="mt-3 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#0F2C59]/80 border border-[#00A86B]/30 text-xs font-medium text-slate-200 shadow-sm">
          <ShieldCheck className="w-4 h-4 text-[#00A86B] shrink-0" />
          <span className="tracking-wide">
            Authenticating <span className="font-semibold text-emerald-400">@ewubd.edu</span> credentials...
          </span>
          <Lock className="w-3 h-3 text-slate-400 shrink-0 ml-1" />
        </div>
      </div>
    </div>
  );
};

export default EWMLoader;
