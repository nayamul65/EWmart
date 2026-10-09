import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, Ban, Tag } from 'lucide-react';

export type PillVariant = 'approved' | 'pending' | 'banned' | 'available' | 'reserved' | 'sold' | 'flagged';

export interface PillProps {
  variant: PillVariant;
  label?: string;
  className?: string;
}

export const Pill: React.FC<PillProps> = ({ variant, label, className = '' }) => {
  switch (variant) {
    case 'approved':
    case 'available':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 ${className}`}>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>{label || (variant === 'approved' ? 'Approved' : 'Available')}</span>
        </span>
      );
    case 'pending':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 ${className}`}>
          <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>{label || 'Pending Approval'}</span>
        </span>
      );
    case 'reserved':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 ${className}`}>
          <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span>{label || 'Reserved'}</span>
        </span>
      );
    case 'sold':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200 ${className}`}>
          <Tag className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span>{label || 'Sold'}</span>
        </span>
      );
    case 'flagged':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200 ${className}`}>
          <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0" />
          <span>{label || 'Flagged'}</span>
        </span>
      );
    case 'banned':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-300 ${className}`}>
          <Ban className="w-3.5 h-3.5 text-red-700 shrink-0" />
          <span>{label || 'Banned'}</span>
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 ${className}`}>
          {label}
        </span>
      );
  }
};

export default Pill;
