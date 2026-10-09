import React, { useState } from 'react';
import { 
  Search, 
  Heart, 
  ShieldCheck, 
  BookOpen, 
  Utensils, 
  Laptop, 
  Shirt, 
  GraduationCap, 
  UserPlus, 
  Sparkles,
  Menu,
  X
} from 'lucide-react';
import Logo from './Logo';

interface EWmHeroProps {
  onCategorySelect?: (category: string) => void;
  onRegisterClick?: () => void;
  onAvatarClick?: () => void;
}

export const EWmHero: React.FC<EWmHeroProps> = ({ 
  onCategorySelect,
  onRegisterClick,
  onAvatarClick
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const categories = [
    { id: 'textbooks', label: 'Textbooks', icon: BookOpen },
    { id: 'food', label: 'Cafeteria Food', icon: Utensils },
    { id: 'electronics', label: 'Electronics', icon: Laptop },
    { id: 'thrift', label: 'Thrift', icon: Shirt },
    { id: 'services', label: 'Campus Services', icon: GraduationCap },
  ];

  const handleCategoryClick = (catLabel: string) => {
    const newCat = activeCategory === catLabel ? null : catLabel;
    setActiveCategory(newCat);
    if (onCategorySelect) {
      onCategorySelect(catLabel);
    }
  };

  return (
    <div className="w-full flex flex-col font-sans">
      
      {/* 1. TOP NOTIFICATION BANNER (Solid Dark Navy bg-[#0B192C]) */}
      <div className="w-full bg-[#0B192C] text-white text-xs font-medium py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#00A86B] animate-pulse" />
            <span className="font-semibold text-emerald-400">Exclusive to verified EWU students</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00A86B]" />
            <span>Safe campus meetups - No platform fees</span>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER NAVIGATION (Pure White background) */}
      <header className="w-full bg-white border-b border-slate-200 shadow-xs sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          
          {/* Logo Component */}
          <div className="cursor-pointer group">
            <Logo size="md" showTagline={true} />
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-700">
            <a href="#marketplace" className="hover:text-[#0B192C] transition-colors">
              Marketplace
            </a>
            <a href="#categories" className="hover:text-[#0B192C] transition-colors">
              Categories
            </a>
            <a href="#sellers" className="hover:text-[#0B192C] transition-colors">
              Sellers
            </a>
            <a href="#how-it-works" className="hover:text-[#0B192C] transition-colors">
              How it Works
            </a>
          </nav>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Search Icon Circle */}
            <button 
              aria-label="Search"
              className="bg-slate-100/80 hover:bg-slate-200 p-2.5 rounded-full text-slate-700 transition-colors cursor-pointer flex items-center justify-center"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Heart / Favorites Icon Circle */}
            <button 
              aria-label="Favorites"
              className="bg-slate-100/80 hover:bg-slate-200 p-2.5 rounded-full text-slate-700 transition-colors cursor-pointer flex items-center justify-center"
            >
              <Heart className="w-4 h-4" />
            </button>

            {/* Register as Seller Button: Solid Deep Navy (#0F2C59) */}
            <button
              onClick={onRegisterClick}
              className="hidden sm:flex items-center gap-2 bg-[#0F2C59] hover:bg-[#0B192C] text-white font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-xs text-sm cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register as Seller</span>
            </button>

            {/* Avatar Circle ("SA") */}
            <div 
              title="Student Account (SA)"
              onClick={onAvatarClick}
              className="w-9 h-9 rounded-full bg-[#0F2C59] text-white flex items-center justify-center font-bold text-xs shadow-xs cursor-pointer"
            >
              SA
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 md:hidden rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Nav Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-200 px-4 py-3 flex flex-col gap-2 text-slate-700 font-medium">
            <a href="#marketplace" className="py-2 border-b border-slate-100">Marketplace</a>
            <a href="#categories" className="py-2 border-b border-slate-100">Categories</a>
            <a href="#sellers" className="py-2 border-b border-slate-100">Sellers</a>
            <a href="#how-it-works" className="py-2 border-b border-slate-100">How it Works</a>
            <button
              onClick={onRegisterClick}
              className="mt-2 w-full bg-[#0F2C59] text-white py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register as Seller</span>
            </button>
          </div>
        )}
      </header>

      {/* 3. HERO CONTAINER SECTION */}
      <section className="relative w-full min-h-[580px] bg-[#0F172A] overflow-hidden flex items-center">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/ewu-campus.jpg')" }}
        />

        {/* STRICT FIGMA SLATE-NAVY OVERLAY (DO NOT REMOVE THIS DIV) */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A]/90 via-[#1E293B]/75 to-[#0F172A]/85 backdrop-brightness-90" />

        {/* Content Container (relative z-10 so it sits above overlay) */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 w-full flex flex-col items-start">
          
          {/* Hero Badge */}
          <div className="inline-flex items-center gap-2 bg-slate-900/60 backdrop-blur-md border border-slate-700/60 px-4 py-1.5 rounded-full text-xs font-bold text-white tracking-wider mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#00A86B] animate-pulse" />
            <span>2,400+ VERIFIED EWU STUDENTS</span>
          </div>

          {/* Main Headline (Exact font-bold, text-4xl md:text-5xl) */}
          <h1 className="max-w-3xl leading-[1.18] tracking-tight">
            <span className="block text-white font-bold text-4xl md:text-5xl tracking-tight">
              The Student-to-Student
            </span>
            <span className="block text-[#00A86B] font-bold text-4xl md:text-5xl tracking-tight mt-1">
              Campus Marketplace.
            </span>
          </h1>

          {/* Subheadline (Exact text-slate-200 font-normal text-base md:text-lg mt-3) */}
          <p className="text-slate-200 font-normal text-base md:text-lg mt-3 max-w-2xl leading-relaxed">
            Find what you need. Sell what you don't. Meet safely, right here on campus.
          </p>

          {/* Primary Search Box Overlay */}
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl p-2.5 mt-8 flex flex-col sm:flex-row items-center gap-3 border border-slate-100">
            <div className="flex-1 w-full flex items-center pl-3">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search textbooks, gadgets, notes..."
                className="w-full bg-transparent px-3 py-2 text-slate-700 placeholder-slate-400 font-normal focus:outline-none text-sm sm:text-base"
              />
            </div>

            <button className="w-full sm:w-auto bg-[#0F2C59] hover:bg-[#0B192C] text-white font-semibold px-6 py-3 rounded-xl transition-all shrink-0 flex items-center justify-center gap-2 text-sm cursor-pointer shadow-sm">
              <span>Search marketplace</span>
            </button>
          </div>

          {/* Category Bar Pills below Search (Rounded-full, px-4 py-2, text-xs) */}
          <div className="flex flex-wrap items-center gap-2.5 mt-6">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200 mr-1 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#00A86B]" /> Popular:
            </span>

            {categories.map((cat) => {
              const isSelected = activeCategory === cat.label;
              const IconComponent = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.label)}
                  className={`bg-slate-900/60 backdrop-blur border border-slate-700/60 text-white rounded-full px-4 py-2 text-xs font-medium hover:bg-slate-800 transition-colors flex items-center gap-2 cursor-pointer ${
                    isSelected ? 'bg-[#00A86B] border-emerald-400 shadow-sm' : ''
                  }`}
                >
                  <IconComponent className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

        </div>
      </section>

    </div>
  );
};

export default EWmHero;
