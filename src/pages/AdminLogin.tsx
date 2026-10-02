import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  ArrowLeft, 
  ShieldAlert, 
  KeyRound, 
  Eye, 
  EyeOff, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import Logo from '../components/Logo';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onNavigateHome: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ 
  onLoginSuccess, 
  onNavigateHome 
}) => {
  const [email, setEmail] = useState('admin@ewubd.edu');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    setTimeout(() => {
      if (!email.endsWith('@ewubd.edu') && email !== 'admin@ewubd.edu') {
        setError('Unauthorized: Admin access requires a verified @ewubd.edu administrative identity.');
        setIsSubmitting(false);
        return;
      }

      if (password.trim().length < 4) {
        setError('Invalid passcode. Please enter your authorized console key.');
        setIsSubmitting(false);
        return;
      }

      setIsSubmitting(false);
      onLoginSuccess();
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#0B192C] flex flex-col justify-between items-center p-4 sm:p-6 font-sans antialiased text-slate-100 selection:bg-[#00A86B] selection:text-white relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#0F2C59]/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#00A86B]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top back navigation */}
      <div className="w-full max-w-md flex justify-start z-10 pt-4">
        <button
          onClick={onNavigateHome}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Campus Marketplace</span>
        </button>
      </div>

      {/* Center White Login Card */}
      <div className="w-full max-w-md my-auto z-10 animate-fade-in">
        <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-2xl border border-slate-100 text-slate-900 flex flex-col items-center">
          
          {/* Official EWmart Logo */}
          <div className="mb-2">
            <Logo size="lg" showTagline={true} />
          </div>

          {/* Subheader */}
          <div className="text-center mt-3 mb-6">
            <h1 className="text-xl font-black text-[#0F2C59] tracking-tight">
              EWmart Campus Management Console
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Safety & Content Moderation Portal
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="w-full mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="w-full space-y-4">
            
            {/* Admin Email */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Admin Email Address
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@ewubd.edu"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F2C59]/20 focus:border-[#0F2C59] transition-all"
                />
              </div>
            </div>

            {/* Secret Passcode */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Secret Passcode
                </label>
                <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Demo: admin123
                </span>
              </div>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-3 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F2C59]/20 focus:border-[#0F2C59] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#0F2C59] hover:bg-slate-900 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-[#0F2C59]/25 hover:shadow-xl active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-sm mt-2 cursor-pointer disabled:opacity-70"
            >
              <KeyRound className="w-4 h-4 text-emerald-400" />
              <span>{isSubmitting ? 'Verifying Credentials...' : 'Access Console'}</span>
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 pt-5 border-t border-slate-100 w-full flex items-center justify-center gap-2 text-[11px] font-medium text-slate-500">
            <ShieldAlert className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Authorized East West University staff only</span>
          </div>

        </div>
      </div>

      {/* Footer Branding */}
      <div className="w-full max-w-md text-center py-4 z-10">
        <p className="text-xs text-slate-500 font-medium">
          EWmart Safety & Control Center &copy; {new Date().getFullYear()}
        </p>
      </div>

    </div>
  );
};

export default AdminLogin;
