import React from 'react';
import { Sparkles, Shield, Github, Heart, ExternalLink, Database } from 'lucide-react';

interface FooterProps {
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onOpenSettings: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPrivacy, onOpenTerms, onOpenSettings }) => {
  return (
    <footer className="border-t border-purple-500/20 bg-[#06040d] text-purple-300/70 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-fuchsia-500 to-pink-500 flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-xl font-black text-white font-['Plus_Jakarta_Sans']">
                Vibe<span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Mate</span>
              </span>
            </div>
            <p className="text-sm text-purple-200/70 max-w-sm leading-relaxed">
              Your Space. Your Vibe. Complete production AI companion with genuine emotional intelligence, study coaching, and native Tamil/Tanglish support.
            </p>
            <div className="flex items-center gap-3 text-xs text-purple-400">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-950/60 border border-purple-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Gemini 3.8 Flash
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-950/60 border border-purple-500/30">
                PostgreSQL RLS
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#personas" className="hover:text-white transition-colors">
                  4 AI Personas
                </a>
              </li>
              <li>
                <a href="#trilingual" className="hover:text-white transition-colors">
                  Trilingual Intelligence
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Core Architecture
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-white transition-colors">
                  About VibeMate
                </a>
              </li>
            </ul>
          </div>

          {/* Setup & Legal */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Deployment & Legal
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={onOpenSettings}
                  className="hover:text-white transition-colors flex items-center gap-1.5 text-left"
                >
                  <Database className="w-3.5 h-3.5 text-fuchsia-400" />
                  <span>Supabase & Vercel Setup</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenPrivacy}
                  className="hover:text-white transition-colors text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenTerms}
                  className="hover:text-white transition-colors text-left"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <span className="text-xs text-purple-400/60">
                  Vercel Production Compatible
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-purple-500/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} VibeMate Inc. All rights reserved.</p>
          <p className="flex items-center gap-1 text-purple-300/60">
            Crafted with <Heart className="w-3 h-3 text-pink-500 fill-pink-500" /> for thinkers, learners, and dreamers.
          </p>
        </div>
      </div>
    </footer>
  );
};
