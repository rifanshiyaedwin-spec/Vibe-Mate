import React from 'react';
import { Heart, GraduationCap, Palette, Target, Cpu, Shield, Globe2, Sparkles, MessageSquare, ArrowRight } from 'lucide-react';

interface FeaturesProps {
  onSelectPersona: (persona: 'friendly' | 'study_buddy' | 'creative_muse' | 'productivity_coach') => void;
}

export const Features: React.FC<FeaturesProps> = ({ onSelectPersona }) => {
  const personas = [
    {
      id: 'friendly' as const,
      title: 'Everyday Companion',
      badge: 'Empathetic & Warm',
      icon: Heart,
      color: 'from-pink-500 to-rose-500',
      glow: 'hover:shadow-[0_0_35px_rgba(244,63,94,0.35)]',
      border: 'border-pink-500/30 hover:border-pink-400',
      description:
        'A warm, non-judgmental presence when you need to decompress after a long day, share excitement over small wins, or talk through emotional highs and lows.',
      samplePrompt: '“Today felt exhausting and I just need someone to talk to...”'
    },
    {
      id: 'study_buddy' as const,
      title: 'Study & Learning Buddy',
      badge: 'Socratic & Clear',
      icon: GraduationCap,
      color: 'from-purple-500 to-indigo-500',
      glow: 'hover:shadow-[0_0_35px_rgba(168,85,247,0.35)]',
      border: 'border-purple-500/30 hover:border-purple-400',
      description:
        'Breaks down dense academic concepts into intuitive analogies, generates practice quizzes, creates structured revision timetables, and tests your understanding.',
      samplePrompt: '“Explain how neural network backpropagation works using a simple cooking analogy.”'
    },
    {
      id: 'creative_muse' as const,
      title: 'Creative Muse',
      badge: 'Imaginative & Bold',
      icon: Palette,
      color: 'from-fuchsia-500 to-amber-500',
      glow: 'hover:shadow-[0_0_35px_rgba(217,70,239,0.35)]',
      border: 'border-fuchsia-500/30 hover:border-fuchsia-400',
      description:
        'Your late-night brainstorming co-creator. Develop screenplay plots, write heartfelt song lyrics, craft fantasy lore, or shatter stubborn creative blocks.',
      samplePrompt: '“Help me write a plot twist for a cyber-detective mystery set in futuristic Chennai.”'
    },
    {
      id: 'productivity_coach' as const,
      title: 'Productivity Coach',
      badge: 'Action-Oriented',
      icon: Target,
      color: 'from-emerald-500 to-cyan-500',
      glow: 'hover:shadow-[0_0_35px_rgba(16,185,129,0.35)]',
      border: 'border-emerald-500/30 hover:border-emerald-400',
      description:
        'Turns daunting, messy to-do lists into 15-minute actionable micro-steps. Keeps you accountable with gentle momentum and zero shame.',
      samplePrompt: '“I have a project due in 48 hours and haven’t started. Break down step 1 for me.”'
    }
  ];

  const architecturalFeatures = [
    {
      icon: Cpu,
      title: 'Real Gemini 3.8 Flash AI',
      description: 'Zero hardcoded replies or fake templates. Every interaction is evaluated live by Google’s cutting-edge Gemini model with low latency.'
    },
    {
      icon: Globe2,
      title: 'Native Trilingual Fluency',
      description: 'Seamlessly switch between English, Tamil (தமிழ்), and Tanglish. Understands cultural idioms, colloquial slangs, and nuanced humor.'
    },
    {
      icon: Shield,
      title: 'PostgreSQL & Supabase RLS',
      description: 'Your messages and conversations are strictly isolated with database-level Row Level Security (RLS). You alone own your data.'
    },
    {
      icon: Sparkles,
      title: 'Dynamic Context Memory',
      description: 'Maintains ongoing dialogue thread memory across each session so you never have to repeat your backstory or project goals.'
    }
  ];

  return (
    <section id="personas" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/40 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" />
            <span>PERSONAS CRAFTED FOR REAL LIFE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4 font-['Plus_Jakarta_Sans']">
            Tailored companions for{' '}
            <span className="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-pink-400 bg-clip-text text-transparent">
              every mental state.
            </span>
          </h2>
          <p className="text-purple-200/70 text-base sm:text-lg">
            Switch effortlessly between emotional support, deep studying, creative flow, and ruthless execution.
          </p>
        </div>

        {/* 4 Personas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-20">
          {personas.map((persona) => {
            const Icon = persona.icon;
            return (
              <div
                key={persona.id}
                className={`relative rounded-3xl p-7 glass-card border transition-all duration-300 group flex flex-col justify-between ${persona.border} ${persona.glow}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${persona.color} flex items-center justify-center text-white shadow-lg`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/30 text-purple-200">
                      {persona.badge}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
                    {persona.title}
                  </h3>
                  <p className="text-purple-200/80 text-sm sm:text-base leading-relaxed mb-5">
                    {persona.description}
                  </p>

                  <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/20 mb-6">
                    <p className="text-xs text-purple-400 font-semibold mb-1">Try asking:</p>
                    <p className="text-xs text-purple-200 italic">{persona.samplePrompt}</p>
                  </div>
                </div>

                <button
                  onClick={() => onSelectPersona(persona.id)}
                  className="w-full py-3 rounded-xl bg-purple-900/30 hover:bg-purple-600/30 border border-purple-500/30 hover:border-purple-400/60 text-purple-100 font-semibold text-sm transition-all flex items-center justify-center gap-2 group-hover:text-white"
                >
                  <MessageSquare className="w-4 h-4 text-fuchsia-400" />
                  <span>Chat as {persona.title}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Technical Architecture & Safety Pillars */}
        <div id="features" className="pt-12 border-t border-purple-500/20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h3 className="text-2xl sm:text-3xl font-black text-white mb-3">
              Engineered for speed, privacy, and zero slop.
            </h3>
            <p className="text-sm sm:text-base text-purple-300/70">
              Built on production standards with real backend verification.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {architecturalFeatures.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl glass-card border border-purple-500/20 hover:border-purple-400/40 transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-900/50 border border-purple-500/30 flex items-center justify-center text-fuchsia-400 mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-white mb-2">{feat.title}</h4>
                  <p className="text-xs sm:text-sm text-purple-200/70 leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
