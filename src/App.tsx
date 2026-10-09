import React, { useState, useEffect } from 'react';
import EWMLoader from './components/EWMLoader';
import EWmHero from './components/EWmHero';
import Footer from './components/Footer';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import SellerStudio from './pages/SellerStudio';
import PublicSellerProfile from './pages/PublicSellerProfile';
import SellerRegisterModal from './components/modals/SellerRegisterModal';
import ListingCard from './components/ui/ListingCard';
import { getFeed } from './lib/store';
import type { Listing } from './types/ewmart';
import { ShieldCheck, Sparkles, Filter } from 'lucide-react';

export const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [feedListings, setFeedListings] = useState<Listing[]>([]);

  // Synchronize route with browser history
  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname || '/');
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Load public marketplace feed from store
  useEffect(() => {
    const fetchMarketplaceFeed = async () => {
      try {
        const feed = await getFeed();
        setFeedListings(feed);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMarketplaceFeed();
  }, [currentPath]);

  // Initial splash loader for marketplace homepage
  useEffect(() => {
    if (currentPath === '/') {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 2500);
      return () => clearTimeout(timer);
    } else {
      setIsLoading(false);
    }
  }, [currentPath]);

  const handleReplayLoading = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2500);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    showToast(`Filtering marketplace by: ${category}`);
  };

  const handleRegisterClick = () => {
    setIsRegisterModalOpen(true);
  };

  const handleAvatarClick = () => {
    navigateTo('/studio');
  };

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  // Check admin session
  const isAdminAuthenticated = (): boolean => {
    if (typeof window === 'undefined') return false;
    try {
      const session = localStorage.getItem('ewmart_admin_session');
      if (!session) return false;
      const parsed = JSON.parse(session);
      return Boolean(parsed?.authenticated);
    } catch {
      return false;
    }
  };

  // 1. ADMIN LOGIN VIEW
  if (currentPath === '/admin/login') {
    return (
      <AdminLogin
        onLoginSuccess={() => {
          showToast("Admin session authenticated. Welcome to Management Console.");
          navigateTo('/admin/dashboard');
        }}
        onNavigateHome={() => navigateTo('/')}
      />
    );
  }

  // 2. ADMIN DASHBOARD VIEW (Protected)
  if (currentPath === '/admin/dashboard') {
    if (!isAdminAuthenticated()) {
      return (
        <AdminLogin
          onLoginSuccess={() => {
            showToast("Admin session authenticated. Welcome to Management Console.");
            navigateTo('/admin/dashboard');
          }}
          onNavigateHome={() => navigateTo('/')}
        />
      );
    }

    return (
      <AdminDashboard
        onLogout={() => {
          if (typeof window !== 'undefined') {
            try {
              localStorage.removeItem('ewmart_admin_session');
            } catch {}
          }
          showToast("Admin logged out successfully.");
          navigateTo('/');
        }}
        onNavigateHome={() => navigateTo('/')}
      />
    );
  }

  // 3. PRIVATE SELLER STUDIO VIEW (/studio)
  if (currentPath === '/studio') {
    return (
      <SellerStudio
        onNavigateHome={() => navigateTo('/')}
        onNavigateSellerProfile={(sellerId) => navigateTo(`/seller/${sellerId}`)}
        onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
        onOpenSafetyPolicyModal={() => setIsRegisterModalOpen(true)}
      />
    );
  }

  // 4. PUBLIC SELLER PROFILE VIEW (/seller/[id])
  if (currentPath.startsWith('/seller/')) {
    const sellerId = currentPath.replace('/seller/', '');
    return (
      <PublicSellerProfile
        sellerId={sellerId}
        onNavigateHome={() => navigateTo('/')}
      />
    );
  }

  // Filter listings by selected category if active
  const filteredFeed = selectedCategory
    ? feedListings.filter(l => l.category.toLowerCase().includes(selectedCategory.toLowerCase()) || selectedCategory.toLowerCase().includes(l.category.toLowerCase()))
    : feedListings;

  // 5. MAIN CAMPUS MARKETPLACE HOMEPAGE VIEW
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-[#00A86B] selection:text-white flex flex-col justify-between">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F2C59] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-400/50 animate-in fade-in slide-in-from-bottom-4">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">{notification}</span>
        </div>
      )}

      {/* Main Conditional Rendering */}
      {isLoading ? (
        <EWMLoader />
      ) : (
        <div className="w-full flex-1 flex flex-col justify-between">
          
          {/* Re-trigger Loading Demo Button */}
          <button
            onClick={handleReplayLoading}
            className="fixed top-24 right-4 z-40 px-3 py-1.5 bg-white/95 hover:bg-slate-100 border border-slate-200 rounded-full text-xs font-semibold text-[#0F2C59] shadow-lg backdrop-blur-md transition-transform hover:scale-105 active:scale-95 flex items-center gap-1.5 cursor-pointer"
            title="Click to view the cute EWMLoader screen again"
          >
            <span className="w-2 h-2 rounded-full bg-[#00A86B] animate-pulse" />
            <span>Test EWMLoader</span>
          </button>

          {/* Hero Section */}
          <EWmHero 
            onCategorySelect={handleCategorySelect}
            onRegisterClick={handleRegisterClick}
            onAvatarClick={handleAvatarClick}
          />
          
          {/* Active Category Demo Feedback Section */}
          {selectedCategory && (
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                <p className="text-xs sm:text-sm text-slate-600 font-medium flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[#00A86B]" />
                  <span>Active Category Filter: <strong className="text-[#0F2C59]">{selectedCategory}</strong></span>
                </p>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="text-xs font-bold text-slate-500 hover:text-red-600 underline cursor-pointer"
                >
                  Clear Filter
                </button>
              </div>
            </div>
          )}

          {/* Public Marketplace Feed Grid */}
          <main id="marketplace" className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-2xl font-bold text-[#0F2C59] tracking-tight flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#00A86B]" />
                  <span>Campus Feed</span>
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Verified student-to-student listings on Aftabnagar campus
                </p>
              </div>
              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
                {filteredFeed.length} items live
              </span>
            </div>

            {filteredFeed.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center shadow-xs">
                <p className="text-sm font-bold text-slate-700">No listings found in this category</p>
                <p className="text-xs text-slate-500 mt-1">Be the first EWU student to post an item here!</p>
                <button
                  onClick={handleRegisterClick}
                  className="mt-4 bg-[#0F2C59] text-white px-5 py-2.5 rounded-xl text-xs font-bold"
                >
                  Register as Seller
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredFeed.map((item) => (
                  <ListingCard
                    key={item.id}
                    listing={item}
                    showSellerInfo={true}
                    onCardClick={() => navigateTo(`/seller/${item.sellerId}`)}
                  />
                ))}
              </div>
            )}
          </main>

          {/* Main Footer with Stealth Staff Portal Entry */}
          <Footer onAdminClick={() => navigateTo('/admin/login')} />
        </div>
      )}

      {/* Phase 2: Seller Registration & Safety Modal */}
      <SellerRegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSuccess={() => {
          showToast("Seller registration submitted! Pending verification.");
          navigateTo('/studio');
        }}
      />
    </div>
  );
};

export default App;
