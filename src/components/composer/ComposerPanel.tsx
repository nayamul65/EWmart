import React, { useState, useEffect } from 'react';
import type { Listing, Seller, ListingCategory, ListingCondition } from '../../types/ewmart';
import { uploadImage } from '../../lib/upload';
import { createListing, updateListing } from '../../lib/store';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import ListingCard from '../ui/ListingCard';
import { 
  X, 
  Upload, 
  MapPin, 
  BookOpen, 
  Utensils, 
  Laptop, 
  Shirt, 
  Briefcase, 
  Phone, 
  Eye, 
  ArrowUp,
  ArrowDown
} from 'lucide-react';

export interface ComposerPanelProps {
  isOpen: boolean;
  onClose: () => void;
  seller: Seller;
  editingListing?: Listing | null;
  onSuccess: (listing: Listing, isEdit: boolean) => void;
}

const CATEGORIES: { value: ListingCategory; label: string; icon: React.FC<{ className?: string }> }[] = [
  { value: 'textbooks', label: 'Textbooks', icon: BookOpen },
  { value: 'cafeteria', label: 'Cafeteria Food', icon: Utensils },
  { value: 'electronics', label: 'Electronics', icon: Laptop },
  { value: 'thrift', label: 'Thrift', icon: Shirt },
  { value: 'services', label: 'Campus Services', icon: Briefcase },
];

export const ComposerPanel: React.FC<ComposerPanelProps> = ({
  isOpen,
  onClose,
  seller,
  editingListing,
  onSuccess,
}) => {
  const [images, setImages] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ListingCategory>('textbooks');
  const [condition, setCondition] = useState<ListingCondition>('Used');
  const [priceBDT, setPriceBDT] = useState<string>('');
  const [description, setDescription] = useState('');
  const [meetupSpot, setMeetupSpot] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Available meetup spots (strictly seller's saved spots or default campus spots)
  const availableSpots = seller.meetupSpots && seller.meetupSpots.length > 0
    ? seller.meetupSpots
    : ['Library', 'Cafeteria', 'Ground Floor Plaza', 'Gate 2', 'Main Gate'];

  useEffect(() => {
    if (editingListing) {
      setImages(editingListing.images || []);
      setTitle(editingListing.title || '');
      setCategory(editingListing.category || 'textbooks');
      setCondition(editingListing.condition || 'Used');
      setPriceBDT(editingListing.priceBDT ? String(editingListing.priceBDT) : '');
      setDescription(editingListing.description || '');
      setMeetupSpot(editingListing.meetupSpot || availableSpots[0]);
    } else {
      setImages([]);
      setTitle('');
      setCategory('textbooks');
      setCondition('Used');
      setPriceBDT('');
      setDescription('');
      setMeetupSpot(availableSpots[0] || 'Library');
    }
    setError(null);
  }, [editingListing, isOpen]);

  // Adjust condition if category changes from Textbooks and current condition is 'New print'
  useEffect(() => {
    if (category !== 'textbooks' && condition === 'New print') {
      setCondition('Used');
    }
  }, [category, condition]);

  if (!isOpen) return null;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > 5) {
      setError('You can upload up to 5 images per listing.');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const url = await uploadImage(files[i]);
        uploadedUrls.push(url);
      }
      setImages((prev) => [...prev, ...uploadedUrls]);
    } catch (err) {
      console.error(err);
      setError('Failed to process image file.');
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= images.length) return;
    const newImgs = [...images];
    const temp = newImgs[index];
    newImgs[index] = newImgs[newIdx];
    newImgs[newIdx] = temp;
    setImages(newImgs);
  };

  const parsePrice = (): number => {
    const cleaned = priceBDT.replace(/[^0-9.]/g, '');
    return parseFloat(cleaned) || 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (seller.status === 'pending') {
      setError('Your seller account is pending approval by EWU Admin. You cannot publish live items yet.');
      return;
    }

    if (!title.trim()) {
      setError('Please enter an item title.');
      return;
    }

    const numericPrice = parsePrice();
    if (numericPrice <= 0) {
      setError('Please enter a valid price in BDT (৳).');
      return;
    }

    if (!meetupSpot) {
      setError('Please select a campus meetup location.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const defaultImage = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80';
      const finalImages = images.length > 0 ? images : [defaultImage];

      let savedListing: Listing;

      if (editingListing) {
        savedListing = await updateListing(editingListing.id, {
          title: title.trim(),
          description: description.trim(),
          priceBDT: numericPrice,
          category,
          condition,
          images: finalImages,
          meetupSpot,
        });
        onSuccess(savedListing, true);
      } else {
        savedListing = await createListing({
          sellerId: seller.id,
          sellerName: seller.name,
          sellerWhatsapp: seller.whatsapp,
          title: title.trim(),
          description: description.trim(),
          priceBDT: numericPrice,
          category,
          condition,
          images: finalImages,
          meetupSpot,
        });
        onSuccess(savedListing, false);
      }

      onClose();
    } catch (err) {
      console.error(err);
      setError('Failed to save listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Preview dummy listing structure for live preview
  const previewListing: Listing = {
    id: editingListing ? editingListing.id : 'preview_id',
    sellerId: seller.id,
    sellerName: seller.name,
    sellerWhatsapp: seller.whatsapp,
    title: title.trim() || 'Item title preview',
    description: description.trim() || 'Detailed description will appear here on the public listing card.',
    priceBDT: parsePrice() || 0,
    category,
    condition,
    images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80'],
    meetupSpot: meetupSpot || 'Library',
    status: 'available',
    flagged: false,
    createdAt: Date.now(),
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end overflow-hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <div className="relative w-full max-w-xl bg-white h-full shadow-2xl border-l border-slate-200 overflow-y-auto z-10 flex flex-col justify-between animate-in slide-in-from-right duration-200">
        
        {/* Panel Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-20 shadow-xs">
          <div>
            <h2 className="text-lg font-bold text-[#0F2C59] tracking-tight">
              {editingListing ? 'Edit Listing' : 'Post an Item'}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Create a clear campus listing for EWU buyers.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Panel Form Body */}
        <form id="composer-form" onSubmit={handleSubmit} className="p-6 space-y-6 flex-1">
          
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* 1. Photo Uploader */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-700">
                Item Photos <span className="text-slate-400 font-normal">(1 to 5 images)</span>
              </label>
              <span className="text-[11px] font-semibold text-slate-400">
                {images.length}/5 uploaded
              </span>
            </div>

            {/* Dropzone */}
            {images.length < 5 && (
              <label className="border-2 border-dashed border-slate-200 hover:border-[#0F2C59] bg-slate-50/60 hover:bg-slate-100/60 p-5 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  disabled={isUploading}
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Upload className="w-6 h-6 text-[#0F2C59] mb-2" />
                <span className="text-xs font-bold text-[#0F2C59]">
                  {isUploading ? 'Uploading image...' : 'Click to select photos'}
                </span>
                <span className="text-[11px] text-slate-400 mt-0.5">
                  JPG, PNG, or WEBP up to 5MB
                </span>
              </label>
            )}

            {/* Photo Thumbnails */}
            {images.length > 0 && (
              <div className="grid grid-cols-5 gap-2 pt-2">
                {images.map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-xl border border-slate-200 overflow-hidden bg-slate-100 group">
                    <img src={img} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />
                    
                    {/* Cover badge on 1st image */}
                    {idx === 0 && (
                      <span className="absolute top-1 left-1 bg-[#0F2C59] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-xs">
                        Cover
                      </span>
                    )}

                    {/* Delete & Reorder Buttons Overlay */}
                    <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 p-1">
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="p-1 rounded-full bg-red-600 text-white hover:bg-red-700 cursor-pointer"
                        title="Remove image"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <div className="flex items-center gap-1">
                        {idx > 0 && (
                          <button
                            type="button"
                            onClick={() => moveImage(idx, 'up')}
                            className="p-1 rounded-full bg-white/80 text-slate-800 hover:bg-white cursor-pointer"
                            title="Move left"
                          >
                            <ArrowUp className="w-2.5 h-2.5 -rotate-90" />
                          </button>
                        )}
                        {idx < images.length - 1 && (
                          <button
                            type="button"
                            onClick={() => moveImage(idx, 'down')}
                            className="p-1 rounded-full bg-white/80 text-slate-800 hover:bg-white cursor-pointer"
                            title="Move right"
                          >
                            <ArrowDown className="w-2.5 h-2.5 -rotate-90" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 2. Item Title */}
          <div>
            <Input
              label="Item Title"
              placeholder="e.g. CSE207 Data Structures Textbook (Like New)"
              value={title}
              onChange={(e) => {
                if (e.target.value.length <= 60) {
                  setTitle(e.target.value);
                }
              }}
              required
              helperText={`${title.length}/60 characters max`}
            />
          </div>

          {/* 3. Category Dropdown */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Category <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => {
                const IconComponent = cat.icon;
                const isSelected = category === cat.value;
                return (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setCategory(cat.value)}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#0F2C59] border-[#0F2C59] text-white shadow-xs'
                        : 'bg-slate-50/60 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <IconComponent className={`w-4 h-4 shrink-0 ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`} />
                    <span className="text-xs font-bold truncate">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Condition Segmented Control */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Item Condition <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1 rounded-xl">
              {(['New', 'Used', 'New print'] as const).map((cond) => {
                const isNewPrintDisabled = cond === 'New print' && category !== 'textbooks';
                const isSelected = condition === cond;
                return (
                  <button
                    key={cond}
                    type="button"
                    disabled={isNewPrintDisabled}
                    onClick={() => setCondition(cond)}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#0F2C59] text-white shadow-xs'
                        : isNewPrintDisabled
                          ? 'text-slate-400 cursor-not-allowed opacity-50'
                          : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {cond}
                  </button>
                );
              })}
            </div>
            {category !== 'textbooks' && (
              <p className="text-[11px] text-slate-400">Note: "New print" condition is available for Textbooks only.</p>
            )}
          </div>

          {/* 5. Price BDT */}
          <div>
            <Input
              label="Price (BDT)"
              placeholder="e.g. 350"
              type="text"
              value={priceBDT}
              onChange={(e) => setPriceBDT(e.target.value)}
              onBlur={() => {
                const numeric = parsePrice();
                if (numeric > 0) {
                  setPriceBDT(numeric.toLocaleString());
                }
              }}
              leftAddon={<span className="font-bold text-slate-700">৳</span>}
              helperText="Students negotiate; price it fairly."
              required
            />
          </div>

          {/* 6. Description */}
          <Textarea
            label="Item Description (Optional)"
            placeholder="Include condition details, course code relevance, edition, or inclusions..."
            value={description}
            onChange={(e) => {
              if (e.target.value.length <= 400) {
                setDescription(e.target.value);
              }
            }}
            rows={3}
            helperText={`${description.length}/400 characters max`}
          />

          {/* 7. Campus Meetup Spot Single Select Chips */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Campus Handover Spot <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {availableSpots.map((spot) => {
                const isSelected = meetupSpot === spot;
                return (
                  <button
                    key={spot}
                    type="button"
                    onClick={() => setMeetupSpot(spot)}
                    className={`px-3 py-2 rounded-xl border text-xs font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#0F2C59] border-[#0F2C59] text-white shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-400' : 'text-slate-400'}`} />
                    <span>{spot}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 8. Contact Preview Notice */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-2.5">
            <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Buyers will message you on WhatsApp: <strong className="font-mono text-emerald-700">{seller.whatsapp}</strong></span>
          </div>

          {/* 9. Live Card Preview Component */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F2C59]">
              <Eye className="w-4 h-4 text-emerald-600" />
              <span>Live Buyer Card Preview</span>
            </div>
            <div className="max-w-sm mx-auto p-2 bg-slate-100 rounded-2xl border border-slate-200">
              <ListingCard listing={previewListing} showSellerInfo={true} />
            </div>
          </div>

        </form>

        {/* 10. Sticky Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-white sticky bottom-0 z-20 flex items-center justify-end gap-3 shadow-md">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="composer-form"
            variant="primary"
            isLoading={isSubmitting}
            disabled={seller.status === 'pending'}
          >
            {editingListing ? 'Save changes' : 'Publish listing'}
          </Button>
        </div>

      </div>
    </div>
  );
};

export default ComposerPanel;
