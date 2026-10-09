import React, { useState, useEffect } from 'react';
import type { Seller, Listing, ListingStatus } from '../types/ewmart';
import { 
  getSellers, 
  getListingsBySeller, 
  setListingStatus, 
  deleteListing, 
  createListing,
  getCurrentSellerId 
} from '../lib/store';
import { timeAgo } from '../lib/time';
import Button from '../components/ui/Button';
import Pill from '../components/ui/Pill';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import ComposerPanel from '../components/composer/ComposerPanel';
import EmptyState from '../components/ui/EmptyState';
import { 
  Clock, 
  UserX, 
  Plus, 
  MapPin, 
  MoreVertical, 
  BadgeCheck, 
  ShieldAlert, 
  ExternalLink, 
  Package, 
  RotateCcw, 
  Trash2, 
  Edit3, 
  Copy, 
  ArrowLeft
} from 'lucide-react';

export interface SellerStudioProps {
  onNavigateHome: () => void;
  onNavigateSellerProfile: (sellerId: string) => void;
  onOpenRegisterModal: () => void;
  onOpenSafetyPolicyModal: () => void;
}

export const SellerStudio: React.FC<SellerStudioProps> = ({
  onNavigateHome,
  onNavigateSellerProfile,
  onOpenRegisterModal,
  onOpenSafetyPolicyModal,
}) => {
  const [currentSeller, setCurrentSeller] = useState<Seller | null>(null);
  const [sellerListings, setSellerListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Sorting
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'reserved' | 'sold'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc'>('newest');

  // Composer Panel state
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);

  // Kebab Menu State
  const [openKebabId, setOpenKebabId] = useState<string | null>(null);

  // Delete Dialog state
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; listingId: string | null }>({
    isOpen: false,
    listingId: null,
  });

  // Undo Toast state
  const [undoToast, setUndoToast] = useState<{
    message: string;
    listingId: string;
    previousStatus: ListingStatus;
  } | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const refreshData = async () => {
    try {
      const sellers = await getSellers();
      let sellerId = getCurrentSellerId();

      let activeSeller: Seller | undefined;

      if (sellerId) {
        activeSeller = sellers.find((s) => s.id === sellerId);
      }

      // Fallback for demonstration if no current seller stored
      if (!activeSeller && sellers.length > 0) {
        activeSeller = sellers.find((s) => s.status === 'approved') || sellers[0];
      }

      if (activeSeller) {
        setCurrentSeller(activeSeller);
        const listings = await getListingsBySeller(activeSeller.id);
        setSellerListings(listings);
      } else {
        setCurrentSeller(null);
        setSellerListings([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Status toggle with 6-second Undo
  const handleStatusToggle = async (listing: Listing, newStatus: ListingStatus) => {
    const previousStatus = listing.status;
    await setListingStatus(listing.id, newStatus);
    refreshData();

    setUndoToast({
      message: `Marked "${listing.title.substring(0, 24)}..." as ${newStatus}`,
      listingId: listing.id,
      previousStatus,
    });

    setTimeout(() => {
      setUndoToast(null);
    }, 6000);
  };

  const handleUndoStatus = async () => {
    if (!undoToast) return;
    await setListingStatus(undoToast.listingId, undoToast.previousStatus);
    showToast(`Reverted status back to ${undoToast.previousStatus}`);
    setUndoToast(null);
    refreshData();
  };

  const handleDuplicate = async (listing: Listing) => {
    if (!currentSeller) return;
    await createListing({
      sellerId: currentSeller.id,
      sellerName: currentSeller.name,
      sellerWhatsapp: currentSeller.whatsapp,
      title: `${listing.title} (Copy)`,
      description: listing.description,
      priceBDT: listing.priceBDT,
      category: listing.category,
      condition: listing.condition,
      images: listing.images,
      meetupSpot: listing.meetupSpot,
    });
    showToast(`Duplicated listing "${listing.title}"`);
    setOpenKebabId(null);
    refreshData();
  };

  const handleConfirmDelete = async () => {
    if (!deleteDialog.listingId) return;
    await deleteListing(deleteDialog.listingId);
    showToast('Listing permanently deleted');
    setDeleteDialog({ isOpen: false, listingId: null });
    refreshData();
  };

  const handleComposerSuccess = (_savedListing: Listing, isEdit: boolean) => {
    showToast(isEdit ? 'Listing updated successfully' : 'Listing is live on EWmart marketplace!');
    refreshData();
  };

  // Filtering & Sorting
  const filteredListings = sellerListings.filter((l) => {
    if (statusFilter === 'all') return true;
    return l.status === statusFilter;
  });

  const sortedListings = [...filteredListings].sort((a, b) => {
    if (sortBy === 'newest') return b.createdAt - a.createdAt;
    if (sortBy === 'price-asc') return a.priceBDT - b.priceBDT;
    if (sortBy === 'price-desc') return b.priceBDT - a.priceBDT;
    return 0;
  });

  // Calculate seller stats
  const activeCount = sellerListings.filter((l) => l.status === 'available').length;
  const reservedCount = sellerListings.filter((l) => l.status === 'reserved').length;
  const soldCount = sellerListings.filter((l) => l.status === 'sold').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="w-8 h-8 border-3 border-[#0F2C59] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // STATUS GATING CONDITION 1: No Current Seller
  if (!currentSeller) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans">
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <button
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#0F2C59] bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Marketplace</span>
          </button>
        </header>

        <div className="max-w-md mx-auto my-auto p-8 bg-white rounded-3xl border border-slate-200 shadow-sm text-center">
          <EmptyState
            icon={Package}
            title="Register as a seller to start posting"
            description="You need a verified @ewubd.edu student seller profile to post items on the EWmart campus marketplace."
            actionLabel="Register as Seller"
            onAction={onOpenRegisterModal}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased selection:bg-[#00A86B] selection:text-white flex flex-col justify-between">
      
      {/* Toast Notifications */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#0F2C59] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-400/50 animate-in fade-in">
          <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* 6-Second Undo Toast */}
      {undoToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in slide-in-from-bottom-4">
          <span className="text-xs font-medium">{undoToast.message}</span>
          <button
            onClick={handleUndoStatus}
            className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Undo</span>
          </button>
        </div>
      )}

      {/* Header Navigation Bar */}
      <header className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-3.5 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateHome}
              className="inline-flex items-center gap-2 text-xs font-bold text-[#0F2C59] bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Marketplace</span>
            </button>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider hidden sm:inline">
              Seller Studio
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
              {currentSeller.name} ({currentSeller.department})
            </span>
          </div>
        </div>
      </header>

      {/* Workspace Body Container */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        
        {/* STATUS GATING BANNERS */}

        {/* STATUS GATING 2: Pending Approval */}
        {currentSeller.status === 'pending' && (
          <div className="bg-[#FEF3C7] border-l-4 border-[#D97706] p-4 rounded-r-xl mb-6 shadow-xs flex items-start gap-3">
            <Clock className="w-5 h-5 text-[#D97706] shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-amber-950">Account Pending Approval</h3>
              <p className="text-xs text-amber-900 mt-0.5 font-medium leading-relaxed">
                Your seller account is waiting for EWU Admin review. You can draft items now, but they will go live once approved.
              </p>
            </div>
          </div>
        )}

        {/* STATUS GATING 3: Banned Account */}
        {currentSeller.status === 'banned' && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl mb-6 shadow-xs flex items-start gap-3">
            <UserX className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-red-900">Account Banned</h3>
              <p className="text-xs text-red-800 mt-0.5 font-medium leading-relaxed">
                Your seller privileges have been revoked by EWU Admin due to policy violations.
              </p>
            </div>
          </div>
        )}

        {/* Desktop 2-Column Layout (8/12 Main, 4/12 Sticky Sidebar) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* MAIN COLUMN (8/12) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  SELLER STUDIO
                </span>
                <h1 className="text-2xl font-bold text-[#0F2C59] tracking-tight">
                  Your listings
                </h1>
              </div>

              {currentSeller.status !== 'banned' && (
                <Button
                  variant="primary"
                  onClick={() => {
                    setEditingListing(null);
                    setIsComposerOpen(true);
                  }}
                  leftIcon={<Plus className="w-4 h-4 text-emerald-400" />}
                >
                  Post an item
                </Button>
              )}
            </div>

            {/* Filter & Sort Control Row */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
              {/* Segmented Tab Control */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl w-full sm:w-auto text-xs font-bold">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    statusFilter === 'all' ? 'bg-white text-[#0F2C59] shadow-xs' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  All ({sellerListings.length})
                </button>
                <button
                  onClick={() => setStatusFilter('available')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    statusFilter === 'available' ? 'bg-white text-[#0F2C59] shadow-xs' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Available ({activeCount})
                </button>
                <button
                  onClick={() => setStatusFilter('reserved')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    statusFilter === 'reserved' ? 'bg-white text-[#0F2C59] shadow-xs' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Reserved ({reservedCount})
                </button>
                <button
                  onClick={() => setStatusFilter('sold')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    statusFilter === 'sold' ? 'bg-white text-[#0F2C59] shadow-xs' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Sold ({soldCount})
                </button>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 w-full sm:w-auto justify-end">
                <span>Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="newest">Newest first</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Listing Manager (Dense Compact Horizontal Rows) */}
            {sortedListings.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-xs">
                <EmptyState
                  icon={Package}
                  title="No listings yet"
                  description="Start selling your textbooks, lab gear, calculators, or campus services to fellow EWU students."
                  actionLabel={currentSeller.status !== 'banned' ? 'Post your first item' : undefined}
                  onAction={() => {
                    setEditingListing(null);
                    setIsComposerOpen(true);
                  }}
                />
              </div>
            ) : (
              <div className="space-y-3">
                {sortedListings.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative"
                  >
                    {/* Left: Thumbnail & Main Details */}
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                      <img
                        src={item.images[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=120'}
                        alt={item.title}
                        className="w-[72px] h-[72px] rounded-xl object-cover border border-slate-200 bg-slate-100 shrink-0"
                      />

                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-[#0F2C59] text-sm sm:text-base truncate" title={item.title}>
                            {item.title}
                          </h3>
                          <Pill variant={item.flagged ? 'flagged' : item.status} />
                        </div>

                        <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                          <span className="font-bold text-slate-900 text-sm">৳{item.priceBDT.toLocaleString()}</span>
                          <span>•</span>
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 font-semibold text-slate-700 capitalize text-[11px]">
                            {item.category}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1 font-medium text-slate-600 text-[11px]">
                            <MapPin className="w-3 h-3 text-[#00A86B]" />
                            {item.meetupSpot}
                          </span>
                          <span>•</span>
                          <span className="text-[10px] font-mono text-slate-400">{timeAgo(item.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Inline Row Actions */}
                    <div className="flex items-center gap-2 shrink-0 justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                      
                      {/* Quick Toggle Buttons */}
                      {item.status !== 'reserved' && (
                        <button
                          onClick={() => handleStatusToggle(item, 'reserved')}
                          className="px-2.5 py-1.5 rounded-lg border border-amber-300 text-amber-800 bg-amber-50 hover:bg-amber-100 text-xs font-bold transition-colors cursor-pointer"
                        >
                          Mark reserved
                        </button>
                      )}

                      {item.status !== 'sold' && (
                        <button
                          onClick={() => handleStatusToggle(item, 'sold')}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-slate-700 bg-slate-50 hover:bg-slate-100 text-xs font-bold transition-colors cursor-pointer"
                        >
                          Mark sold
                        </button>
                      )}

                      {item.status !== 'available' && (
                        <button
                          onClick={() => handleStatusToggle(item, 'available')}
                          className="px-2.5 py-1.5 rounded-lg border border-emerald-300 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 text-xs font-bold transition-colors cursor-pointer"
                        >
                          Mark available
                        </button>
                      )}

                      {/* Kebab Menu Dropdown */}
                      <div className="relative">
                        <button
                          onClick={() => setOpenKebabId(openKebabId === item.id ? null : item.id)}
                          className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                          aria-label="More actions"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {openKebabId === item.id && (
                          <div className="absolute right-0 top-10 w-44 bg-white rounded-2xl shadow-xl border border-slate-200 py-1 z-30 animate-in fade-in zoom-in-95">
                            <button
                              onClick={() => {
                                setEditingListing(item);
                                setIsComposerOpen(true);
                                setOpenKebabId(null);
                              }}
                              className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-[#0F2C59]" />
                              <span>Edit listing</span>
                            </button>

                            <button
                              onClick={() => handleDuplicate(item)}
                              className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                            >
                              <Copy className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Duplicate</span>
                            </button>

                            <button
                              onClick={() => {
                                setDeleteDialog({ isOpen: true, listingId: item.id });
                                setOpenKebabId(null);
                              }}
                              className="w-full px-4 py-2 text-left text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer border-t border-slate-100 mt-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>

          {/* STICKY RIGHT SIDEBAR (4/12) */}
          <div className="lg:col-span-4 space-y-6 sticky top-24">
            
            {/* 1. Seller Profile Summary Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">{currentSeller.name}</h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">{currentSeller.email}</p>
                <p className="text-xs text-slate-600 mt-1 font-semibold">
                  {currentSeller.department} • Student ID: <span className="font-mono text-slate-800">{currentSeller.studentId}</span>
                </p>
              </div>

              {/* Verified badge line */}
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
                <BadgeCheck className="w-4 h-4 text-[#00A86B] shrink-0" />
                <span>@ewubd.edu verified student seller</span>
              </div>

              {/* WhatsApp & Social Buttons */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">WhatsApp Contact</span>
                  <span className="font-mono font-bold text-emerald-700">{currentSeller.whatsapp}</span>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  {currentSeller.facebookUrl && (
                    <a
                      href={currentSeller.facebookUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold inline-flex items-center gap-1"
                    >
                      <span>Facebook</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {currentSeller.instagramUrl && (
                    <a
                      href={currentSeller.instagramUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold inline-flex items-center gap-1"
                    >
                      <span>Instagram</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* 2. Mini Performance Stats */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Listing Overview
              </p>
              <div className="grid grid-cols-3 divide-x divide-slate-200 text-center">
                <div>
                  <span className="text-xl font-black text-[#0F2C59] block">{activeCount}</span>
                  <span className="text-[11px] font-semibold text-slate-500">Active</span>
                </div>
                <div>
                  <span className="text-xl font-black text-amber-600 block">{reservedCount}</span>
                  <span className="text-[11px] font-semibold text-slate-500">Reserved</span>
                </div>
                <div>
                  <span className="text-xl font-black text-slate-700 block">{soldCount}</span>
                  <span className="text-[11px] font-semibold text-slate-500">Sold</span>
                </div>
              </div>
            </div>

            {/* 3. Public Profile Link */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => onNavigateSellerProfile(currentSeller.id)}
                rightIcon={<ExternalLink className="w-4 h-4 text-[#0F2C59]" />}
              >
                Preview your public profile
              </Button>
            </div>

            {/* 4. Safety Policy Reminder Card */}
            <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-2xl text-xs space-y-2">
              <div className="flex items-center gap-2 text-amber-900 font-bold">
                <ShieldAlert className="w-4 h-4 text-[#D97706] shrink-0" />
                <span>EWmart Safety Policy</span>
              </div>
              <p className="text-amber-950 font-medium leading-relaxed">
                Remember: Prohibited items (drugs, leaked exam papers, weapons, stolen goods) result in immediate account ban.
              </p>
              <button
                onClick={onOpenSafetyPolicyModal}
                className="text-xs font-bold text-[#D97706] hover:underline cursor-pointer pt-1 block"
              >
                Review safety guidelines
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* COMPOSER SLIDE-OVER PANEL */}
      <ComposerPanel
        isOpen={isComposerOpen}
        onClose={() => setIsComposerOpen(false)}
        seller={currentSeller}
        editingListing={editingListing}
        onSuccess={handleComposerSuccess}
      />

      {/* CONFIRM DELETE DIALOG */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, listingId: null })}
        onConfirm={handleConfirmDelete}
        title="Delete Listing"
        message="Are you sure you want to delete this listing from your studio? It will be permanently removed from EWmart."
        confirmLabel="Delete"
        variant="danger"
      />

    </div>
  );
};

export default SellerStudio;
