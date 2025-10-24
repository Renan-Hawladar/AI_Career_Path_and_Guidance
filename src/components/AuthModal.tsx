import { useState } from 'react';
import { X, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AuthModalProps {
  mode: 'login' | 'signup';
  onClose: () => void;
  onSwitchMode: () => void;
}

export default function AuthModal({ mode, onClose, onSwitchMode }: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = mode === 'login'
        ? await signIn(email, password)
        : await signUp(email, password);

      if (result.error) {
        setError(result.error.message);
      } else {
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-[#161B22] rounded-2xl border border-[#3B82F6]/20 shadow-2xl shadow-[#3B82F6]/10 animate-slideUp">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white font-['Space_Grotesk']">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-[#E0E6ED]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-4 bg-[#FF6F61]/10 border border-[#FF6F61]/30 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#FF6F61] flex-shrink-0 mt-0.5" />
              <p className="text-[#FF6F61] text-sm font-['Inter']">{error}</p>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#E0E6ED] mb-2 font-['Inter']">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4A5568]" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3 bg-[#0D1117] border border-white/10 rounded-lg text-white placeholder-[#4A5568] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] transition-all font-['Inter']"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#E0E6ED] mb-2 font-['Inter']">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4A5568]" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full pl-11 pr-4 py-3 bg-[#0D1117] border border-white/10 rounded-lg text-white placeholder-[#4A5568] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] transition-all font-['Inter']"
                placeholder="••••••••"
              />
            </div>
            {mode === 'signup' && (
              <p className="mt-2 text-xs text-[#4A5568] font-['Inter']">
                Must be at least 6 characters
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-[#3B82F6] to-[#9D4EDD] text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-[#3B82F6]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-['Inter']"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {mode === 'login' ? 'Signing in...' : 'Creating account...'}
              </>
            ) : (
              mode === 'login' ? 'Sign In' : 'Sign Up'
            )}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={onSwitchMode}
              className="text-sm text-[#3B82F6] hover:text-[#9D4EDD] transition-colors font-['Inter']"
            >
              {mode === 'login'
                ? "Don't have an account? Sign up"
                : 'Already have an account? Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
