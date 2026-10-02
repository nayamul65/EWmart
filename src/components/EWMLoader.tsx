import React from 'react';
import { Lock } from 'lucide-react';
import Logo from './Logo';

export const EWMLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 bg-[#0B192C]/90 backdrop-blur-md flex flex-col items-center justify-center p-4">
      {/* 2. Animation Card: Clean rounded white card */}
      <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center border border-slate-100 max-w-sm w-full mx-4 animate-fade-in text-center">
        
        {/* 3. Logo & Mascot with subtle bounce */}
        <div className="animate-bounce mb-6 flex flex-col items-center">
          <Logo size="lg" showTagline={true} />
        </div>

        {/* 4. Simple 3-Dot Pulse Loader in EWmart Green (#00A86B) */}
        <div className="flex items-center justify-center gap-2.5 my-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#00A86B] dot-1 shadow-[0_0_8px_#00A86B]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#00A86B] dot-2 shadow-[0_0_8px_#00A86B]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#00A86B] dot-3 shadow-[0_0_8px_#00A86B]" />
        </div>

        {/* 5. Text Subtext */}
        <p className="text-slate-800 font-bold text-sm mt-4">
          Connecting EWU Campus Marketplace...
        </p>

        {/* Status Badge: Small pill with lock icon */}
        <div className="bg-emerald-50 text-[#00A86B] border border-emerald-200 text-xs px-3 py-1 rounded-full font-semibold mt-2 flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-[#00A86B]" />
          <span>Authenticating @ewubd.edu</span>
        </div>

      </div>
    </div>
  );
};

export default EWMLoader;
