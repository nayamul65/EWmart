export type SellerStatus = "pending" | "approved" | "banned";

export interface Seller {
  id: string;
  name: string;
  email: string;
  studentId: string;
  department: string;
  whatsapp: string;
  facebookUrl?: string;
  instagramUrl?: string;
  bio?: string;
  meetupSpots: string[];
  status: SellerStatus;
  banReason?: string;
  bannedAt?: number;
  agreedToPolicyAt: number;
  createdAt: number;
}

export type ListingCategory = "textbooks" | "cafeteria" | "electronics" | "thrift" | "services";

export type ListingCondition = "New" | "Used" | "New print";

export type ListingStatus = "available" | "reserved" | "sold";

export interface Listing {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerWhatsapp: string;
  title: string;
  description: string;
  priceBDT: number;
  category: ListingCategory;
  condition: ListingCondition;
  images: string[];
  meetupSpot: string;
  status: ListingStatus;
  flagged: boolean;
  flagReason?: string;
  flaggedAt?: number;
  createdAt: number;
}

export interface AdminStats {
  totalListings: number;
  activeListings: number;
  totalSellers: number;
  pendingSellers: number;
  approvedSellers: number;
  bannedSellers: number;
  flaggedListings: number;
}
