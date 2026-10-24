import React, { useState } from 'react';
import { Sparkles, MessageSquare, Shield, Menu, X, ArrowRight, User, LogOut, Settings as SettingsIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onOpenAuth: (mode?: 'login' | 'signup') => void;
  onNavigateDashboard: () => void;
  onOpenSettings: () => void;
  currentView: 'landing' | 'dashboard';
  onNavigateHome: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAuth,
  onNavigateDashboard,
  onOpenSettings,
  currentView,
  onNavigateHome,
}) => {
  const { user, signOut, isSupabaseLive } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    if (currentView !== 'landing') {
      onNavigateHome();
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-purple-500/20 bg-[#080511]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-3 group text-left transition-transform active:scale-95"
        >
          <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 via-fuchsia-500 to-pink-500 shadow-[0_0_20px_rgba(168,85,247,0.4)] group-hover:shadow-[0_0_25px_rgba(236,72,153,0.6)] transition-all">
            <Sparkles className="w-6 h-6 text-white animate-pulse" />
            <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white font-['Plus_Jakarta_Sans']">
                Vibe<span className="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-pink-400 bg-clip-text text-transparent">Mate</span>
              </span>
              <span className="hidden sm:inline-flex items-center text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300">
                AI 3.8
              </span>
            </div>
            <p className="text-[11px] text-purple-300/70 font-medium tracking-wide">
              Your Space. Your Vibe.
            </p>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <button
            onClick={() => scrollToSection('features')}
            className="text-sm font-medium text-purple-200/80 hover:text-white hover:glow-text transition-colors"
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection('personas')}
            className="text-sm font-medium text-purple-200/80 hover:text-white hover:glow-text transition-colors"
          >
            Personas
          </button>
          <button
            onClick={() => scrollToSection('trilingual')}
            className="text-sm font-medium text-purple-200/80 hover:text-white hover:glow-text transition-colors flex items-center gap-1.5"
          >
            <span>Trilingual</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-pink-500/20 text-pink-300 border border-pink-500/30 font-semibold">
              தமிழ்
            </span>
          </button>
          <button
            onClick={() => scrollToSection('about')}
            className="text-sm font-medium text-purple-200/80 hover:text-white hover:glow-text transition-colors"
          >
            About
          </button>
          <button
            onClick={onOpenSettings}
            className="text-sm font-medium text-purple-200/80 hover:text-white hover:glow-text transition-colors flex items-center gap-1"
          >
            <Shield className="w-3.5 h-3.5 text-purple-400" />
            <span>Config & SQL</span>
          </button>
        </div>

        {/* Right CTA / Auth Status */}
        <div className="hidden md:flex items-center gap-4">
          {/* Supabase status indicator */}
          <div
            title={isSupabaseLive ? 'Supabase connected' : 'Local mode active. Configure Supabase in Settings.'}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
              isSupabaseLive
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-purple-900/30 border-purple-500/30 text-purple-300'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isSupabaseLive ? 'bg-emerald-400 animate-ping' : 'bg-purple-400'}`} />
            <span>{isSupabaseLive ? 'Supabase Sync' : 'Ready'}</span>
          </div>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 pl-3 pr-2 py-1.5 rounded-full bg-purple-950/60 border border-purple-500/30 hover:border-purple-400 transition-all text-sm font-medium text-purple-100"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white shadow-inner">
                  {user.full_name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="max-w-[120px] truncate">{user.full_name}</span>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl glass-panel border border-purple-500/30 bg-[#120B24] p-2 shadow-2xl z-50">
                  <div className="px-3 py-2 border-b border-purple-500/20 mb-1">
                    <p className="text-xs text-purple-400 font-medium">Signed in as</p>
                    <p className="text-sm font-semibold text-white truncate">{user.email}</p>
                    {user.is_demo && (
                      <span className="text-[10px] text-amber-300 font-medium">Guest / Demo Mode</span>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onNavigateDashboard();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-xl text-purple-200 hover:text-white hover:bg-purple-600/20 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4 text-purple-400" />
                    <span>Open Dashboard</span>
                  </button>
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onOpenSettings();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-xl text-purple-200 hover:text-white hover:bg-purple-600/20 transition-colors"
                  >
                    <SettingsIcon className="w-4 h-4 text-purple-400" />
                    <span>Preferences & Setup</span>
                  </button>
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      signOut();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-xl text-rose-300 hover:text-rose-200 hover:bg-rose-500/10 transition-colors mt-1"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => onOpenAuth('login')}
                className="px-4 py-2 text-sm font-medium text-purple-200 hover:text-white transition-colors"
              >
                Log In
              </button>
              <button
                onClick={() => onOpenAuth('signup')}
                className="relative group px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-500 hover:via-fuchsia-500 hover:to-pink-500 shadow-[0_0_20px_rgba(168,85,247,0.35)] hover:shadow-[0_0_30px_rgba(236,72,153,0.5)] transition-all flex items-center gap-2 active:scale-95"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center md:hidden gap-3">
          {user && (
            <button
              onClick={onNavigateDashboard}
              className="p-2 rounded-xl bg-purple-600/30 border border-purple-500/40 text-purple-200 text-xs font-semibold flex items-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Chat</span>
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-purple-200 hover:text-white bg-purple-900/30 border border-purple-500/30"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-purple-500/30 px-6 py-5 bg-[#0e081c]/95 space-y-4">
          <div className="flex flex-col space-y-3">
            <button
              onClick={() => scrollToSection('features')}
              className="text-left py-2 text-base font-medium text-purple-200 hover:text-white"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('personas')}
              className="text-left py-2 text-base font-medium text-purple-200 hover:text-white"
            >
              Personas
            </button>
            <button
              onClick={() => scrollToSection('trilingual')}
              className="text-left py-2 text-base font-medium text-purple-200 hover:text-white flex items-center justify-between"
            >
              <span>Trilingual (English / தமிழ் / Tanglish)</span>
              <span className="text-xs px-2 py-0.5 rounded bg-pink-500/20 text-pink-300">Active</span>
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="text-left py-2 text-base font-medium text-purple-200 hover:text-white"
            >
              About VibeMate
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSettings();
              }}
              className="text-left py-2 text-base font-medium text-purple-200 hover:text-white flex items-center gap-2"
            >
              <SettingsIcon className="w-4 h-4 text-purple-400" />
              <span>Setup & Database SQL</span>
            </button>
          </div>

          <div className="pt-4 border-t border-purple-500/20 space-y-3">
            {user ? (
              <>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigateDashboard();
                  }}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>Open Chat Dashboard</span>
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    signOut();
                  }}
                  className="w-full py-2.5 rounded-xl border border-rose-500/30 text-rose-300 font-medium text-sm flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out ({user.email})</span>
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('login');
                  }}
                  className="w-full py-2.5 rounded-xl border border-purple-500/30 text-purple-200 font-semibold text-sm"
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('signup');
                  }}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-sm"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
