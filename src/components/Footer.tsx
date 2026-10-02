import React from 'react';
import { ShieldCheck, MapPin, Store, Lock } from 'lucide-react';
import Logo from './Logo';

interface FooterProps {
  onAdminClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onAdminClick }) => {
  return (
    <footer className="w-full bg-white border-t border-slate-200 mt-auto">
      
      {/* Top Value Proposition Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-b border-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-slate-600 text-xs">
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#00A86B] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm mb-0.5">Verified EWU Network</h4>
              <p className="text-slate-500">Exclusively for authenticated @ewubd.edu students and faculty.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0F2C59] flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm mb-0.5">Aftabnagar Campus Handover</h4>
              <p className="text-slate-500">Zero shipping fees. Meet safely at the library, plaza, or cafeteria.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#00A86B] flex items-center justify-center shrink-0">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm mb-0.5">Student Peer-to-Peer</h4>
              <p className="text-slate-500">Textbooks, calculators, gadgets, and services passed student to student.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Brand & Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <Logo size="sm" showTagline={true} />
        </div>

        <div className="flex flex-wrap items-center gap-6 text-xs font-semibold text-slate-600">
          <a href="#marketplace" className="hover:text-[#0F2C59] transition-colors">Marketplace</a>
          <a href="#categories" className="hover:text-[#0F2C59] transition-colors">Categories</a>
          <a href="#sellers" className="hover:text-[#0F2C59] transition-colors">Verified Sellers</a>
          <a href="#how-it-works" className="hover:text-[#0F2C59] transition-colors">Safety Guidelines</a>
        </div>
      </div>

      {/* Bottom Copyright Bar with Stealth Staff Portal Entry */}
      <div className="bg-slate-50 border-t border-slate-200/80 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          
          <p className="text-slate-500 font-medium">
            EWmart &copy; {new Date().getFullYear()} — East West University Student Marketplace. All rights reserved.
          </p>

          {/* Subtle Stealth Staff Portal Entry Link */}
          <div className="flex items-center gap-2">
            <button
              onClick={onAdminClick}
              className="text-slate-400 hover:text-slate-600 text-xs font-medium transition-colors inline-flex items-center gap-1 cursor-pointer"
              title="Restricted Staff & Moderation Console"
            >
              <Lock className="w-3 h-3 text-slate-400" />
              <span>Staff Portal</span>
            </button>
          </div>

        </div>
      </div>

    </footer>
  );
};

export default Footer;
