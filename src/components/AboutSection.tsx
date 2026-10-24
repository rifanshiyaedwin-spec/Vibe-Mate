import React from 'react';
import { Shield, Sparkles, Lock, Flame, Award, HeartHandshake } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Banner */}
        <div className="relative rounded-3xl p-8 sm:p-14 glass-card border border-purple-500/30 overflow-hidden shadow-2xl mb-16">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-pink-600/20 rounded-full blur-[100px] pointer-events-none" />

          <div className="max-w-3xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/50 border border-purple-500/40 text-purple-300 text-xs font-semibold mb-6">
              <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" />
              <span>THE VIBEMATE PHILOSOPHY</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-6 font-['Plus_Jakarta_Sans']">
              Built for people who want{' '}
              <span className="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-pink-400 bg-clip-text text-transparent">
                authentic connection,
              </span>{' '}
              not robotic lectures.
            </h2>

            <p className="text-base sm:text-lg text-purple-200/80 leading-relaxed mb-8">
              Most AI assistants sound like sterile corporate HR manuals. They lecture you, evade real emotional nuance, and completely miss cultural humor.
              <br /><br />
              <strong>VibeMate was built on a different thesis:</strong> AI should feel like walking into your favorite comfort room. A space where you don’t have to mask, where you can speak your native tongue or casual Tanglish, brainstorm absurd dreams, or get serious about acing your semester exams.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-purple-500/20">
              <div>
                <div className="text-2xl sm:text-3xl font-black text-fuchsia-300 mb-1">0% Slop</div>
                <p className="text-xs text-purple-300/70">No fake personas or repetitive boilerplate templates.</p>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-pink-300 mb-1">100% Private</div>
                <p className="text-xs text-purple-300/70">Row-level isolation. Your thoughts stay yours.</p>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-purple-300 mb-1">Sub-Second</div>
                <p className="text-xs text-purple-300/70">Gemini 3.8 Flash delivers ultra-responsive conversation.</p>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Core Values Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl glass-card border border-purple-500/20 hover:border-purple-400/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-purple-900/60 border border-purple-500/30 flex items-center justify-center text-fuchsia-400 mb-6">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Radical Empathy</h3>
            <p className="text-sm text-purple-200/75 leading-relaxed">
              We engineered VibeMate’s instructions to actively listen first. Whether you’re celebrating getting an offer or venting about burnout, you receive genuine emotional validation.
            </p>
          </div>

          <div className="p-8 rounded-3xl glass-card border border-purple-500/20 hover:border-purple-400/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-purple-900/60 border border-purple-500/30 flex items-center justify-center text-pink-400 mb-6">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Absolute Data Autonomy</h3>
            <p className="text-sm text-purple-200/75 leading-relaxed">
              With Supabase Row Level Security (RLS) and PostgreSQL policies, only your authenticated token can query or mutate your chat sessions. We never monetize or sell your chats.
            </p>
          </div>

          <div className="p-8 rounded-3xl glass-card border border-purple-500/20 hover:border-purple-400/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-purple-900/60 border border-purple-500/30 flex items-center justify-center text-amber-400 mb-6">
              <Flame className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Cultural Resonance</h3>
            <p className="text-sm text-purple-200/75 leading-relaxed">
              Language is identity. VibeMate treats Tamil and Tanglish as first-class citizens, respecting the warmth, humor, cinema references, and colloquial expressions that make conversation joyous.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
