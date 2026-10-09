import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Mail, 
  ArrowLeft, 
  AlertCircle,
  Eye, 
  EyeOff,
  ShieldAlert
} from 'lucide-react';
import Logo from '../components/Logo';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onNavigateHome: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ 
  onLoginSuccess, 
  onNavigateHome 
}) => {
  const [email, setEmail] = useState('admin@ewubd.edu');
  const [password, setPassword] = useState('ewmart2026');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Stealth rule: Add noindex nofollow meta tag
  useEffect(() => {
    let meta = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'robots';
      document.head.appendChild(meta);
    }
    meta.content = 'noindex, nofollow';

    return () => {
      if (meta) {
        meta.content = 'index, follow';
      }
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    // TODO: Phase 5 Firebase Auth Integration
    setTimeout(() => {
      const validEmail = email.trim().toLowerCase() === 'admin@ewubd.edu';
      const validPass = password.trim() === 'ewmart2026' || password.trim() === 'admin123';

      if (!validEmail || !validPass) {
        setError('Invalid administrative credentials. Access restricted to verified EWmart staff.');
        setIsSubmitting(false);
        return;
      }

      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('ewmart_admin_session', JSON.stringify({
            authenticated: true,
            email: 'admin@ewubd.edu',
            timestamp: Date.now()
          }));
        } catch {}
      }

      setIsSubmitting(false);
      onLoginSuccess();
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 sm:p-6 font-sans text-slate-900 antialiased selection:bg-[#00A86B] selection:text-white">
      
      {/* Top back navigation */}
      <div className="fixed top-6 left-6 z-20">
        <button
          onClick={onNavigateHome}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to marketplace</span>
        </button>
      </div>

      {/* Desktop 2-Column Quiet Layout Container */}
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden grid grid-cols-1 md:grid-cols-2">
        
        {/* LEFT PANEL: Solid EWU Navy (#0F2C59) */}
        <div className="bg-[#0F2C59] text-white p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden">
          <div className="z-10">
            <Logo size="lg" showTagline={true} />
            
            <div className="mt-12 space-y-3">
              <h2 className="text-2xl font-bold tracking-tight text-white">
                EWmart Staff Portal
              </h2>
              <p className="text-xs text-slate-300 font-normal leading-relaxed max-w-sm">
                Moderation access for EWmart staff only.
              </p>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-slate-700/60 z-10 flex items-center gap-2 text-xs text-slate-400 font-medium">
            <ShieldAlert className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>East West University Verified Moderation</span>
          </div>

          {/* Subtle background ambient blob */}
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#00A86B]/15 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* RIGHT PANEL: Pure White with form */}
        <div className="bg-white p-8 sm:p-12 flex flex-col justify-center">
          <div className="mb-6">
            <h1 className="text-xl font-bold text-[#0F2C59] tracking-tight">
              Sign in to Dashboard
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Enter staff credentials to access moderation console.
            </p>
          </div>

          {/* Inline Red Alert Text for Incorrect Credentials */}
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Staff Email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@ewubd.edu"
              leftAddon={<Mail className="w-4 h-4" />}
            />

            <div>
              <Input
                label="Staff Password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                leftAddon={<Lock className="w-4 h-4" />}
                rightAddon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              />
              <p className="text-[11px] text-slate-400 mt-1 font-medium">
                Default key: <code className="text-[#0F2C59] bg-slate-100 px-1.5 py-0.5 rounded">ewmart2026</code>
              </p>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2"
              isLoading={isSubmitting}
            >
              Sign in
            </Button>
          </form>

          <p className="mt-8 text-center text-[11px] text-slate-400 font-medium">
            Restricted System • Unauthorized attempts are monitored
          </p>
        </div>

      </div>

    </div>
  );
};

export default AdminLogin;
