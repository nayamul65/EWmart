import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  ShieldCheck, 
  BookOpen, 
  Utensils, 
  Laptop, 
  Shirt, 
  GraduationCap, 
  UserPlus, 
  ChevronRight,
  Sparkles,
  TrendingUp,
  Store,
  Menu,
  X
} from 'lucide-react';

interface EWmHeroProps {
  onCategorySelect?: (category: string) => void;
  onRegisterClick?: () => void;
}

export const EWmHero: React.FC<EWmHeroProps> = ({ 
  onCategorySelect,
  onRegisterClick 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All Campus Spots');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const categories = [
    { id: 'textbooks', label: 'Textbooks', icon: BookOpen, emoji: '📚', count: '340+ items' },
    { id: 'food', label: 'Cafeteria Food', icon: Utensils, emoji: '🍱', count: '120+ orders' },
    { id: 'electronics', label: 'Electronics', icon: Laptop, emoji: '💻', count: '210+ deals' },
    { id: 'thrift', label: 'Thrift', icon: Shirt, emoji: '👕', count: '450+ items' },
    { id: 'services', label: 'Campus Services', icon: GraduationCap, emoji: '🏫', count: '90+ offers' },
  ];

  const locations = [
    'All Campus Spots',
    'EWU Plaza',
    'Central Cafeteria',
    'Main Library (Level 2)',
    'Aftabnagar Main Gate',
    'Underground Parking',
  ];

  const handleCategoryClick = (catLabel: string) => {
    const newCat = activeCategory === catLabel ? null : catLabel;
    setActiveCategory(newCat);
    if (onCategorySelect) {
      onCategorySelect(catLabel);
    }
  };

  return (
    <div className="relative min-h-[92vh] w-full flex flex-col justify-between overflow-hidden bg-slate-950">
      {/* 1. Backdrop Image with explicit /images/8%20full%20page.jpg reference */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
        style={{ backgroundImage: `url('/images/8%20full%20page.jpg')` }}
        aria-label="East West University Aftabnagar Campus Building"
      />

      {/* Dark gradient overlays for pristine readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-950/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/60" />

      {/* Subtle glowing accents */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-[#00A86B]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#0F2C59]/40 rounded-full blur-3xl pointer-events-none" />

      {/* 2. Header & Navigation Bar */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <nav className="flex items-center justify-between py-3 px-5 bg-slate-900/60 border border-slate-800/80 rounded-2xl backdrop-blur-xl shadow-xl">
          
          {/* Logo with Cute Owl Mascot Icon */}
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#0F2C59] to-[#00A86B] p-0.5 shadow-md shadow-[#00A86B]/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center overflow-hidden">
                {/* Mini Mascot Icon */}
                <svg viewBox="0 0 100 100" className="w-7 h-7" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="55" r="35" fill="#0F2C59" />
                  <ellipse cx="50" cy="65" rx="20" ry="20" fill="#FFFFFF" />
                  <circle cx="40" cy="48" r="10" fill="#FFFFFF" />
                  <circle cx="60" cy="48" r="10" fill="#FFFFFF" />
                  <circle cx="41" cy="48" r="5" fill="#00A86B" />
                  <circle cx="59" cy="48" r="5" fill="#00A86B" />
                  <polygon points="47,54 53,54 50,60" fill="#F59E0B" />
                  <polygon points="50,15 80,26 50,36 20,26" fill="#00A86B" />
                  <circle cx="50" cy="25" r="2.5" fill="#F59E0B" />
                </svg>
              </div>
            </div>
            
            <div className="flex flex-col">
              <span className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-0.5">
                EW<span className="text-[#00A86B]">mart</span>
              </span>
              <span className="text-[10px] font-medium text-emerald-400 tracking-wider uppercase -mt-1">
                Campus Marketplace
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#marketplace" className="hover:text-white transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#00A86B] after:scale-x-0 hover:after:scale-x-100 after:transition-transform">
              Marketplace
            </a>
            <a href="#categories" className="hover:text-white transition-colors py-1">
              Categories
            </a>
            <a href="#sellers" className="hover:text-white transition-colors py-1">
              Sellers
            </a>
            <a href="#how-it-works" className="hover:text-white transition-colors py-1">
              How it Works
            </a>
          </div>

          {/* Header Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs font-medium text-slate-300">
              <ShieldCheck className="w-4 h-4 text-[#00A86B]" />
              <span>Verified @ewubd.edu</span>
            </div>

            {/* Primary Header CTA */}
            <button
              onClick={onRegisterClick}
              className="relative group px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-[#00A86B] to-emerald-600 hover:from-emerald-500 hover:to-[#00A86B] shadow-lg shadow-[#00A86B]/25 hover:shadow-[#00A86B]/40 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register as Seller</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Mobile Hamburger Menu Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-800 text-slate-200 hover:text-white focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 p-4 bg-slate-900/95 border border-slate-800 rounded-2xl backdrop-blur-xl shadow-2xl flex flex-col gap-3 text-slate-200 animate-in fade-in slide-in-from-top-2">
            <a href="#marketplace" className="px-3 py-2 rounded-lg hover:bg-slate-800 font-medium">Marketplace</a>
            <a href="#categories" className="px-3 py-2 rounded-lg hover:bg-slate-800 font-medium">Categories</a>
            <a href="#sellers" className="px-3 py-2 rounded-lg hover:bg-slate-800 font-medium">Sellers</a>
            <a href="#how-it-works" className="px-3 py-2 rounded-lg hover:bg-slate-800 font-medium">How it Works</a>
            <hr className="border-slate-800 my-1" />
            <button
              onClick={onRegisterClick}
              className="w-full py-2.5 rounded-xl font-semibold text-sm text-white bg-[#00A86B] flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register as Seller</span>
            </button>
          </div>
        )}
      </header>

      {/* 3. Hero Content Section */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 flex flex-col justify-center my-auto">
        <div className="max-w-3xl">
          
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/60 border border-[#00A86B]/40 text-emerald-300 text-xs font-semibold tracking-wide mb-6 backdrop-blur-md">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00A86B]"></span>
            </span>
            <span>EAST WEST UNIVERSITY STUDENT NETWORK</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-[#00A86B]" /> 1.4k+ Active Campus Listings
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] mb-6">
            Buy, Sell & Trade <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-[#00A86B] to-teal-200">
              Inside EWU Campus
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-slate-300 font-normal leading-relaxed mb-8 max-w-2xl">
            A dedicated, secure marketplace exclusive to verified <span className="font-semibold text-white underline decoration-[#00A86B] decoration-2 underline-offset-4">@ewubd.edu</span> students.
            Trade textbooks, cafeteria meals, tech gear, and campus services directly in Aftabnagar.
          </p>

          {/* Campus Search Bar */}
          <div className="relative mb-8 bg-slate-900/90 p-2.5 sm:p-3 rounded-2xl border border-slate-700/80 shadow-2xl backdrop-blur-xl flex flex-col md:flex-row items-center gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1 w-full flex items-center pl-3">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search textbooks, food tokens, laptops, calc..."
                className="w-full bg-transparent px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none"
              />
            </div>

            {/* Location Selector */}
            <div className="w-full md:w-auto flex items-center gap-2 px-3 py-2 bg-slate-800/80 border border-slate-700/60 rounded-xl text-xs font-medium text-slate-300 shrink-0">
              <MapPin className="w-4 h-4 text-[#00A86B] shrink-0" />
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="bg-transparent text-slate-200 focus:outline-none cursor-pointer pr-2"
              >
                {locations.map((loc) => (
                  <option key={loc} value={loc} className="bg-slate-900 text-slate-200">
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Button */}
            <button className="w-full md:w-auto px-6 py-3 rounded-xl font-semibold text-sm text-white bg-[#00A86B] hover:bg-emerald-600 active:scale-95 transition-all shadow-md shadow-[#00A86B]/30 flex items-center justify-center gap-2 shrink-0">
              <span>Find Deals</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* 4. Quick Category Pills */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#00A86B]" /> Popular Campus Categories:
            </span>

            <div className="flex flex-wrap items-center gap-2.5">
              {categories.map((cat) => {
                const isSelected = activeCategory === cat.label;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.label)}
                    className={`group relative px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-2 border cursor-pointer ${
                      isSelected
                        ? 'bg-[#00A86B] text-white border-emerald-400 shadow-lg shadow-[#00A86B]/30 scale-105'
                        : 'bg-slate-900/80 hover:bg-slate-800 text-slate-200 border-slate-700/80 hover:border-emerald-500/50 hover:text-white'
                    }`}
                  >
                    <span className="text-base">{cat.emoji}</span>
                    <span>{cat.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      isSelected ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-800 text-slate-400 group-hover:text-emerald-300'
                    }`}>
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </main>

      {/* Footer Feature Bar */}
      <footer className="relative z-10 w-full border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-md py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#00A86B]" />
              <span>100% Student Verified (@ewubd.edu)</span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#00A86B]" />
              <span>Zero Delivery Fee Handover in Aftabnagar</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Store className="w-4 h-4 text-[#00A86B]" />
            <span className="font-medium text-slate-300">EWmart &copy; {new Date().getFullYear()} — East West University</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default EWmHero;
