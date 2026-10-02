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
  ChevronRight,
  Sparkles,
  MapPin,
  Menu,
  X
} from 'lucide-react';
import Logo from './Logo';

interface EWmHeroProps {
  onCategorySelect?: (category: string) => void;
  onRegisterClick?: () => void;
}

export const EWmHero: React.FC<EWmHeroProps> = ({ 
  onCategorySelect,
  onRegisterClick 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const categories = [
    { id: 'textbooks', label: 'Textbooks', icon: BookOpen, emoji: '📚' },
    { id: 'food', label: 'Cafeteria Food', icon: Utensils, emoji: '🍱' },
    { id: 'electronics', label: 'Electronics', icon: Laptop, emoji: '💻' },
    { id: 'thrift', label: 'Thrift', icon: Shirt, emoji: '👕' },
    { id: 'services', label: 'Campus Services', icon: GraduationCap, emoji: '🏫' },
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
      
      {/* 1. TOP NOTIFICATION BAR (Solid Dark Navy bg-[#0B192C]) */}
      <div className="w-full bg-[#0B192C] text-white text-xs font-medium py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#00A86B] animate-pulse" />
            <span className="font-semibold text-emerald-400">Exclusive to verified EWU students</span>
          </div>

          <div className="hidden sm:flex items-center gap-6 text-slate-300">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00A86B]" />
              Safe campus meetups - No platform fees
            </span>
            <span className="text-slate-600">|</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              EWU Aftabnagar Campus
            </span>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER NAVIGATION (Pure White background) */}
      <header className="w-full bg-white border-b border-slate-200 shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          
          {/* Exact Figma Logo Component */}
          <div className="cursor-pointer group">
            <Logo size="md" showTagline={true} />
          </div>

          {/* Navigation Links: Slate dark text */}
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
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Heart / Favorites Icon Circle */}
            <button 
              aria-label="Favorites"
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            >
              <Heart className="w-4 h-4" />
            </button>

            {/* Register as Seller Button: Solid Deep Navy Blue (#0F2C59) */}
            <button
              onClick={onRegisterClick}
              className="hidden sm:flex items-center gap-2 bg-[#0F2C59] hover:bg-[#0B192C] text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors shadow-sm cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register as Seller</span>
            </button>

            {/* Avatar Circle ("SA") */}
            <div 
              title="Student Account (SA)"
              className="w-9 h-9 rounded-full bg-[#0F2C59] text-white flex items-center justify-center font-bold text-xs shadow-sm cursor-pointer border border-[#00A86B]/40"
            >
              SA
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 md:hidden rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
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
              className="mt-2 w-full bg-[#0F2C59] text-white py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register as Seller</span>
            </button>
          </div>
        )}
      </header>

      {/* 3. HERO CONTAINER SECTION */}
      <section 
        className="relative w-full min-h-[580px] lg:min-h-[620px] flex items-center bg-cover bg-center bg-no-repeat py-16 lg:py-24"
        style={{ backgroundImage: "url('/images/ewu-campus.jpg')" }}
      >
        {/* Figma Gradient Overlay: Ensures headline text is 100% legible */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/85 via-[#0F172A]/55 to-[#0F172A]/85 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-900/60 to-slate-950/40 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col items-start">
          
          {/* Hero Badge */}
          <div className="inline-flex items-center gap-2 bg-slate-900/70 backdrop-blur-md border border-slate-700/60 px-4 py-1.5 rounded-full text-xs font-bold text-white tracking-wider mb-6 shadow-md">
            <span className="w-2 h-2 rounded-full bg-[#00A86B] animate-pulse" />
            <span>2,400+ VERIFIED EWU STUDENTS</span>
          </div>

          {/* Headline Text */}
          <h1 className="mb-4 max-w-3xl leading-[1.12]">
            <span className="block text-white font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight drop-shadow-md">
              The Student-to-Student
            </span>
            <span className="block text-[#00A86B] font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight drop-shadow-lg">
              Campus Marketplace.
            </span>
          </h1>

          {/* Subheadline Text */}
          <p className="text-lg sm:text-xl text-slate-100 font-normal max-w-2xl mb-8 leading-relaxed drop-shadow-sm">
            Find what you need. Sell what you don't. Meet safely, right here on campus.
          </p>

          {/* Primary Search Box Overlay (Pure White Rounded Card) */}
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl p-2 sm:p-2.5 mb-8 flex flex-col sm:flex-row items-center gap-2 border border-slate-100">
            <div className="flex-1 w-full flex items-center pl-3">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search textbooks, gadgets, notes..."
                className="w-full bg-transparent px-3 py-2 text-slate-700 placeholder-slate-400 focus:outline-none text-base font-normal"
              />
            </div>

            <button className="w-full sm:w-auto bg-[#0F2C59] hover:bg-[#0B192C] text-white px-7 py-3.5 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 shrink-0 cursor-pointer shadow-md">
              <span>Search</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Category Bar Pills below Search (Soft dark semi-transparent) */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200 mr-1 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#00A86B]" /> Popular:
            </span>

            {categories.map((cat) => {
              const isSelected = activeCategory === cat.label;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.label)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 border cursor-pointer ${
                    isSelected
                      ? 'bg-[#00A86B] text-white border-emerald-400 shadow-md scale-105'
                      : 'bg-slate-900/60 hover:bg-slate-800 text-white border-slate-700/50 backdrop-blur-md'
                  }`}
                >
                  <span>{cat.emoji}</span>
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
