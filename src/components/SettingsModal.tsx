import React, { useState } from 'react';
import { X, User, Sparkles, Database, Rocket, Copy, Check, Shield, Globe, Key, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CompanionPersona, CompanionLanguage } from '../types/database';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { user, profile, updateProfilePreferences, isSupabaseLive } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'preferences' | 'database' | 'vercel'>('preferences');
  
  // Preference states
  const [displayName, setDisplayName] = useState(profile?.display_name || user?.full_name || '');
  const [persona, setPersona] = useState<CompanionPersona>(profile?.companion_persona || 'friendly');
  const [language, setLanguage] = useState<CompanionLanguage>(profile?.preferred_language || 'english');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);

  if (!isOpen) return null;

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfilePreferences(persona, language, displayName);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const sqlSchemaSnippet = `-- Copy into Supabase Studio -> SQL Editor -> Run
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    display_name TEXT,
    avatar_url TEXT,
    preferred_language TEXT DEFAULT 'english',
    companion_persona TEXT DEFAULT 'friendly',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'New Conversation',
    persona TEXT DEFAULT 'friendly',
    language TEXT DEFAULT 'english',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own profiles" ON public.profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users can manage own conversations" ON public.conversations FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own messages" ON public.messages FOR ALL USING (auth.uid() = user_id);`;

  const copyToClipboard = (text: string, type: 'sql' | 'env') => {
    navigator.clipboard.writeText(text);
    if (type === 'sql') {
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 2000);
    } else {
      setCopiedEnv(true);
      setTimeout(() => setCopiedEnv(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl rounded-3xl glass-card border border-purple-500/30 bg-[#0e081c] p-6 sm:p-8 shadow-[0_0_60px_rgba(168,85,247,0.25)] max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-purple-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-['Plus_Jakarta_Sans']">
                VibeMate Settings & Architecture
              </h2>
              <p className="text-xs text-purple-400">Configure personal vibe & Supabase/Vercel settings</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-purple-300 hover:text-white hover:bg-purple-900/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-purple-500/20 my-4 gap-2">
          <button
            onClick={() => setActiveTab('preferences')}
            className={`py-2 px-4 text-xs sm:text-sm font-semibold rounded-t-xl transition-colors flex items-center gap-2 ${
              activeTab === 'preferences'
                ? 'bg-purple-950/60 text-white border-b-2 border-fuchsia-400'
                : 'text-purple-300/70 hover:text-white'
            }`}
          >
            <User className="w-4 h-4 text-fuchsia-400" />
            <span>Preferences</span>
          </button>

          <button
            onClick={() => setActiveTab('database')}
            className={`py-2 px-4 text-xs sm:text-sm font-semibold rounded-t-xl transition-colors flex items-center gap-2 ${
              activeTab === 'database'
                ? 'bg-purple-950/60 text-white border-b-2 border-fuchsia-400'
                : 'text-purple-300/70 hover:text-white'
            }`}
          >
            <Database className="w-4 h-4 text-fuchsia-400" />
            <span>Supabase Setup</span>
            <span className={`w-2 h-2 rounded-full ${isSupabaseLive ? 'bg-emerald-400' : 'bg-amber-400'}`} />
          </button>

          <button
            onClick={() => setActiveTab('vercel')}
            className={`py-2 px-4 text-xs sm:text-sm font-semibold rounded-t-xl transition-colors flex items-center gap-2 ${
              activeTab === 'vercel'
                ? 'bg-purple-950/60 text-white border-b-2 border-fuchsia-400'
                : 'text-purple-300/70 hover:text-white'
            }`}
          >
            <Rocket className="w-4 h-4 text-fuchsia-400" />
            <span>Vercel Deployment</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-5">
          
          {/* TAB 1: PREFERENCES */}
          {activeTab === 'preferences' && (
            <form onSubmit={handleSavePreferences} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-purple-200 uppercase tracking-wider mb-1.5">
                  Your Display Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-purple-950/50 border border-purple-500/30 text-white text-sm focus:border-fuchsia-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-purple-200 uppercase tracking-wider mb-1.5">
                  Default Companion Persona
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { id: 'friendly', name: 'Friendly Companion', desc: 'Empathetic & supportive' },
                    { id: 'study_buddy', name: 'Study Buddy', desc: 'Concept breakdowns & quizzes' },
                    { id: 'creative_muse', name: 'Creative Muse', desc: 'Storytelling & brainstorming' },
                    { id: 'productivity_coach', name: 'Productivity Coach', desc: 'Action items & focus sprints' },
                  ].map((p) => (
                    <div
                      key={p.id}
                      onClick={() => setPersona(p.id as CompanionPersona)}
                      className={`p-3 rounded-xl cursor-pointer border transition-all ${
                        persona === p.id
                          ? 'bg-purple-900/60 border-fuchsia-400 text-white'
                          : 'bg-purple-950/40 border-purple-500/20 text-purple-300 hover:border-purple-400/50'
                      }`}
                    >
                      <p className="text-xs font-bold text-white">{p.name}</p>
                      <p className="text-[11px] text-purple-400/80">{p.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-purple-200 uppercase tracking-wider mb-1.5">
                  Default Language
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'tanglish', name: '⚡ Tanglish', desc: 'Tamil in English script' },
                    { id: 'tamil', name: '🪷 தமிழ்', desc: 'Pure & modern Tamil' },
                    { id: 'english', name: '🌐 English', desc: 'Fluent global tone' },
                  ].map((l) => (
                    <div
                      key={l.id}
                      onClick={() => setLanguage(l.id as CompanionLanguage)}
                      className={`p-3 rounded-xl cursor-pointer border transition-all ${
                        language === l.id
                          ? 'bg-purple-900/60 border-fuchsia-400 text-white'
                          : 'bg-purple-950/40 border-purple-500/20 text-purple-300 hover:border-purple-400/50'
                      }`}
                    >
                      <p className="text-xs font-bold text-white">{l.name}</p>
                      <p className="text-[10px] text-purple-400/80">{l.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                {savedSuccess && (
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <Check className="w-4 h-4" />
                    <span>Preferences updated!</span>
                  </span>
                )}
                <button
                  type="submit"
                  className="ml-auto py-2.5 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-sm shadow-md hover:from-purple-500 hover:to-pink-500 transition-all"
                >
                  Save Preferences
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: DATABASE & SUPABASE */}
          {activeTab === 'database' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-purple-950/60 border border-purple-500/30 flex items-start gap-3">
                <Database className="w-5 h-5 text-fuchsia-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-purple-200 leading-relaxed">
                  <p className="font-bold text-white mb-1">
                    Supabase PostgreSQL Connection Status:{' '}
                    <span className={isSupabaseLive ? 'text-emerald-400' : 'text-amber-400'}>
                      {isSupabaseLive ? 'Connected & Live' : 'Pending Configuration (Local Mode Active)'}
                    </span>
                  </p>
                  <p className="text-purple-300/80">
                    When configured, all conversations, messages, and profiles are secured with Row Level Security (RLS). When keys are absent, VibeMate gracefully stores data in browser local storage so testing is never blocked.
                  </p>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-purple-200 uppercase tracking-wider">
                    PostgreSQL Migration SQL
                  </span>
                  <button
                    onClick={() => copyToClipboard(sqlSchemaSnippet, 'sql')}
                    className="text-xs text-fuchsia-300 hover:text-white flex items-center gap-1 transition-colors"
                  >
                    {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSql ? 'Copied SQL!' : 'Copy SQL Script'}</span>
                  </button>
                </div>
                <pre className="p-3.5 rounded-xl bg-black/60 border border-purple-500/30 text-[11px] font-mono text-purple-200 overflow-x-auto max-h-48 leading-relaxed">
                  {sqlSchemaSnippet}
                </pre>
              </div>

              <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/20 text-xs space-y-2">
                <p className="font-bold text-white">How to connect Supabase in 2 minutes:</p>
                <ol className="list-decimal list-inside space-y-1 text-purple-300/80">
                  <li>Create a free project at <span className="text-fuchsia-300">supabase.com</span>.</li>
                  <li>Go to <strong>SQL Editor</strong>, paste the SQL script above, and click <strong>Run</strong>.</li>
                  <li>In <strong>Authentication &gt; URL Configuration</strong>, add your site URL to <strong>Redirect URLs</strong>.</li>
                  <li>Add <code className="text-fuchsia-300">NEXT_PUBLIC_SUPABASE_URL</code> and <code className="text-fuchsia-300">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to your environment variables.</li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 3: VERCEL DEPLOYMENT */}
          {activeTab === 'vercel' && (
            <div className="space-y-4 text-xs text-purple-200">
              <div className="p-4 rounded-2xl bg-purple-950/60 border border-purple-500/30 flex items-start gap-3">
                <Rocket className="w-5 h-5 text-fuchsia-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white mb-1">Production Vercel Deployment Ready</h4>
                  <p className="text-purple-300/80">
                    VibeMate includes official App Router endpoints (<code className="text-fuchsia-300">src/app/api/chat/route.ts</code>), TypeScript build configurations, and zero conflicting dependencies.
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                <h5 className="font-bold text-white uppercase tracking-wider text-[11px]">
                  Vercel Environment Variables:
                </h5>
                <div className="p-3 rounded-xl bg-black/60 border border-purple-500/30 font-mono text-[11px] text-purple-300 space-y-1.5">
                  <p><span className="text-pink-400">GEMINI_API_KEY</span>=your-gemini-key</p>
                  <p><span className="text-pink-400">NEXT_PUBLIC_SUPABASE_URL</span>=https://xxx.supabase.co</p>
                  <p><span className="text-pink-400">NEXT_PUBLIC_SUPABASE_ANON_KEY</span>=your-anon-key</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/20 space-y-2">
                <h5 className="font-bold text-white">Vercel Deployment Checklist:</h5>
                <ul className="list-disc list-inside space-y-1 text-purple-300/80">
                  <li>Push this repository to GitHub or GitLab.</li>
                  <li>In Vercel dashboard, click <strong>Add New Project</strong> and import the repository.</li>
                  <li>In <strong>Environment Variables</strong>, enter <code className="text-fuchsia-300">GEMINI_API_KEY</code>, <code className="text-fuchsia-300">NEXT_PUBLIC_SUPABASE_URL</code>, and <code className="text-fuchsia-300">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>.</li>
                  <li>Click <strong>Deploy</strong>. Vercel automatically runs the build and delivers your custom URL!</li>
                </ul>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
