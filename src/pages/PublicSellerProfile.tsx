import React, { useState, useEffect } from 'react';
import type { Seller, Listing } from '../types/ewmart';
import { getSellers, getListingsBySeller } from '../lib/store';
import ListingCard from '../components/ui/ListingCard';
import EmptyState from '../components/ui/EmptyState';
import { 
  BadgeCheck, 
  MapPin, 
  MessageCircle, 
  ExternalLink, 
  ArrowLeft, 
  Package,
  GraduationCap
} from 'lucide-react';

export interface PublicSellerProfileProps {
  sellerId: string;
  onNavigateHome: () => void;
}

export const PublicSellerProfile: React.FC<PublicSellerProfileProps> = ({
  sellerId,
  onNavigateHome,
}) => {
  const [seller, setSeller] = useState<Seller | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sellers = await getSellers();
        const foundSeller = sellers.find((s) => s.id === sellerId);
        if (foundSeller) {
          setSeller(foundSeller);
          const sellerListings = await getListingsBySeller(foundSeller.id);
          // Show non-flagged available or reserved items for public profile
          setListings(sellerListings.filter((l) => !l.flagged));
        } else {
          setSeller(null);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [sellerId]);

  const formatWhatsappLink = (phone: string) => {
    const cleanDigits = phone.replace(/\D/g, '');
    return `https://wa.me/${cleanDigits}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="w-8 h-8 border-3 border-[#0F2C59] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!seller) {
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
            title="Seller Profile Not Found"
            description="The requested EWU seller profile does not exist or has been removed."
            actionLabel="Back to marketplace"
            onAction={onNavigateHome}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased selection:bg-[#00A86B] selection:text-white flex flex-col justify-between">
      
      {/* Top Navigation */}
      <header className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-3.5 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#0F2C59] bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Marketplace</span>
          </button>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Verified Campus Seller
          </span>
        </div>
      </header>

      {/* Main Content Body */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 space-y-8">
        
        {/* Top Header Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#0F2C59] tracking-tight">
                {seller.name}
              </h1>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
                <BadgeCheck className="w-4 h-4 text-[#00A86B] shrink-0" />
                <span>@ewubd.edu verified</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 flex-wrap">
              <span className="flex items-center gap-1">
                <GraduationCap className="w-4 h-4 text-[#0F2C59]" />
                {seller.department} Department
              </span>
              <span>•</span>
              <span>EWU Student ID: <strong className="font-mono text-slate-800">{seller.studentId}</strong></span>
            </div>

            {seller.bio && (
              <p className="text-xs text-slate-600 leading-relaxed font-normal bg-slate-50 p-3.5 rounded-xl border border-slate-100 max-w-xl">
                {seller.bio}
              </p>
            )}

            {/* Preferred Meetup Spots */}
            {seller.meetupSpots && seller.meetupSpots.length > 0 && (
              <div className="pt-2 flex items-center gap-2 flex-wrap text-xs">
                <span className="font-bold text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#00A86B]" /> Preferred Handover Spots:
                </span>
                {seller.meetupSpots.map((spot) => (
                  <span key={spot} className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-lg text-slate-800 font-bold text-[11px]">
                    {spot}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Right Action: WhatsApp & Socials */}
          <div className="flex flex-col sm:flex-row md:flex-col items-stretch gap-3 shrink-0 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
            <a
              href={formatWhatsappLink(seller.whatsapp)}
              target="_blank"
              rel="noreferrer"
              className="bg-[#00A86B] hover:bg-emerald-600 text-white font-bold px-6 py-3.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 text-sm text-center"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Message on WhatsApp</span>
            </a>

            <div className="flex items-center gap-2">
              {seller.facebookUrl && (
                <a
                  href={seller.facebookUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold text-center inline-flex items-center justify-center gap-1"
                >
                  <span>Facebook</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}

              {seller.instagramUrl && (
                <a
                  href={seller.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold text-center inline-flex items-center justify-center gap-1"
                >
                  <span>Instagram</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Listings Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-xl font-bold text-[#0F2C59] tracking-tight">
                Active Listings by {seller.name}
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Browse available textbooks, electronics, and services posted by this seller.
              </p>
            </div>
            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              {listings.length} items
            </span>
          </div>

          {listings.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center shadow-xs">
              <EmptyState
                icon={Package}
                title="No active listings"
                description="This seller currently has no available items listed on the marketplace."
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {listings.map((item) => (
                <ListingCard
                  key={item.id}
                  listing={item}
                  showSellerInfo={false}
                />
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default PublicSellerProfile;
