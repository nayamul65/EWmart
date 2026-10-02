import React, { useState, useEffect } from 'react';
import EWMLoader from './components/EWMLoader';
import EWmHero from './components/EWmHero';
import Footer from './components/Footer';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import { ShieldCheck } from 'lucide-react';

export const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

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
    showToast("Redirecting to EWU @ewubd.edu Student Seller Onboarding...");
  };

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 3500);
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

  // 2. ADMIN DASHBOARD VIEW
  if (currentPath === '/admin/dashboard') {
    return (
      <AdminDashboard
        onLogout={() => {
          showToast("Admin logged out successfully.");
          navigateTo('/');
        }}
        onNavigateHome={() => navigateTo('/')}
      />
    );
  }

  // 3. MAIN CAMPUS MARKETPLACE VIEW
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
          />
          
          {/* Active Category Demo Feedback Section */}
          {selectedCategory && (
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <p className="text-xs sm:text-sm text-slate-600 font-medium">
                  Active Category Filter: <strong className="text-[#0F2C59]">{selectedCategory}</strong>
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

          {/* Main Footer with Stealth Staff Portal Entry */}
          <Footer onAdminClick={() => navigateTo('/admin/login')} />
        </div>
      )}
    </div>
  );
};

export default App;
