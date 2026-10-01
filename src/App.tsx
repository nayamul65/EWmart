import React, { useState, useEffect } from 'react';
import EWMLoader from './components/EWMLoader';
import EWmHero from './components/EWmHero';

export const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    // Simulate auth & campus credential verification for 2.5 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-[#00A86B] selection:text-white">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-[#00A86B]/60 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 backdrop-blur-xl">
          <div className="w-2.5 h-2.5 rounded-full bg-[#00A86B] animate-ping" />
          <span className="text-sm font-medium">{notification}</span>
        </div>
      )}

      {/* Re-trigger Loading Demo Button Floating at Top-Right when hero loaded */}
      {!isLoading && (
        <button
          onClick={handleReplayLoading}
          className="fixed top-4 right-4 z-40 px-3 py-1.5 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 rounded-full text-xs font-semibold text-emerald-400 shadow-xl backdrop-blur-md transition-transform hover:scale-105 active:scale-95 flex items-center gap-1.5"
          title="Click to view the cute EWMLoader screen again"
        >
          <span className="w-2 h-2 rounded-full bg-[#00A86B] animate-pulse" />
          <span>Test EWMLoader Animation</span>
        </button>
      )}

      {/* Main Conditional Rendering */}
      {isLoading ? (
        <EWMLoader />
      ) : (
        <div className="w-full min-h-screen flex flex-col">
          <EWmHero 
            onCategorySelect={handleCategorySelect}
            onRegisterClick={handleRegisterClick}
          />
          
          {/* Active Category Demo Feedback Section */}
          {selectedCategory && (
            <div className="w-full bg-slate-900/80 border-t border-slate-800 py-6 px-4 text-center">
              <p className="text-sm text-slate-300">
                Active Category Selected: <strong className="text-[#00A86B]">{selectedCategory}</strong>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
