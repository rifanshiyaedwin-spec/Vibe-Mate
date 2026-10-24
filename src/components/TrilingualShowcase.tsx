import React, { useState } from 'react';
import { Globe, Sparkles, MessageCircle, ArrowRight, Volume2 } from 'lucide-react';
import { CompanionLanguage } from '../types/database';

interface TrilingualShowcaseProps {
  onStartWithLanguage: (language: CompanionLanguage) => void;
}

export const TrilingualShowcase: React.FC<TrilingualShowcaseProps> = ({ onStartWithLanguage }) => {
  const [selectedLang, setSelectedLang] = useState<CompanionLanguage>('tanglish');

  const langData = {
    tanglish: {
      title: 'Tanglish (Colloquial & Lively)',
      subtitle: 'Tamil written in English script — exactly how friends chat on WhatsApp & Discord.',
      flag: '⚡',
      badge: 'Youth & Tech Favorite',
      dialogue: [
        {
          speaker: 'User',
          text: 'Bro, sema stress-ah irukku. Tomorrow morning seminar presentation vechirukaanga. Slides innum ready aagala!',
        },
        {
          speaker: 'VibeMate',
          text: 'Pathal padadha bro! First 5 key points list pannu. Title, Problem, Solution, Demo, Conclusion. Ovvoru slide-kum 2 mins pesuna podhum, total 10 mins mass kaatidalaam! Naan outline ezhudhi tharava?',
        },
      ],
      quickSuggestions: [
        'Enaku oru motivational Tanglish quote sollu!',
        'Weekend chill panna Chennai la best spots enna?',
        'Coding interview-ku epdi prepare panradhu?',
      ],
    },
    tamil: {
      title: 'தமிழ் (Pure & Modern Tamil)',
      subtitle: 'அழகான, இனிமையான தமிழ்ச் சொற்களுடன் ஆழ்ந்த உரையாடல்கள்.',
      flag: '🪷',
      badge: 'செம்மொழித் தமிழ்',
      dialogue: [
        {
          speaker: 'User',
          text: 'வணக்கம்! என் வாழ்க்கையில் ஒரு புதிய இலக்கை நிர்ணயிக்க வேண்டும். மனம் ஒருமுகப்பட என்ன செய்ய வேண்டும்?',
        },
        {
          speaker: 'VibeMate',
          text: 'வணக்கம் நண்பரே! ஒரு பெரிய இலக்கை நோக்கிச் செல்வதற்கு முன், அதனைச் சிறிய தினசரிப் பழக்கங்களாக மாற்றுங்கள். நாள்தோறும் காலையில் 10 நிமிடம் அமைதியாகத் தியானித்து உங்கள் முதன்மைப் பணியைத் தொடங்குங்கள். உங்கள் முயற்சி வெல்லும்! ✨',
        },
      ],
      quickSuggestions: [
        'திருக்குறளில் இருந்து ஊக்கமளிக்கும் ஒரு குறள் கூறுங்கள்.',
        'நேர மேலாண்மைக்குச் சிறந்த 3 வழிகள் என்ன?',
        'மழைக்கால மாலைக்கு ஏற்ற கவிதை ஒன்று எழுதுங்கள்.',
      ],
    },
    english: {
      title: 'English (Fluent & Articulate)',
      subtitle: 'Nuanced, global, and clear communication for studies, work, and personal growth.',
      flag: '🌐',
      badge: 'Global Fluency',
      dialogue: [
        {
          speaker: 'User',
          text: 'I’ve been struggling with imposter syndrome at my new engineering job. Everyone seems way smarter than me.',
        },
        {
          speaker: 'VibeMate',
          text: 'That feeling is extraordinarily common, especially among high performers. Remember: they hired you because you demonstrated real competence. Your job isn’t to know everything on day one—it’s to stay curious and ask great questions. You belong in that room.',
        },
      ],
      quickSuggestions: [
        'Help me write a respectful follow-up email to a recruiter.',
        'Explain distributed systems consistency models clearly.',
        'Give me a 5-minute wind-down routine for better sleep.',
      ],
    },
  };

  const active = langData[selectedLang];

  return (
    <section id="trilingual" className="py-24 relative overflow-hidden">
      {/* Background ambient decorative shapes */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-80 h-80 bg-fuchsia-600/15 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-950/50 border border-pink-500/30 text-pink-300 text-xs font-semibold mb-4">
            <Globe className="w-3.5 h-3.5 text-pink-400" />
            <span>AUTHENTIC MULTILINGUAL SUPPORT</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4 font-['Plus_Jakarta_Sans']">
            Talk the way you{' '}
            <span className="bg-gradient-to-r from-pink-400 via-fuchsia-300 to-purple-400 bg-clip-text text-transparent">
              actually think.
            </span>
          </h2>
          <p className="text-purple-200/70 text-base sm:text-lg">
            No robotic literal translations. VibeMate naturally adapts to cultural slang, casual vibes, and formal respect across three languages.
          </p>
        </div>

        {/* Language Tabs */}
        <div className="flex justify-center mb-10">
          <div className="p-1.5 rounded-2xl glass-panel border border-purple-500/30 flex flex-wrap gap-2 max-w-xl w-full justify-center">
            {(['tanglish', 'tamil', 'english'] as CompanionLanguage[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLang(lang)}
                className={`flex-1 min-w-[140px] py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                  selectedLang === lang
                    ? 'bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 text-white shadow-[0_0_20px_rgba(236,72,153,0.35)]'
                    : 'text-purple-300 hover:text-white hover:bg-purple-900/20'
                }`}
              >
                <span>{langData[lang].flag}</span>
                <span>{lang === 'tanglish' ? 'Tanglish' : lang === 'tamil' ? 'தமிழ் (Tamil)' : 'English'}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Language Display Card */}
        <div className="max-w-4xl mx-auto">
          <div className="rounded-3xl glass-card border border-purple-500/30 p-6 sm:p-10 shadow-2xl relative">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-purple-500/20">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-xl sm:text-2xl font-black text-white">{active.title}</h3>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/40">
                    {active.badge}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-purple-300/70 mt-1">{active.subtitle}</p>
              </div>

              <button
                onClick={() => onStartWithLanguage(selectedLang)}
                className="px-5 py-2.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 hover:text-white font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 self-start sm:self-auto"
              >
                <span>Chat in {selectedLang === 'tamil' ? 'தமிழ்' : selectedLang}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Conversation Simulation */}
            <div className="py-8 space-y-6">
              {active.dialogue.map((turn, i) => (
                <div
                  key={i}
                  className={`flex ${turn.speaker === 'User' ? 'justify-end' : 'justify-start items-start gap-3'}`}
                >
                  {turn.speaker === 'VibeMate' && (
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xs shadow-md flex-shrink-0 mt-1">
                      VM
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] p-4 sm:p-5 rounded-2xl ${
                      turn.speaker === 'User'
                        ? 'bg-purple-700/60 border border-purple-400/30 text-white rounded-tr-sm text-sm sm:text-base leading-relaxed'
                        : 'bg-[#150D2B] border border-purple-500/30 text-purple-100 rounded-tl-sm text-sm sm:text-base leading-relaxed'
                    }`}
                  >
                    <p className="text-[11px] font-bold text-purple-400 mb-1">{turn.speaker}</p>
                    <p>{turn.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Suggestion Chips */}
            <div className="pt-6 border-t border-purple-500/20">
              <p className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-3">
                Suggested questions for this vibe:
              </p>
              <div className="flex flex-wrap gap-2">
                {active.quickSuggestions.map((sugg, idx) => (
                  <button
                    key={idx}
                    onClick={() => onStartWithLanguage(selectedLang)}
                    className="text-left text-xs text-purple-200/90 bg-purple-950/60 hover:bg-purple-900/60 hover:text-white px-3.5 py-2 rounded-xl border border-purple-500/20 hover:border-purple-400/50 transition-all flex items-center gap-2"
                  >
                    <Sparkles className="w-3 h-3 text-pink-400" />
                    <span>{sugg}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
