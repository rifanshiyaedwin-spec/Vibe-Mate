import React, { useState } from 'react';
import { X, Eye, EyeOff, Lock, Mail, User, Sparkles, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup' | 'forgot_password';
  onSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  onSuccess,
}) => {
  const { signIn, signUp, resetPassword, loginAsDemo, isSupabaseLive } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot_password'>(initialMode);
  
  // Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // State
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const resetFormState = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleModeChange = (newMode: 'login' | 'signup' | 'forgot_password') => {
    resetFormState();
    setMode(newMode);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetFormState();
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (!fullName.trim()) {
          setErrorMessage('Please enter your full name.');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setErrorMessage('Password must be at least 6 characters long.');
          setLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setErrorMessage('Passwords do not match. Please verify both fields.');
          setLoading(false);
          return;
        }

        const res = await signUp(email, password, fullName.trim());
        if (res.error) {
          setErrorMessage(res.error);
        } else if (res.requiresEmailConfirmation) {
          setSuccessMessage(
            'Account created! A confirmation link has been sent to your email. Please click it to verify your account.'
          );
        } else {
          // Confetti celebration
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#a855f7', '#ec4899', '#f43f5e', '#ffffff'],
          });
          onSuccess();
          onClose();
        }
      } else if (mode === 'login') {
        const res = await signIn(email, password);
        if (res.error) {
          setErrorMessage(res.error);
        } else {
          onSuccess();
          onClose();
        }
      } else if (mode === 'forgot_password') {
        const res = await resetPassword(email);
        if (res.error) {
          setErrorMessage(res.error);
        } else {
          setSuccessMessage(res.message || 'Password reset link sent to your inbox.');
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected authentication error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    loginAsDemo('Alex Rivera');
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#a855f7', '#ec4899'],
    });
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-3xl glass-card border border-purple-500/30 bg-[#0e081c] p-6 sm:p-8 shadow-[0_0_50px_rgba(168,85,247,0.25)]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-purple-300 hover:text-white hover:bg-purple-900/30 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-fuchsia-500 to-pink-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.5)] mb-3">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="text-2xl font-black text-white font-['Plus_Jakarta_Sans']">
            {mode === 'signup'
              ? 'Join VibeMate'
              : mode === 'login'
              ? 'Welcome Back'
              : 'Reset Your Password'}
          </h2>
          <p className="text-xs sm:text-sm text-purple-300/70 mt-1">
            {mode === 'signup'
              ? 'Create your space and choose your vibe.'
              : mode === 'login'
              ? 'Sign in to access your saved conversations.'
              : 'Enter your email to receive a recovery link.'}
          </p>

          {/* Supabase status badge */}
          <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-semibold border bg-purple-950/70 border-purple-500/30 text-purple-300">
            <span className={`w-1.5 h-1.5 rounded-full ${isSupabaseLive ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            <span>{isSupabaseLive ? 'Supabase Auth Online' : 'Supabase (Enter credentials or use Demo)'}</span>
          </div>
        </div>

        {/* Alert / Error Banner */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success Banner */}
        {successMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-200 text-xs flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-purple-200 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Rivera"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-purple-950/50 border border-purple-500/30 focus:border-fuchsia-400 focus:outline-none focus:ring-1 focus:ring-fuchsia-400 text-white text-sm placeholder:text-purple-400/50"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-purple-200 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-purple-950/50 border border-purple-500/30 focus:border-fuchsia-400 focus:outline-none focus:ring-1 focus:ring-fuchsia-400 text-white text-sm placeholder:text-purple-400/50"
              />
            </div>
          </div>

          {mode !== 'forgot_password' && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-purple-200">
                  Password
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => handleModeChange('forgot_password')}
                    className="text-[11px] text-fuchsia-300 hover:text-white transition-colors"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-purple-950/50 border border-purple-500/30 focus:border-fuchsia-400 focus:outline-none focus:ring-1 focus:ring-fuchsia-400 text-white text-sm placeholder:text-purple-400/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-purple-400 hover:text-white"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-purple-200 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-purple-950/50 border border-purple-500/30 focus:border-fuchsia-400 focus:outline-none focus:ring-1 focus:ring-fuchsia-400 text-white text-sm placeholder:text-purple-400/50"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-purple-400 hover:text-white"
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-sm shadow-[0_0_25px_rgba(168,85,247,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 mt-2"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>
                  {mode === 'signup'
                    ? 'Create My Account'
                    : mode === 'login'
                    ? 'Sign In to VibeMate'
                    : 'Send Password Reset'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Fast Login Option */}
        <div className="mt-4 pt-4 border-t border-purple-500/20 text-center">
          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full py-2.5 px-4 rounded-xl glass-card hover:bg-purple-900/40 border border-purple-500/30 hover:border-fuchsia-400/50 text-xs font-semibold text-purple-200 hover:text-white transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" />
            <span>Instant Demo Explorer (1-Click Test Mode)</span>
          </button>
        </div>

        {/* Toggle Mode Footer */}
        <div className="mt-4 text-center text-xs text-purple-300/70">
          {mode === 'signup' ? (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => handleModeChange('login')}
                className="font-bold text-fuchsia-300 hover:text-white underline transition-colors"
              >
                Sign In
              </button>
            </p>
          ) : mode === 'login' ? (
            <p>
              Don&apos;t have an account yet?{' '}
              <button
                type="button"
                onClick={() => handleModeChange('signup')}
                className="font-bold text-fuchsia-300 hover:text-white underline transition-colors"
              >
                Create one now
              </button>
            </p>
          ) : (
            <p>
              Remember your password?{' '}
              <button
                type="button"
                onClick={() => handleModeChange('login')}
                className="font-bold text-fuchsia-300 hover:text-white underline transition-colors"
              >
                Back to Sign In
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
};
