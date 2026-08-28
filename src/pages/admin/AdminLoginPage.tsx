import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, AlertCircle, ArrowRight, ShieldCheck, Sun, Moon, ArrowLeft } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useTheme } from '../../context/ThemeContext';
import { BrandLogo } from '../../components/BrandLogo';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, isAuthenticated } = useAdminAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const success = await login(email.trim(), password);
    setIsSubmitting(false);

    if (success) {
      navigate('/admin/dashboard');
    } else {
      setError('Invalid admin credentials. Please check email and password.');
    }
  };

  return (
    <div id="admin-login-page" className="min-h-screen bg-[#F5E6D3] dark:bg-[#140F0C] flex flex-col items-center justify-center p-4 transition-colors duration-300">
      {/* Top Header controls */}
      <div className="w-full max-w-md flex items-center justify-between mb-4 px-1">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-[#77553b] dark:text-[#C8A882] hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Store</span>
        </Link>
        <button
          onClick={toggleTheme}
          className="p-1.5 rounded-full bg-[#FFFDF9] dark:bg-[#2B221C] border border-[#d4c3b9] dark:border-[#3D3027] text-[#4A382D] dark:text-[#FFFDF9] text-xs cursor-pointer"
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDark ? <Sun className="w-4 h-4 text-[#F5D061]" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      <div className="w-full max-w-md bg-[#FFFDF9] dark:bg-[#1D1612] rounded-xl border border-[#d4c3b9] dark:border-[#3D3027] shadow-md p-8 sm:p-10 space-y-6">
        <div className="text-center space-y-3">
          <BrandLogo size="lg" />
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F5E6D3] dark:bg-[#2B221C] rounded-full text-[10px] uppercase font-sans tracking-[0.2em] text-[#77553b] dark:text-[#E6D0BA] font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Store Administration Portal</span>
          </div>
        </div>

        {error && (
          <div className="p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 text-red-700 dark:text-red-300 text-xs rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-[#4A382D] dark:text-[#F0E6DC] block mb-1">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#82756c] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter admin email..."
                className="w-full text-xs py-3 pl-9 pr-3 bg-[#F5E6D3]/30 dark:bg-[#241C17] border border-[#d4c3b9] dark:border-[#3D3027] text-[#4A382D] dark:text-[#F0E6DC] rounded focus:outline-none focus:border-[#77553b]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#4A382D] dark:text-[#F0E6DC] block mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#82756c] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password..."
                className="w-full text-xs py-3 pl-9 pr-3 bg-[#F5E6D3]/30 dark:bg-[#241C17] border border-[#d4c3b9] dark:border-[#3D3027] text-[#4A382D] dark:text-[#F0E6DC] rounded focus:outline-none focus:border-[#77553b]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-[#B89578] hover:bg-[#96745A] text-[#FFFDF9] text-xs font-sans font-semibold tracking-[0.2em] uppercase rounded transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 text-center">
          <p className="text-[11px] text-[#82756c]">
            OWNonce E-Commerce Control Center &bull; Cairo, Egypt
          </p>
        </div>
      </div>
    </div>
  );
};
