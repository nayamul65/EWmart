import React from 'react';
import type { Listing } from '../../types/ewmart';
import { timeAgo } from '../../lib/time';
import Pill from './Pill';
import { 
  MapPin, 
  BookOpen, 
  Utensils, 
  Laptop, 
  Shirt, 
  Briefcase, 
  Package, 
  MessageCircle, 
  Clock 
} from 'lucide-react';

export interface ListingCardProps {
  listing: Listing;
  onCardClick?: () => void;
  showSellerInfo?: boolean;
}

export const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'textbooks':
      return <BookOpen className="w-3.5 h-3.5 text-blue-600" />;
    case 'cafeteria':
    case 'cafeteria food':
      return <Utensils className="w-3.5 h-3.5 text-amber-600" />;
    case 'electronics':
      return <Laptop className="w-3.5 h-3.5 text-purple-600" />;
    case 'thrift':
      return <Shirt className="w-3.5 h-3.5 text-emerald-600" />;
    case 'services':
    case 'campus services':
      return <Briefcase className="w-3.5 h-3.5 text-teal-600" />;
    default:
      return <Package className="w-3.5 h-3.5 text-slate-600" />;
  }
};

export const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  onCardClick,
  showSellerInfo = true,
}) => {
  const primaryImage = listing.images && listing.images.length > 0
    ? listing.images[0]
    : 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80';

  const formatWhatsappLink = (phone: string) => {
    const cleanDigits = phone.replace(/\D/g, '');
    return `https://wa.me/${cleanDigits}`;
  };

  return (
    <div
      onClick={onCardClick}
      className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group cursor-pointer"
    >
      <div>
        {/* Image Container */}
        <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden">
          <img
            src={primaryImage}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/95 text-slate-800 shadow-xs border border-slate-200/80 backdrop-blur-xs">
              {listing.condition}
            </span>

            {listing.status !== 'available' && (
              <Pill variant={listing.status} />
            )}
          </div>

          {/* Category Tag at bottom left of image */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/95 text-slate-800 text-[11px] font-bold shadow-xs backdrop-blur-xs border border-slate-200/80">
            {getCategoryIcon(listing.category)}
            <span className="capitalize">{listing.category}</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-2">
          <h3 className="font-bold text-[#0F2C59] text-base leading-snug line-clamp-2 group-hover:text-emerald-700 transition-colors">
            {listing.title}
          </h3>

          <p className="text-xs text-slate-500 font-normal line-clamp-2 leading-relaxed">
            {listing.description}
          </p>

          <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
            <span className="font-bold text-lg text-[#0F2C59]">
              ৳{listing.priceBDT.toLocaleString()}
            </span>

            <div className="flex items-center gap-1 text-slate-500 font-medium">
              <MapPin className="w-3.5 h-3.5 text-[#00A86B] shrink-0" />
              <span>{listing.meetupSpot}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-4 py-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs">
        {showSellerInfo ? (
          <div className="flex items-center gap-2 truncate">
            <div className="w-6 h-6 rounded-full bg-[#0F2C59] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
              {listing.sellerName ? listing.sellerName.substring(0, 2).toUpperCase() : 'EW'}
            </div>
            <span className="font-bold text-slate-800 truncate">{listing.sellerName}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-slate-400 font-medium">
            <Clock className="w-3.5 h-3.5 shrink-0" />
            <span className="font-mono text-[10px]">{timeAgo(listing.createdAt)}</span>
          </div>
        )}

        {listing.sellerWhatsapp ? (
          <a
            href={formatWhatsappLink(listing.sellerWhatsapp)}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-[#00A86B] text-[#00A86B] hover:text-white border border-emerald-200/80 text-xs font-bold transition-all shrink-0"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Chat</span>
          </a>
        ) : (
          <span className="font-mono text-[10px] text-slate-400 font-bold">{timeAgo(listing.createdAt)}</span>
        )}
      </div>
    </div>
  );
};

export default ListingCard;
