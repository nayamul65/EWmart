import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showTagline = true,
}) => {
  // Sizing variants
  const iconSizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  }[size];

  const brandTextClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-4xl',
  }[size];

  const taglineClasses = {
    sm: 'text-[8px]',
    md: 'text-[9px]',
    lg: 'text-xs',
  }[size];

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* 1. Icon: Mortarboard hat owl icon inside white circular shield with gold/yellow border ring (#EAB308) */}
      <div 
        className={`${iconSizeClasses} rounded-full bg-white border-2 border-[#EAB308] shadow-sm flex items-center justify-center p-1 relative shrink-0`}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-xs"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Owl Body */}
          <path
            d="M 28 46 C 28 32, 72 32, 72 46 C 78 68, 74 88, 50 88 C 26 88, 22 68, 28 46 Z"
            fill="#0F2C59"
          />
          
          {/* White Chest/Belly */}
          <ellipse cx="50" cy="68" rx="15" ry="16" fill="#FFFFFF" />
          <path d="M 44 62 Q 50 66 56 62" stroke="#00A86B" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 43 69 Q 50 73 57 69" stroke="#00A86B" strokeWidth="1.5" strokeLinecap="round" />

          {/* Cute Eyes (Outer white rings) */}
          <circle cx="39" cy="50" r="10" fill="#FFFFFF" />
          <circle cx="61" cy="50" r="10" fill="#FFFFFF" />

          {/* Iris */}
          <circle cx="40" cy="50" r="5.5" fill="#00A86B" />
          <circle cx="60" cy="50" r="5.5" fill="#00A86B" />

          {/* Pupil */}
          <circle cx="40.5" cy="50" r="3" fill="#0F172A" />
          <circle cx="59.5" cy="50" r="3" fill="#0F172A" />

          {/* Catchlight sparkle */}
          <circle cx="39" cy="48.5" r="1.5" fill="#FFFFFF" />
          <circle cx="58" cy="48.5" r="1.5" fill="#FFFFFF" />

          {/* Cute Pink Cheeks */}
          <ellipse cx="32" cy="56" rx="2.5" ry="1.5" fill="#F472B6" opacity="0.7" />
          <ellipse cx="68" cy="56" rx="2.5" ry="1.5" fill="#F472B6" opacity="0.7" />

          {/* Orange Beak */}
          <polygon points="46,55 54,55 50,61" fill="#F59E0B" />

          {/* Feet */}
          <ellipse cx="43" cy="87" rx="4" ry="2" fill="#F59E0B" />
          <ellipse cx="57" cy="87" rx="4" ry="2" fill="#F59E0B" />

          {/* Mortarboard Cap */}
          <path d="M 38 34 C 38 30, 62 30, 62 34 L 60 38 L 40 38 Z" fill="#090D16" />
          <polygon points="50,20 78,28 50,36 22,28" fill="#0F2C59" stroke="#00A86B" strokeWidth="1.5" />
          <circle cx="50" cy="28" r="1.8" fill="#EAB308" />
          {/* Gold Tassel */}
          <path d="M 50 28 Q 66 30 68 42" stroke="#EAB308" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <polygon points="66,41 70,41 68,47" fill="#EAB308" />
        </svg>
      </div>

      {/* 2. Brand Text & Tagline */}
      <div className="flex flex-col justify-center leading-none">
        <div className={`font-black tracking-tight ${brandTextClasses}`}>
          <span className="text-[#0F2C59]">EW</span>
          <span className="text-[#00A86B]">mart</span>
        </div>
        {showTagline && (
          <span 
            className={`font-bold tracking-wider text-slate-500 uppercase mt-0.5 ${taglineClasses}`}
          >
            EWU CAMPUS MARKET
          </span>
        )}
      </div>
    </div>
  );
};

export default Logo;
