import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  ShieldCheck, 
  Package, 
  Flag, 
  UserX, 
  LogOut, 
  Search, 
  ArrowLeft,
  Check,
  Trash2,
  Ban,
  Clock,
  AlertTriangle,
  X,
  ExternalLink,
  MapPin
} from 'lucide-react';
import Logo from '../components/Logo';
import Button from '../components/ui/Button';
import Pill from '../components/ui/Pill';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Modal from '../components/ui/Modal';
import Select from '../components/ui/Select';
import Textarea from '../components/ui/Textarea';
import { timeAgo } from '../lib/time';
import type { 
  Seller, 
  Listing, 
  AdminStats 
} from '../types/ewmart';
import { 
  getSellers, 
  approveSeller, 
  banSeller, 
  reinstateSeller, 
  getAllListingsForAdmin, 
  deleteListing, 
  flagListing, 
  unflagListing, 
  getStats 
} from '../lib/store';

interface AdminDashboardProps {
  onLogout: () => void;
  onNavigateHome: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  onLogout, 
  onNavigateHome 
}) => {
  // Navigation active tab
  const [activeTab, setActiveTab] = useState<'overview' | 'sellers' | 'listings' | 'flagged' | 'banned'>('overview');
  
  // Data state
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [sellerStatusFilter, setSellerStatusFilter] = useState<'all' | 'pending' | 'approved' | 'banned'>('all');

  // Detail Drawer state
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);

  // Dialog states
  const [banDialog, setBanDialog] = useState<{ isOpen: boolean; seller: Seller | null }>({ isOpen: false, seller: null });
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; listingId: string | null }>({ isOpen: false, listingId: null });
  const [flagDialog, setFlagDialog] = useState<{ isOpen: boolean; listing: Listing | null }>({ isOpen: false, listing: null });
  const [flagReasonCategory, setFlagReasonCategory] = useState('Prohibited item');
  const [flagReasonNote, setFlagReasonNote] = useState('');

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Stealth rule: Add noindex nofollow meta tag
  useEffect(() => {
    let meta = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'robots';
      document.head.appendChild(meta);
    }
    meta.content = 'noindex, nofollow';

    return () => {
      if (meta) {
        meta.content = 'index, follow';
      }
    };
  }, []);

  // Fetch data
  const refreshData = async () => {
    try {
      const [sData, lData, statData] = await Promise.all([
        getSellers(),
        getAllListingsForAdmin(),
        getStats()
      ]);
      setSellers(sData);
      setListings(lData);
      setStats(statData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Actions
  const handleApproveSeller = async (sellerId: string, name: string) => {
    await approveSeller(sellerId);
    showToast(`Approved seller account for ${name}.`);
    refreshData();
  };

  const handleConfirmBanSeller = async (reason?: string) => {
    if (!banDialog.seller) return;
    await banSeller(banDialog.seller.id, reason);
    showToast(`Banned seller ${banDialog.seller.name}. All listings suspended.`);
    setBanDialog({ isOpen: false, seller: null });
    if (selectedSeller?.id === banDialog.seller.id) {
      setSelectedSeller(null);
    }
    refreshData();
  };

  const handleReinstateSeller = async (sellerId: string, name: string) => {
    await reinstateSeller(sellerId);
    showToast(`Reinstated seller ${name}.`);
    refreshData();
  };

  const handleConfirmDeleteListing = async () => {
    if (!deleteDialog.listingId) return;
    await deleteListing(deleteDialog.listingId);
    showToast(`Permanently deleted listing.`);
    setDeleteDialog({ isOpen: false, listingId: null });
    refreshData();
  };

  const handleConfirmFlagListing = async () => {
    if (!flagDialog.listing) return;
    const combinedReason = `${flagReasonCategory}: ${flagReasonNote.trim() || 'Moderator action'}`;
    await flagListing(flagDialog.listing.id, combinedReason);
    showToast(`Listing flagged and hidden from public marketplace.`);
    setFlagDialog({ isOpen: false, listing: null });
    setFlagReasonNote('');
    refreshData();
  };

  const handleUnflagListing = async (listingId: string) => {
    await unflagListing(listingId);
    showToast(`Dismissed flag. Listing restored to public feed.`);
    refreshData();
  };

  // Filtered lists
  const pendingSellersList = sellers.filter(s => s.status === 'pending');
  const flaggedListingsList = listings.filter(l => l.flagged);
  const bannedSellersList = sellers.filter(s => s.status === 'banned');

  const filteredSellers = sellers.filter(s => {
    const matchesStatus = sellerStatusFilter === 'all' || s.status === sellerStatusFilter;
    const matchesSearch = searchQuery === '' || 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.department.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const filteredListings = listings.filter(l => {
    return searchQuery === '' ||
      l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.sellerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.id.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900 antialiased selection:bg-[#00A86B] selection:text-white">
      
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#0F2C59] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-400/40 animate-in fade-in">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* 1. INDEPENDENT SIDEBAR (240px solid white, 1px slate-200 right border) */}
      <aside className="w-60 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 h-screen sticky top-0 z-30">
        <div>
          {/* Header Brand */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <Logo size="md" showTagline={true} />
          </div>

          <div className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Moderation Modules
          </div>

          {/* Sidebar Navigation Items (Lucide React Icons ONLY) */}
          <nav className="px-3 space-y-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-[#0F2C59] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-emerald-400" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('sellers')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'sellers'
                  ? 'bg-[#0F2C59] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Sellers</span>
              </div>
              {pendingSellersList.length > 0 && (
                <span className="bg-[#00A86B] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {pendingSellersList.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('listings')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'listings'
                  ? 'bg-[#0F2C59] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4 text-emerald-400" />
                <span>Listings</span>
              </div>
              <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full font-mono">
                {listings.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('flagged')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'flagged'
                  ? 'bg-[#0F2C59] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Flag className="w-4 h-4 text-amber-400" />
                <span>Flagged</span>
              </div>
              {flaggedListingsList.length > 0 && (
                <span className="bg-amber-500 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {flaggedListingsList.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('banned')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'banned'
                  ? 'bg-[#0F2C59] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <UserX className="w-4 h-4 text-red-400" />
                <span>Banned</span>
              </div>
              <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full font-mono">
                {bannedSellersList.length}
              </span>
            </button>
          </nav>
        </div>

        {/* LogOut Button at Bottom */}
        <div className="p-4 border-t border-slate-100 space-y-2">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* 2. MAIN WORKSPACE */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Topbar: Current page title, global table search bar, and secondary link */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-xs">
          <div>
            <h1 className="text-lg font-bold text-[#0F2C59] tracking-tight capitalize">
              {activeTab} Module
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              EWmart Moderation & Staff Control Panel
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Global Table Search Bar */}
            <div className="relative flex items-center">
              <Search className="w-4 h-4 absolute left-3.5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search sellers, listings, IDs..."
                className="pl-9 pr-4 py-2 w-64 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F2C59]/15 focus:border-[#0F2C59]"
              />
            </div>

            {/* Secondary link: Back to marketplace */}
            <button
              onClick={onNavigateHome}
              className="inline-flex items-center gap-2 text-xs font-bold text-[#0F2C59] hover:text-[#0B192C] bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to marketplace</span>
            </button>
          </div>
        </header>

        {/* Content Container */}
        <div className="p-6 sm:p-8 max-w-7xl w-full mx-auto space-y-8">
          
          {/* TAB 1: OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              
              {/* Compact Stat Strip (1 white container with 4 vertical divider sections) */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 overflow-hidden">
                <div className="p-6">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Sellers</p>
                  <h3 className="text-2xl font-black text-[#0F2C59] mt-1">{stats?.totalSellers || 0}</h3>
                  <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">{stats?.approvedSellers || 0} verified</p>
                </div>

                <div className="p-6">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Pending Approval</p>
                  <h3 className="text-2xl font-black text-amber-600 mt-1">{stats?.pendingSellers || 0}</h3>
                  <p className="text-[11px] text-amber-600 font-semibold mt-0.5">Awaiting staff review</p>
                </div>

                <div className="p-6">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Listings</p>
                  <h3 className="text-2xl font-black text-[#0F2C59] mt-1">{stats?.activeListings || 0}</h3>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">Live on public feed</p>
                </div>

                <div className="p-6">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Flagged Items</p>
                  <h3 className="text-2xl font-black text-red-600 mt-1">{stats?.flaggedListings || 0}</h3>
                  <p className="text-[11px] text-red-600 font-semibold mt-0.5">Requires immediate action</p>
                </div>
              </div>

              {/* Asymmetric 7/5 split below */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* LEFT SIDE (7 cols): Needs your attention */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-[#0F2C59] flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-500" />
                        <span>Needs your attention</span>
                      </h3>
                      <span className="text-xs font-bold text-slate-500">
                        {pendingSellersList.length + flaggedListingsList.length} items
                      </span>
                    </div>

                    {/* Pending Sellers Sub-section */}
                    {pendingSellersList.length > 0 && (
                      <div className="space-y-3">
                        <p className="text-xs font-bold uppercase text-slate-400 tracking-wider">Pending Seller Requests</p>
                        {pendingSellersList.map(ps => (
                          <div key={ps.id} className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 flex items-center justify-between gap-4">
                            <div>
                              <div className="font-bold text-slate-900 text-sm">{ps.name}</div>
                              <div className="text-xs text-slate-600 font-mono">{ps.email} • {ps.department}</div>
                              <div className="text-[11px] text-slate-400 mt-0.5">ID: {ps.studentId}</div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <Button
                                size="sm"
                                variant="primary"
                                onClick={() => handleApproveSeller(ps.id, ps.name)}
                                leftIcon={<Check className="w-3.5 h-3.5 text-emerald-400" />}
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="danger"
                                onClick={() => setBanDialog({ isOpen: true, seller: ps })}
                              >
                                Reject
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Flagged Items Sub-section */}
                    {flaggedListingsList.length > 0 && (
                      <div className="space-y-3 pt-2">
                        <p className="text-xs font-bold uppercase text-slate-400 tracking-wider">Flagged Listings</p>
                        {flaggedListingsList.map(fl => (
                          <div key={fl.id} className="p-4 rounded-xl border border-red-200 bg-red-50/40 flex items-center justify-between gap-4">
                            <div>
                              <div className="font-bold text-slate-900 text-sm">{fl.title}</div>
                              <div className="text-xs text-red-700 font-semibold mt-0.5">Reason: {fl.flagReason}</div>
                              <div className="text-[11px] text-slate-500 mt-0.5">Listed by {fl.sellerName} • ৳{fl.priceBDT}</div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => handleUnflagListing(fl.id)}
                              >
                                Dismiss
                              </Button>
                              <Button
                                size="sm"
                                variant="danger-solid"
                                onClick={() => setDeleteDialog({ isOpen: true, listingId: fl.id })}
                                leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {pendingSellersList.length === 0 && flaggedListingsList.length === 0 && (
                      <div className="py-8 text-center text-xs text-slate-400 font-medium">
                        No immediate action items! All pending requests and flagged reports are resolved.
                      </div>
                    )}
                  </div>
                </div>

                {/* RIGHT SIDE (5 cols): Recent activity */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                    <h3 className="text-base font-bold text-[#0F2C59]">Recent Activity</h3>
                    
                    <div className="space-y-4">
                      {listings.slice(0, 6).map((item) => (
                        <div key={item.id} className="flex items-start gap-3 text-xs border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
                          <div className="w-2 h-2 rounded-full bg-[#00A86B] mt-1.5 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-slate-800 truncate">{item.title}</p>
                            <p className="text-slate-500 text-[11px] mt-0.5">
                              Posted by <strong className="text-slate-700">{item.sellerName}</strong> • ৳{item.priceBDT}
                            </p>
                          </div>
                          <span className="text-[10px] font-bold text-slate-400 shrink-0 font-mono">
                            {timeAgo(item.createdAt)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: SELLERS TAB */}
          {activeTab === 'sellers' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              
              {/* Header & Filter Chips */}
              <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-[#0F2C59]">Campus Sellers Directory</h2>
                  <p className="text-xs text-slate-500 font-medium">Review student seller accounts, verification status, and administrative controls.</p>
                </div>

                {/* Filter Chips: All, Pending, Approved, Banned */}
                <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold">
                  {(['all', 'pending', 'approved', 'banned'] as const).map(chip => (
                    <button
                      key={chip}
                      onClick={() => setSellerStatusFilter(chip)}
                      className={`px-3 py-1.5 rounded-lg capitalize transition-all cursor-pointer ${
                        sellerStatusFilter === chip
                          ? 'bg-white text-[#0F2C59] shadow-xs'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3.5 px-6">Seller</th>
                      <th className="py-3.5 px-4">Student ID</th>
                      <th className="py-3.5 px-4">Dept</th>
                      <th className="py-3.5 px-4">WhatsApp</th>
                      <th className="py-3.5 px-4">Listings</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Joined</th>
                      <th className="py-3.5 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {filteredSellers.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-xs text-slate-400 font-medium">
                          No sellers found matching the current search filter.
                        </td>
                      </tr>
                    ) : (
                      filteredSellers.map((s) => {
                        const sellerListingsCount = listings.filter(l => l.sellerId === s.id).length;
                        return (
                          <tr
                            key={s.id}
                            onClick={() => setSelectedSeller(s)}
                            className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                          >
                            <td className="py-4 px-6">
                              <div className="font-bold text-slate-900">{s.name}</div>
                              <div className="text-[11px] text-slate-500 font-mono">{s.email}</div>
                            </td>
                            <td className="py-4 px-4 font-mono font-bold text-slate-800">{s.studentId}</td>
                            <td className="py-4 px-4 font-bold text-slate-700">{s.department}</td>
                            <td className="py-4 px-4 font-mono text-xs text-emerald-700 font-bold">{s.whatsapp}</td>
                            <td className="py-4 px-4 font-bold text-slate-800">{sellerListingsCount}</td>
                            <td className="py-4 px-4">
                              <Pill variant={s.status} />
                            </td>
                            <td className="py-4 px-4 text-slate-500 text-xs font-mono">{timeAgo(s.createdAt)}</td>
                            <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center justify-end gap-2">
                                {s.status === 'pending' && (
                                  <>
                                    <Button
                                      size="sm"
                                      variant="primary"
                                      onClick={() => handleApproveSeller(s.id, s.name)}
                                      leftIcon={<Check className="w-3.5 h-3.5 text-emerald-400" />}
                                    >
                                      Approve seller
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="danger"
                                      onClick={() => setBanDialog({ isOpen: true, seller: s })}
                                    >
                                      Reject
                                    </Button>
                                  </>
                                )}

                                {s.status === 'approved' && (
                                  <Button
                                    size="sm"
                                    variant="danger"
                                    onClick={() => setBanDialog({ isOpen: true, seller: s })}
                                    leftIcon={<Ban className="w-3.5 h-3.5" />}
                                  >
                                    Ban account
                                  </Button>
                                )}

                                {s.status === 'banned' && (
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() => handleReinstateSeller(s.id, s.name)}
                                  >
                                    Reinstate
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: LISTINGS TAB */}
          {activeTab === 'listings' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <h2 className="text-base font-bold text-[#0F2C59]">Campus Marketplace Listings</h2>
                <p className="text-xs text-slate-500 font-medium">All active, reserved, sold, and flagged items posted across campus.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3.5 px-6">Thumbnail</th>
                      <th className="py-3.5 px-4">Title</th>
                      <th className="py-3.5 px-4">Seller</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Price (৳)</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Posted</th>
                      <th className="py-3.5 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {filteredListings.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-xs text-slate-400 font-medium">
                          No listings found matching your search.
                        </td>
                      </tr>
                    ) : (
                      filteredListings.map((l) => (
                        <tr key={l.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-4 px-6">
                            <img
                              src={l.images[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=100'}
                              alt={l.title}
                              className="w-12 h-12 rounded-xl object-cover border border-slate-200 bg-slate-100 shrink-0"
                            />
                          </td>
                          <td className="py-4 px-4">
                            <div className="font-bold text-slate-900 max-w-xs truncate" title={l.title}>{l.title}</div>
                            <div className="text-[11px] text-slate-400 font-mono mt-0.5">ID: {l.id} • Spot: {l.meetupSpot}</div>
                            {l.flagged && (
                              <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md border border-red-200">
                                <AlertTriangle className="w-3 h-3" /> Flagged: {l.flagReason}
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-4">
                            <div className="font-bold text-slate-900">{l.sellerName}</div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold capitalize">
                              {l.category}
                            </span>
                          </td>
                          <td className="py-4 px-4 font-bold text-[#0F2C59]">৳{l.priceBDT.toLocaleString()}</td>
                          <td className="py-4 px-4">
                            <Pill variant={l.flagged ? 'flagged' : l.status} />
                          </td>
                          <td className="py-4 px-4 text-xs font-mono text-slate-500">{timeAgo(l.createdAt)}</td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {!l.flagged && (
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => setFlagDialog({ isOpen: true, listing: l })}
                                  leftIcon={<Flag className="w-3.5 h-3.5 text-amber-500" />}
                                >
                                  Flag
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="danger"
                                onClick={() => setDeleteDialog({ isOpen: true, listingId: l.id })}
                                leftIcon={<Trash2 className="w-3.5 h-3.5 text-red-600" />}
                              >
                                Remove listing
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: FLAGGED TAB */}
          {activeTab === 'flagged' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <h2 className="text-base font-bold text-red-700 flex items-center gap-2">
                  <Flag className="w-4 h-4 text-red-600" />
                  <span>Flagged Listings Moderation</span>
                </h2>
                <p className="text-xs text-slate-500 font-medium">Review reports for prohibited items, exam leaks, spam, or misleading info.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3.5 px-6">Item Title</th>
                      <th className="py-3.5 px-4">Flag Reason</th>
                      <th className="py-3.5 px-4">Seller</th>
                      <th className="py-3.5 px-4">Price</th>
                      <th className="py-3.5 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {flaggedListingsList.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-xs text-slate-400 font-medium">
                          No flagged items currently pending moderation.
                        </td>
                      </tr>
                    ) : (
                      flaggedListingsList.map(fl => (
                        <tr key={fl.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-4 px-6">
                            <div className="font-bold text-slate-900">{fl.title}</div>
                            <div className="text-[11px] text-slate-400 font-mono">ID: {fl.id}</div>
                          </td>
                          <td className="py-4 px-4 font-bold text-red-700">
                            {fl.flagReason}
                          </td>
                          <td className="py-4 px-4 font-bold text-slate-800">{fl.sellerName}</td>
                          <td className="py-4 px-4 font-bold text-[#0F2C59]">৳{fl.priceBDT}</td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => handleUnflagListing(fl.id)}
                              >
                                Dismiss Flag
                              </Button>
                              <Button
                                size="sm"
                                variant="danger-solid"
                                onClick={() => setDeleteDialog({ isOpen: true, listingId: fl.id })}
                                leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                              >
                                Remove Listing
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: BANNED TAB */}
          {activeTab === 'banned' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <h2 className="text-base font-bold text-red-700 flex items-center gap-2">
                  <UserX className="w-4 h-4 text-red-600" />
                  <span>Banned Sellers Registry</span>
                </h2>
                <p className="text-xs text-slate-500 font-medium">Accounts suspended from posting or engaging on the campus marketplace.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3.5 px-6">Seller Name</th>
                      <th className="py-3.5 px-4">Email</th>
                      <th className="py-3.5 px-4">Ban Reason</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {bannedSellersList.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-xs text-slate-400 font-medium">
                          No sellers are currently banned.
                        </td>
                      </tr>
                    ) : (
                      bannedSellersList.map(bs => (
                        <tr key={bs.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-4 px-6 font-bold text-slate-900">{bs.name}</td>
                          <td className="py-4 px-4 font-mono text-xs text-slate-600">{bs.email}</td>
                          <td className="py-4 px-4 text-xs font-semibold text-red-700">{bs.banReason || 'Policy violation'}</td>
                          <td className="py-4 px-4">
                            <Pill variant="banned" />
                          </td>
                          <td className="py-4 px-6 text-right">
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => handleReinstateSeller(bs.id, bs.name)}
                            >
                              Reinstate Account
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* RIGHT-SIDE SELLER DETAIL DRAWER */}
      {selectedSeller && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div 
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={() => setSelectedSeller(null)}
          />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl border-l border-slate-200 overflow-y-auto z-10 p-6 flex flex-col justify-between animate-in slide-in-from-right duration-200">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-[#0F2C59]">Seller Details</h3>
                  <p className="text-xs text-slate-500 font-medium">Authenticated EWU Student Profile</p>
                </div>
                <button
                  onClick={() => setSelectedSeller(null)}
                  className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Header Profile Card */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-bold text-slate-900">{selectedSeller.name}</h4>
                    <Pill variant={selectedSeller.status} />
                  </div>
                  <p className="text-xs text-slate-600 font-mono">{selectedSeller.email}</p>
                  <p className="text-xs text-slate-500">
                    Student ID: <strong className="text-slate-800">{selectedSeller.studentId}</strong> • Dept: <strong className="text-slate-800">{selectedSeller.department}</strong>
                  </p>
                </div>

                {/* Contact & Meetups */}
                <div className="space-y-3">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">Contact & Pickup Spot Preferences</h5>
                  
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-white text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">WhatsApp Number</span>
                      <span className="font-mono font-bold text-emerald-700">{selectedSeller.whatsapp}</span>
                    </div>
                    
                    {selectedSeller.facebookUrl && (
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        <span className="text-slate-500 font-medium">Facebook</span>
                        <a href={selectedSeller.facebookUrl} target="_blank" rel="noreferrer" className="text-[#0F2C59] font-bold hover:underline inline-flex items-center gap-1">
                          Profile <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}

                    {selectedSeller.instagramUrl && (
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        <span className="text-slate-500 font-medium">Instagram</span>
                        <a href={selectedSeller.instagramUrl} target="_blank" rel="noreferrer" className="text-[#0F2C59] font-bold hover:underline inline-flex items-center gap-1">
                          Profile <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs">
                    <span className="block text-slate-500 font-medium mb-1.5 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#0F2C59]" /> Meetup Spots:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedSeller.meetupSpots.map(spot => (
                        <span key={spot} className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-800 font-bold">
                          {spot}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Seller's Current Items */}
                <div className="space-y-3">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">Current Seller Items</h5>
                  <div className="space-y-2">
                    {listings.filter(l => l.sellerId === selectedSeller.id).map(l => (
                      <div key={l.id} className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-3 text-xs">
                        <div className="truncate">
                          <p className="font-bold text-slate-900 truncate">{l.title}</p>
                          <p className="text-slate-400 font-mono text-[10px]">৳{l.priceBDT} • {l.category}</p>
                        </div>
                        <Pill variant={l.flagged ? 'flagged' : l.status} />
                      </div>
                    ))}

                    {listings.filter(l => l.sellerId === selectedSeller.id).length === 0 && (
                      <p className="text-xs text-slate-400 font-medium py-2">No active items posted by this seller.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions inside drawer */}
            <div className="pt-6 border-t border-slate-100 flex items-center gap-2">
              {selectedSeller.status === 'pending' && (
                <Button
                  className="w-full"
                  variant="primary"
                  onClick={() => handleApproveSeller(selectedSeller.id, selectedSeller.name)}
                  leftIcon={<Check className="w-4 h-4 text-emerald-400" />}
                >
                  Approve seller
                </Button>
              )}

              {selectedSeller.status === 'approved' && (
                <Button
                  className="w-full"
                  variant="danger"
                  onClick={() => setBanDialog({ isOpen: true, seller: selectedSeller })}
                  leftIcon={<Ban className="w-4 h-4" />}
                >
                  Ban account
                </Button>
              )}

              {selectedSeller.status === 'banned' && (
                <Button
                  className="w-full"
                  variant="secondary"
                  onClick={() => handleReinstateSeller(selectedSeller.id, selectedSeller.name)}
                >
                  Reinstate account
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM BAN DIALOG */}
      <ConfirmDialog
        isOpen={banDialog.isOpen}
        onClose={() => setBanDialog({ isOpen: false, seller: null })}
        onConfirm={handleConfirmBanSeller}
        title={`Ban Seller: ${banDialog.seller?.name || ''}`}
        message="Are you sure you want to ban this seller? Their account will be suspended and all listings hidden from the campus feed."
        confirmLabel="Ban Account"
        variant="danger"
        requireReason={true}
        reasonPlaceholder="e.g. Prohibited item violation, counterfeit item report, non-student identity..."
      />

      {/* CONFIRM DELETE LISTING DIALOG */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, listingId: null })}
        onConfirm={handleConfirmDeleteListing}
        title="Remove Listing"
        message="Are you sure you want to permanently delete this listing from EWmart? This action cannot be undone."
        confirmLabel="Remove Listing"
        variant="danger"
      />

      {/* FLAG LISTING MODAL DIALOG */}
      <Modal
        isOpen={flagDialog.isOpen}
        onClose={() => setFlagDialog({ isOpen: false, listing: null })}
        title="Flag Listing"
        subtitle="Select a violation reason to flag and hide this item from the public marketplace feed."
        maxWidth="md"
      >
        <div className="space-y-4">
          <Select
            label="Violation Reason"
            options={[
              { value: 'Prohibited item', label: 'Prohibited item (Drugs, tobacco, weapons)' },
              { value: 'Exam material', label: 'Academic integrity (Exam paper or leak)' },
              { value: 'Misleading', label: 'Misleading information or fake product' },
              { value: 'Spam', label: 'Commercial spam or duplicate posting' },
              { value: 'Other', label: 'Other policy breach' },
            ]}
            value={flagReasonCategory}
            onChange={(e) => setFlagReasonCategory(e.target.value)}
          />

          <Textarea
            label="Moderator Note (Optional)"
            placeholder="Add specific context or student report notes..."
            value={flagReasonNote}
            onChange={(e) => setFlagReasonNote(e.target.value)}
            rows={3}
          />

          <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setFlagDialog({ isOpen: false, listing: null })}
            >
              Cancel
            </Button>
            <Button
              variant="danger-solid"
              size="sm"
              onClick={handleConfirmFlagListing}
            >
              Flag Listing
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default AdminDashboard;
