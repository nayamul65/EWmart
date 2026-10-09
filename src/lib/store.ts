import type { Seller, Listing, AdminStats, ListingStatus, ListingCategory, ListingCondition } from '../types/ewmart';
import { INITIAL_SELLERS, INITIAL_LISTINGS } from './mock';

const SELLERS_KEY = 'ewmart_sellers_v1';
const LISTINGS_KEY = 'ewmart_listings_v1';
const CURRENT_SELLER_KEY = 'ewmart_current_seller_id';

function isWindowAvailable(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function loadInitialSellers(): Seller[] {
  if (!isWindowAvailable()) return INITIAL_SELLERS;
  try {
    const raw = localStorage.getItem(SELLERS_KEY);
    if (!raw) {
      localStorage.setItem(SELLERS_KEY, JSON.stringify(INITIAL_SELLERS));
      return INITIAL_SELLERS;
    }
    return JSON.parse(raw) as Seller[];
  } catch (err) {
    console.error('Failed to load sellers from localStorage', err);
    return INITIAL_SELLERS;
  }
}

function saveSellers(sellers: Seller[]): void {
  if (!isWindowAvailable()) return;
  try {
    localStorage.setItem(SELLERS_KEY, JSON.stringify(sellers));
  } catch (err) {
    console.error('Failed to save sellers to localStorage', err);
  }
}

function loadInitialListings(): Listing[] {
  if (!isWindowAvailable()) return INITIAL_LISTINGS;
  try {
    const raw = localStorage.getItem(LISTINGS_KEY);
    if (!raw) {
      localStorage.setItem(LISTINGS_KEY, JSON.stringify(INITIAL_LISTINGS));
      return INITIAL_LISTINGS;
    }
    return JSON.parse(raw) as Listing[];
  } catch (err) {
    console.error('Failed to load listings from localStorage', err);
    return INITIAL_LISTINGS;
  }
}

function saveListings(listings: Listing[]): void {
  if (!isWindowAvailable()) return;
  try {
    localStorage.setItem(LISTINGS_KEY, JSON.stringify(listings));
  } catch (err) {
    console.error('Failed to save listings to localStorage', err);
  }
}

export async function getSellers(): Promise<Seller[]> {
  return loadInitialSellers();
}

export async function getPendingSellers(): Promise<Seller[]> {
  const sellers = await getSellers();
  return sellers.filter(s => s.status === 'pending');
}

export async function approveSeller(id: string): Promise<Seller> {
  const sellers = await getSellers();
  const idx = sellers.findIndex(s => s.id === id);
  if (idx === -1) throw new Error('Seller not found');
  sellers[idx] = { ...sellers[idx], status: 'approved', banReason: undefined, bannedAt: undefined };
  saveSellers(sellers);
  return sellers[idx];
}

export async function banSeller(id: string, reason?: string): Promise<Seller> {
  const sellers = await getSellers();
  const idx = sellers.findIndex(s => s.id === id);
  if (idx === -1) throw new Error('Seller not found');
  const now = Date.now();
  sellers[idx] = { 
    ...sellers[idx], 
    status: 'banned', 
    banReason: reason || 'Violation of EWmart safety policies',
    bannedAt: now 
  };
  saveSellers(sellers);
  return sellers[idx];
}

export async function reinstateSeller(id: string): Promise<Seller> {
  const sellers = await getSellers();
  const idx = sellers.findIndex(s => s.id === id);
  if (idx === -1) throw new Error('Seller not found');
  sellers[idx] = { 
    ...sellers[idx], 
    status: 'approved', 
    banReason: undefined, 
    bannedAt: undefined 
  };
  saveSellers(sellers);
  return sellers[idx];
}

export async function registerSeller(data: {
  name: string;
  email: string;
  studentId: string;
  department: string;
  whatsapp: string;
  facebookUrl?: string;
  instagramUrl?: string;
  bio?: string;
  meetupSpots: string[];
}): Promise<Seller> {
  const sellers = await getSellers();
  const now = Date.now();
  const newSeller: Seller = {
    id: `sel_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    ...data,
    status: 'pending',
    agreedToPolicyAt: now,
    createdAt: now
  };
  sellers.unshift(newSeller);
  saveSellers(sellers);
  
  if (isWindowAvailable()) {
    try {
      localStorage.setItem(CURRENT_SELLER_KEY, newSeller.id);
    } catch {}
  }
  return newSeller;
}

export function getCurrentSellerId(): string | null {
  if (!isWindowAvailable()) return null;
  try {
    return localStorage.getItem(CURRENT_SELLER_KEY);
  } catch {
    return null;
  }
}

export function setCurrentSellerId(id: string): void {
  if (!isWindowAvailable()) return;
  try {
    localStorage.setItem(CURRENT_SELLER_KEY, id);
  } catch {}
}

export async function getFeed(): Promise<Listing[]> {
  const listings = loadInitialListings();
  const sellers = await getSellers();
  const bannedSellerIds = new Set(sellers.filter(s => s.status === 'banned').map(s => s.id));
  
  // Public feed excludes flagged items and items by banned sellers
  return listings.filter(l => !l.flagged && !bannedSellerIds.has(l.sellerId));
}

export async function getAllListingsForAdmin(): Promise<Listing[]> {
  return loadInitialListings();
}

export async function getListingsBySeller(sellerId: string): Promise<Listing[]> {
  const listings = loadInitialListings();
  return listings.filter(l => l.sellerId === sellerId);
}

export async function createListing(data: {
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
}): Promise<Listing> {
  const listings = loadInitialListings();
  const now = Date.now();
  const newListing: Listing = {
    id: `lst_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    ...data,
    status: 'available',
    flagged: false,
    createdAt: now
  };
  listings.unshift(newListing);
  saveListings(listings);
  return newListing;
}

export async function updateListing(id: string, data: Partial<Listing>): Promise<Listing> {
  const listings = loadInitialListings();
  const idx = listings.findIndex(l => l.id === id);
  if (idx === -1) throw new Error('Listing not found');
  listings[idx] = { ...listings[idx], ...data };
  saveListings(listings);
  return listings[idx];
}

export async function setListingStatus(id: string, status: ListingStatus): Promise<Listing> {
  return updateListing(id, { status });
}

export async function deleteListing(id: string): Promise<void> {
  const listings = loadInitialListings();
  const filtered = listings.filter(l => l.id !== id);
  saveListings(filtered);
}

export async function flagListing(id: string, reason: string): Promise<Listing> {
  const listings = loadInitialListings();
  const idx = listings.findIndex(l => l.id === id);
  if (idx === -1) throw new Error('Listing not found');
  const now = Date.now();
  listings[idx] = {
    ...listings[idx],
    flagged: true,
    flagReason: reason,
    flaggedAt: now
  };
  saveListings(listings);
  return listings[idx];
}

export async function unflagListing(id: string): Promise<Listing> {
  const listings = loadInitialListings();
  const idx = listings.findIndex(l => l.id === id);
  if (idx === -1) throw new Error('Listing not found');
  listings[idx] = {
    ...listings[idx],
    flagged: false,
    flagReason: undefined,
    flaggedAt: undefined
  };
  saveListings(listings);
  return listings[idx];
}

export async function getStats(): Promise<AdminStats> {
  const sellers = await getSellers();
  const listings = loadInitialListings();

  return {
    totalListings: listings.length,
    activeListings: listings.filter(l => !l.flagged && l.status === 'available').length,
    totalSellers: sellers.length,
    pendingSellers: sellers.filter(s => s.status === 'pending').length,
    approvedSellers: sellers.filter(s => s.status === 'approved').length,
    bannedSellers: sellers.filter(s => s.status === 'banned').length,
    flaggedListings: listings.filter(l => l.flagged).length
  };
}
