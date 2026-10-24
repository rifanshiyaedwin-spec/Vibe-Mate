import React, { useState } from 'react';
import { Sparkles, MessageSquare, ArrowRight, ShieldCheck, Zap, Heart, BookOpen, Wand2, Compass } from 'lucide-react';

interface HeroProps {
  onStartChatting: () => void;
  onExplorePersonas: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartChatting, onExplorePersonas }) => {
  const [activeTab, setActiveTab] = useState<'english' | 'tamil' | 'tanglish'>('tanglish');

  const chatPreviews = {
    english: {
      user: "I have 3 exams next week and I feel so overwhelmed. How do I start without freezing?",
      reply: "Take a deep breath with me. 🌿 Let's not tackle all three at once. Pick just the first subject, and we'll do one 20-minute chunk together. I'm right here with you—what's the first topic on your syllabus?",
      tag: "Friendly & Study Buddy"
    },
    tamil: {
      user: "இன்று நாள் முழுவதும் ரொம்ப சோர்வா இருக்கு. கொஞ்சம் உற்சாகமான வார்த்தைகள் சொல்ல முடியுமா?",
      reply: "சில நாட்கள் கடினமாக இருப்பது இயல்பு தான் நண்பா! 🌸 உங்களுடைய கடின உழைப்பு ஒருபோதும் வீண் போகாது. சிறிது நேரம் ஓய்வெடுத்து ஒரு கப் டீ குடியுங்கள், புது நம்பிக்கையோடு தொடங்குவோம்! நான் உங்களுடன் இருக்கிறேன். ✨",
      tag: "Empathetic Tamil"
    },
    tanglish: {
      user: "Machan, sema lazy-ah irukku. Oru simple workout & study plan thara mudiyuma?",
      reply: "Don't worry machan, chill! 😎 First 5 mins stretching pannu, blood circulation set aagum. Adhukku apram 25 mins Pomodoro focus session. Target mudichitu mass-ah oru coffee break edukalaam. Ready-ah?",
      tag: "Vibrant Tanglish"
    }
  };

  const currentPreview = chatPreviews[activeTab];

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-purple-800/25 via-fuchsia-600/20 to-pink-600/15 rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse-slow" />
      <div className="absolute top-1/2 -left-32 w-96 h-96 bg-purple-700/20 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-pink-700/20 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card border border-purple-500/30 text-purple-200 text-xs sm:text-sm font-semibold mb-6 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
            <Sparkles className="w-4 h-4 text-fuchsia-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Next-Gen Emotional & Cognitive AI Companion</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          </div>

          {/* Hero Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1] font-['Plus_Jakarta_Sans'] mb-6">
            Your Space.{' '}
            <span className="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-pink-400 bg-clip-text text-transparent glow-text">
              Your Vibe.
            </span>
          </h1>

          {/* Subtitle description */}
          <p className="text-lg sm:text-xl text-purple-200/80 leading-relaxed font-normal mb-10 max-w-2xl mx-auto">
            Meet <strong className="text-white font-semibold">VibeMate</strong>—your private, emotionally tuned companion. 
            Whether you need a late-night study partner, an imaginative creative muse, a structured productivity coach, or a trusted friend who speaks fluent <span className="text-fuchsia-300 font-medium">English</span>, <span className="text-pink-300 font-medium">தமிழ்</span>, or <span className="text-purple-300 font-medium">Tanglish</span>.
          </p>

          {/* Dual CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={onStartChatting}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-500 hover:via-fuchsia-500 hover:to-pink-500 shadow-[0_0_35px_rgba(168,85,247,0.4)] hover:shadow-[0_0_45px_rgba(236,72,153,0.6)] transition-all flex items-center justify-center gap-2 group active:scale-95"
            >
              <MessageSquare className="w-5 h-5 text-white" />
              <span>Start Chatting Free</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onExplorePersonas}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl text-base font-semibold text-purple-200 glass-card hover:bg-purple-900/30 border border-purple-500/30 hover:border-purple-400/60 transition-all flex items-center justify-center gap-2"
            >
              <Compass className="w-5 h-5 text-purple-400" />
              <span>Explore Personas</span>
            </button>
          </div>

          {/* Trust points */}
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto text-xs sm:text-sm text-purple-300/70 border-t border-purple-500/20 pt-6">
            <div className="flex flex-col items-center gap-1">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Gemini 3.8 Flash</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Supabase RLS</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Heart className="w-4 h-4 text-pink-400" />
              <span>Zero Judgment</span>
            </div>
          </div>
        </div>

        {/* Live Interactive Chat Preview Card */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="relative rounded-3xl p-1 bg-gradient-to-b from-purple-500/40 via-purple-900/20 to-transparent shadow-[0_0_60px_-15px_rgba(168,85,247,0.35)]">
            <div className="rounded-[22px] bg-[#100922]/90 backdrop-blur-2xl border border-purple-500/20 p-5 sm:p-8">
              
              {/* Preview Window Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-purple-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white font-bold shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      <span>VibeMate Live Preview</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    </h2>
                    <p className="text-xs text-purple-300/60 font-medium">
                      Simulated Real-Time Gemini Intelligence
                    </p>
                  </div>
                </div>

                {/* Language Switcher Tabs for preview */}
                <div className="flex items-center gap-1 p-1 rounded-xl bg-purple-950/80 border border-purple-500/30">
                  <button
                    onClick={() => setActiveTab('tanglish')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      activeTab === 'tanglish'
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-sm'
                        : 'text-purple-300 hover:text-white'
                    }`}
                  >
                    Tanglish
                  </button>
                  <button
                    onClick={() => setActiveTab('tamil')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      activeTab === 'tamil'
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-sm'
                        : 'text-purple-300 hover:text-white'
                    }`}
                  >
                    தமிழ் (Tamil)
                  </button>
                  <button
                    onClick={() => setActiveTab('english')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      activeTab === 'english'
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-sm'
                        : 'text-purple-300 hover:text-white'
                    }`}
                  >
                    English
                  </button>
                </div>
              </div>

              {/* Chat Message Simulation */}
              <div className="py-6 space-y-5">
                {/* User Message */}
                <div className="flex justify-end">
                  <div className="max-w-[85%] sm:max-w-[70%] rounded-2xl rounded-tr-sm bg-gradient-to-r from-purple-700/80 to-fuchsia-700/80 p-4 border border-purple-400/30 text-white text-sm sm:text-base leading-relaxed shadow-lg">
                    {currentPreview.user}
                  </div>
                </div>

                {/* AI Companion Reply */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-500 to-pink-500 flex-shrink-0 flex items-center justify-center text-white text-xs font-bold mt-1 shadow-[0_0_12px_rgba(236,72,153,0.4)]">
                    VM
                  </div>
                  <div className="max-w-[90%] sm:max-w-[80%] rounded-2xl rounded-tl-sm bg-[#1A1033] p-4 sm:p-5 border border-purple-500/30 text-purple-100 text-sm sm:text-base leading-relaxed shadow-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-fuchsia-300">
                        {currentPreview.tag}
                      </span>
                      <span className="text-purple-400/40 text-xs">• Just now</span>
                    </div>
                    <p className="whitespace-pre-line">{currentPreview.reply}</p>
                  </div>
                </div>
              </div>

              {/* Preview Footer Interactive Callout */}
              <div className="pt-4 border-t border-purple-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-purple-300/70">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-fuchsia-400" />
                  <span>Supports 4 dynamic personas: Friendly, Study, Creative & Productivity.</span>
                </div>
                <button
                  onClick={onStartChatting}
                  className="font-bold text-fuchsia-300 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>Experience full conversation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
