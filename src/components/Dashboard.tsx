import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Send, 
  Plus, 
  MessageSquare, 
  Trash2, 
  Edit2, 
  Check, 
  X, 
  Volume2, 
  Copy, 
  RefreshCw, 
  Settings as SettingsIcon, 
  LogOut, 
  Menu, 
  Mic, 
  MicOff, 
  Download, 
  Share2, 
  AlertCircle,
  Heart,
  GraduationCap,
  Palette,
  Target,
  Globe2,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { 
  Conversation, 
  Message, 
  CompanionPersona, 
  CompanionLanguage 
} from '../types/database';
import { 
  getConversations, 
  createConversation, 
  updateConversation, 
  deleteConversation, 
  getMessages, 
  saveMessage 
} from '../lib/storage';

interface DashboardProps {
  onOpenSettings: () => void;
  onNavigateHome: () => void;
  defaultPersona?: CompanionPersona;
  defaultLanguage?: CompanionLanguage;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onOpenSettings,
  onNavigateHome,
  defaultPersona = 'friendly',
  defaultLanguage = 'english',
}) => {
  const { user, profile, signOut, isSupabaseLive } = useAuth();
  
  // State
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [errorBanner, setErrorBanner] = useState<{ message: string; retryable?: boolean } | null>(null);
  
  // Inline rename state
  const [editingConvId, setEditingConvId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  // Speech recognition state
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Active persona and language for current chat
  const [currentPersona, setCurrentPersona] = useState<CompanionPersona>(defaultPersona);
  const [currentLanguage, setCurrentLanguage] = useState<CompanionLanguage>(defaultLanguage);

  // Auto-scroll ref
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConversation = conversations.find((c) => c.id === activeConvId);

  // Scroll to bottom helper
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  // Load conversations on mount
  useEffect(() => {
    if (!user) return;
    async function loadData() {
      const convList = await getConversations(user!.id);
      setConversations(convList);
      if (convList.length > 0) {
        setActiveConvId(convList[0].id);
        setCurrentPersona(convList[0].persona || defaultPersona);
        setCurrentLanguage(convList[0].language || defaultLanguage);
      } else {
        // Automatically create a first welcoming conversation
        handleNewChat();
      }
    }
    loadData();
  }, [user]);

  // Load messages when activeConvId changes
  useEffect(() => {
    if (!user || !activeConvId) {
      setMessages([]);
      return;
    }
    async function loadConvMessages() {
      const msgs = await getMessages(activeConvId!, user!.id);
      setMessages(msgs);
      setTimeout(() => scrollToBottom('auto'), 50);
    }
    loadConvMessages();
  }, [activeConvId, user]);

  // Sync active conv persona / language
  useEffect(() => {
    if (activeConversation) {
      setCurrentPersona(activeConversation.persona);
      setCurrentLanguage(activeConversation.language);
    }
  }, [activeConvId]);

  // Scroll on new message
  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Create New Chat
  const handleNewChat = async (
    customPersona?: CompanionPersona,
    customLanguage?: CompanionLanguage
  ) => {
    if (!user) return;
    const personaToUse = customPersona || profile?.companion_persona || defaultPersona;
    const langToUse = customLanguage || profile?.preferred_language || defaultLanguage;

    const newConv = await createConversation(
      user.id,
      'New Conversation',
      personaToUse,
      langToUse
    );

    setConversations((prev) => [newConv, ...prev]);
    setActiveConvId(newConv.id);
    setCurrentPersona(personaToUse);
    setCurrentLanguage(langToUse);
    setMessages([]);
    setSidebarOpen(false);
    setErrorBanner(null);
  };

  // Change active conversation
  const handleSelectConv = (conv: Conversation) => {
    setActiveConvId(conv.id);
    setCurrentPersona(conv.persona);
    setCurrentLanguage(conv.language);
    setSidebarOpen(false);
    setErrorBanner(null);
  };

  // Rename Conversation
  const handleStartRename = (conv: Conversation, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingConvId(conv.id);
    setEditTitle(conv.title);
  };

  const handleSaveRename = async (convId: string, e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!user || !editTitle.trim()) {
      setEditingConvId(null);
      return;
    }
    await updateConversation(user.id, convId, { title: editTitle.trim() });
    setConversations((prev) =>
      prev.map((c) => (c.id === convId ? { ...c, title: editTitle.trim() } : c))
    );
    setEditingConvId(null);
  };

  // Delete Conversation
  const handleDeleteConv = async (convId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    if (!confirm('Are you sure you want to delete this conversation?')) return;

    await deleteConversation(user.id, convId);
    const updated = conversations.filter((c) => c.id !== convId);
    setConversations(updated);

    if (activeConvId === convId) {
      if (updated.length > 0) {
        setActiveConvId(updated[0].id);
      } else {
        handleNewChat();
      }
    }
  };

  // Update Persona on active conversation
  const handlePersonaChange = async (newPersona: CompanionPersona) => {
    setCurrentPersona(newPersona);
    if (user && activeConvId) {
      await updateConversation(user.id, activeConvId, { persona: newPersona });
      setConversations((prev) =>
        prev.map((c) => (c.id === activeConvId ? { ...c, persona: newPersona } : c))
      );
    }
  };

  // Update Language on active conversation
  const handleLanguageChange = async (newLanguage: CompanionLanguage) => {
    setCurrentLanguage(newLanguage);
    if (user && activeConvId) {
      await updateConversation(user.id, activeConvId, { language: newLanguage });
      setConversations((prev) =>
        prev.map((c) => (c.id === activeConvId ? { ...c, language: newLanguage } : c))
      );
    }
  };

  // Send Message & Call Gemini AI Backend
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || loading || !user) return;

    setErrorBanner(null);

    let convId = activeConvId;
    if (!convId) {
      const created = await createConversation(user.id, 'New Conversation', currentPersona, currentLanguage);
      setConversations((prev) => [created, ...prev]);
      setActiveConvId(created.id);
      convId = created.id;
    }

    // Auto-generate title from first user message if title is default
    const currentConv = conversations.find((c) => c.id === convId);
    if (currentConv && currentConv.title === 'New Conversation' && messages.length === 0) {
      const generatedTitle = text.length > 30 ? text.substring(0, 30) + '...' : text;
      updateConversation(user.id, convId, { title: generatedTitle });
      setConversations((prev) =>
        prev.map((c) => (c.id === convId ? { ...c, title: generatedTitle } : c))
      );
    }

    // Save user message
    const userMsg = await saveMessage(convId, user.id, 'user', text);
    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      // Build context (last 12 messages including new user message)
      const contextMsgs = [...messages, userMsg].slice(-14).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: contextMsgs,
          persona: currentPersona,
          language: currentLanguage,
          conversationId: convId,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to reach VibeMate backend.');
      }

      // Save assistant reply
      const assistantMsg = await saveMessage(
        convId,
        user.id,
        'assistant',
        data.reply || "I'm right here with you. What would you like to explore next?"
      );

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setErrorBanner({
        message: err.message || 'Unable to get response from AI. Please check connection and try again.',
        retryable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Retry last user message
  const handleRetry = () => {
    if (messages.length === 0) return;
    const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user');
    if (lastUserMsg) {
      handleSendMessage(lastUserMsg.content);
    }
  };

  // Web Speech API - Text to Speech
  const speakMessage = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      if (currentLanguage === 'tamil') {
        utterance.lang = 'ta-IN';
      } else {
        utterance.lang = 'en-US';
      }
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Text-to-speech is not supported by your browser.');
    }
  };

  // Copy to clipboard
  const copyMessage = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Speech-to-text toggle
  const toggleSpeechRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Voice dictation is not supported in this browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = currentLanguage === 'tamil' ? 'ta-IN' : 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputMessage((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn('Speech recognition error:', err);
      setIsListening(false);
    }
  };

  // Export Chat
  const handleExportChat = () => {
    if (messages.length === 0) return;
    const title = activeConversation?.title || 'VibeMate_Chat';
    let content = `# ${title}\nExported on: ${new Date().toLocaleString()}\nPersona: ${currentPersona}\nLanguage: ${currentLanguage}\n\n---\n\n`;

    messages.forEach((m) => {
      content += `**${m.role === 'user' ? (user?.full_name || 'User') : 'VibeMate'}** (${new Date(m.created_at).toLocaleTimeString()}):\n${m.content}\n\n`;
    });

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Suggestion Prompts by Persona
  const personaSuggestions: Record<CompanionPersona, string[]> = {
    friendly: [
      "I had a stressful day today, just need to vent.",
      "Tell me something heartwarming to lift my mood.",
      "What are 3 small habits that make life happier?"
    ],
    study_buddy: [
      "Can you quiz me on core concepts in computer networks?",
      "Explain the Monty Hall problem like I'm 12.",
      "Create a 3-day study schedule for a big exam."
    ],
    creative_muse: [
      "Let's write a sci-fi mystery plot with a sudden plot twist.",
      "Give me 5 unique metaphors for late-night inspiration.",
      "Write a catchy 4-line chorus about neon city lights."
    ],
    productivity_coach: [
      "I have so much to do I don't know where to start.",
      "Teach me how to timebox my workday with Pomodoro.",
      "How do I stop procrastinating on this difficult email?"
    ]
  };

  return (
    <div className="flex h-screen bg-[#07040e] text-purple-100 overflow-hidden font-['Plus_Jakarta_Sans']">
      
      {/* ----------------- SIDEBAR ----------------- */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 sm:w-80 glass-panel border-r border-purple-500/20 bg-[#090514]/95 flex flex-col transition-transform duration-300 md:static md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand & Close Button on Mobile */}
        <div className="p-4 sm:p-5 border-b border-purple-500/20 flex items-center justify-between">
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-fuchsia-500 to-pink-500 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-black text-white font-['Plus_Jakarta_Sans']">
                Vibe<span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Mate</span>
              </span>
              <p className="text-[10px] text-purple-400 font-medium">Your Space. Your Vibe.</p>
            </div>
          </button>

          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-purple-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          <button
            onClick={() => handleNewChat()}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-sm shadow-[0_0_20px_rgba(168,85,247,0.35)] flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>New Chat</span>
          </button>
        </div>

        {/* Conversations History List */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-purple-400/80 flex items-center justify-between">
            <span>Recent Chats</span>
            <span className="text-[10px] font-normal text-purple-400/60">{conversations.length}</span>
          </div>

          {conversations.length === 0 ? (
            <div className="p-4 text-center text-xs text-purple-300/50">
              No conversations yet. Start one above!
            </div>
          ) : (
            conversations.map((conv) => {
              const isActive = conv.id === activeConvId;
              const isEditing = conv.id === editingConvId;

              return (
                <div
                  key={conv.id}
                  onClick={() => handleSelectConv(conv)}
                  className={`group relative flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer text-xs sm:text-sm transition-all ${
                    isActive
                      ? 'bg-purple-900/50 text-white border border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                      : 'text-purple-300/80 hover:bg-purple-950/40 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
                    <MessageSquare className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-fuchsia-400' : 'text-purple-400/60'}`} />
                    
                    {isEditing ? (
                      <form
                        onSubmit={(e) => handleSaveRename(conv.id, e)}
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 flex items-center gap-1"
                      >
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          autoFocus
                          className="w-full bg-purple-950 px-2 py-0.5 rounded text-white text-xs border border-fuchsia-400 focus:outline-none"
                        />
                        <button
                          type="submit"
                          className="p-1 hover:text-emerald-400 text-purple-300"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingConvId(null)}
                          className="p-1 hover:text-rose-400 text-purple-300"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </form>
                    ) : (
                      <span className="truncate font-medium">{conv.title}</span>
                    )}
                  </div>

                  {/* Actions (Rename, Delete) */}
                  {!isEditing && (
                    <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                      <button
                        onClick={(e) => handleStartRename(conv, e)}
                        className="p-1 rounded text-purple-400 hover:text-white hover:bg-purple-800/40"
                        title="Rename conversation"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => handleDeleteConv(conv.id, e)}
                        className="p-1 rounded text-purple-400 hover:text-rose-400 hover:bg-rose-900/30"
                        title="Delete conversation"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* User Card & Settings in Sidebar footer */}
        <div className="p-4 border-t border-purple-500/20 bg-purple-950/30">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center font-bold text-xs text-white shadow-inner flex-shrink-0">
                {user?.full_name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{user?.full_name}</p>
                <p className="text-[10px] text-purple-400 truncate">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={onOpenSettings}
                className="p-1.5 rounded-lg text-purple-300 hover:text-white hover:bg-purple-900/40 transition-colors"
                title="Settings & Setup"
              >
                <SettingsIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => signOut()}
                className="p-1.5 rounded-lg text-purple-300 hover:text-rose-400 hover:bg-rose-900/30 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Supabase status badge */}
          <div className="flex items-center justify-between text-[10px] text-purple-400/80 bg-purple-950/60 px-2.5 py-1 rounded-lg border border-purple-500/20">
            <span>Storage Engine</span>
            <span className="font-semibold text-purple-300">
              {isSupabaseLive ? 'Supabase Postgres' : 'Local Storage Mode'}
            </span>
          </div>
        </div>

      </aside>

      {/* ----------------- MAIN CHAT AREA ----------------- */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* Chat Top Header */}
        <header className="h-16 border-b border-purple-500/20 glass-panel flex items-center justify-between px-4 sm:px-6 z-10 bg-[#090514]/80">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl bg-purple-900/30 border border-purple-500/30 text-purple-200"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="min-w-0">
              <h1 className="text-sm sm:text-base font-bold text-white truncate">
                {activeConversation?.title || 'VibeMate Chat'}
              </h1>
              <p className="text-[11px] text-purple-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Gemini 3.8 Flash Online</span>
              </p>
            </div>
          </div>

          {/* Persona & Language Dropdowns & Export */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Persona Switcher */}
            <select
              value={currentPersona}
              onChange={(e) => handlePersonaChange(e.target.value as CompanionPersona)}
              className="text-xs font-semibold bg-purple-950/70 border border-purple-500/30 text-purple-200 rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-fuchsia-400"
              aria-label="Select companion persona"
            >
              <option value="friendly">💖 Friendly Companion</option>
              <option value="study_buddy">🎓 Study Buddy</option>
              <option value="creative_muse">🎨 Creative Muse</option>
              <option value="productivity_coach">⚡ Productivity Coach</option>
            </select>

            {/* Language Switcher */}
            <select
              value={currentLanguage}
              onChange={(e) => handleLanguageChange(e.target.value as CompanionLanguage)}
              className="text-xs font-semibold bg-purple-950/70 border border-purple-500/30 text-purple-200 rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-fuchsia-400"
              aria-label="Select language"
            >
              <option value="tanglish">⚡ Tanglish</option>
              <option value="tamil">🪷 தமிழ் (Tamil)</option>
              <option value="english">🌐 English</option>
            </select>

            {/* Export Chat */}
            {messages.length > 0 && (
              <button
                onClick={handleExportChat}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-card hover:bg-purple-900/30 border border-purple-500/30 text-xs font-semibold text-purple-200"
                title="Download chat transcript"
              >
                <Download className="w-3.5 h-3.5 text-fuchsia-400" />
                <span>Export</span>
              </button>
            )}
          </div>
        </header>

        {/* Error Notification Banner */}
        {errorBanner && (
          <div className="bg-rose-950/80 border-b border-rose-500/40 px-4 py-2 text-xs text-rose-200 flex items-center justify-between z-20">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{errorBanner.message}</span>
            </div>
            {errorBanner.retryable && (
              <button
                onClick={handleRetry}
                className="px-3 py-1 rounded bg-rose-800 hover:bg-rose-700 text-white font-semibold flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Retry</span>
              </button>
            )}
          </div>
        )}

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {messages.length === 0 ? (
            /* Empty state with welcoming greeting and suggestions */
            <div className="max-w-2xl mx-auto py-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-tr from-purple-600 via-fuchsia-500 to-pink-500 shadow-[0_0_30px_rgba(168,85,247,0.4)] text-white mb-4">
                <Sparkles className="w-8 h-8 animate-pulse" />
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">
                Hey {user?.full_name?.split(' ')[0] || 'Friend'}, what&apos;s your vibe today?
              </h2>
              <p className="text-sm text-purple-300/70 max-w-md mx-auto mb-8">
                Your space is ready. Talk to me about your thoughts, your projects, or your studies in{' '}
                <span className="text-fuchsia-300 font-semibold">{currentLanguage}</span>.
              </p>

              {/* Persona Quick Chips */}
              <div className="text-left">
                <p className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-3 text-center">
                  Try asking anything to get started:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto">
                  {personaSuggestions[currentPersona]?.map((sugg, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(sugg)}
                      className="p-3.5 rounded-2xl glass-card hover:bg-purple-900/40 border border-purple-500/20 hover:border-purple-400/50 text-left text-xs sm:text-sm text-purple-200 hover:text-white transition-all flex items-start gap-2.5"
                    >
                      <Sparkles className="w-4 h-4 text-fuchsia-400 flex-shrink-0 mt-0.5" />
                      <span>{sugg}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Rendered Messages */
            messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex ${isUser ? 'justify-end' : 'justify-start items-start gap-3.5'}`}
                >
                  {!isUser && (
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white text-xs font-bold shadow-[0_0_12px_rgba(168,85,247,0.4)] flex-shrink-0 mt-1">
                      VM
                    </div>
                  )}

                  <div
                    className={`max-w-[88%] sm:max-w-[78%] rounded-2xl p-4 sm:p-5 text-sm sm:text-base leading-relaxed relative group ${
                      isUser
                        ? 'bg-gradient-to-r from-purple-700/80 to-fuchsia-700/80 border border-purple-400/30 text-white rounded-tr-sm shadow-md'
                        : 'bg-[#150E2A]/90 border border-purple-500/25 text-purple-100 rounded-tl-sm shadow-xl'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 mb-1.5">
                      <span className="text-[11px] font-bold text-purple-400/80">
                        {isUser ? 'You' : 'VibeMate'}
                      </span>
                      <span className="text-[10px] text-purple-400/50">
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <p className="whitespace-pre-wrap">{msg.content}</p>

                    {/* Action buttons (Copy, Speak) */}
                    <div className="mt-3 pt-2 border-t border-purple-500/15 flex items-center gap-3 text-xs text-purple-400/70">
                      <button
                        onClick={() => copyMessage(msg.content)}
                        className="hover:text-white flex items-center gap-1 transition-colors"
                        title="Copy text"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </button>

                      {!isUser && (
                        <button
                          onClick={() => speakMessage(msg.content)}
                          className="hover:text-white flex items-center gap-1 transition-colors"
                          title="Read aloud"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Listen</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {/* Typing Indicator */}
          {loading && (
            <div className="flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white text-xs font-bold shadow-[0_0_12px_rgba(168,85,247,0.4)] flex-shrink-0 animate-pulse">
                VM
              </div>
              <div className="rounded-2xl rounded-tl-sm bg-[#150E2A]/90 border border-purple-500/30 p-4 text-purple-300 text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-fuchsia-400 animate-ping" />
                <span className="text-xs font-semibold text-purple-200">
                  VibeMate is thinking in {currentLanguage}...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 sm:p-5 border-t border-purple-500/20 glass-panel bg-[#090514]/90">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="max-w-4xl mx-auto flex items-end gap-2 sm:gap-3"
          >
            {/* Dictation button */}
            <button
              type="button"
              onClick={toggleSpeechRecognition}
              className={`p-3 rounded-2xl border transition-all ${
                isListening
                  ? 'bg-rose-600 text-white border-rose-400 animate-pulse shadow-[0_0_15px_rgba(244,63,94,0.5)]'
                  : 'bg-purple-950/60 text-purple-300 border-purple-500/30 hover:text-white hover:border-purple-400'
              }`}
              title={isListening ? 'Stop listening' : 'Speak into microphone'}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Textarea */}
            <div className="flex-1 relative">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                rows={1}
                placeholder={`Message VibeMate in ${currentLanguage}... (Enter to send, Shift+Enter for newline)`}
                className="w-full resize-none py-3 pl-4 pr-10 rounded-2xl bg-purple-950/50 border border-purple-500/30 focus:border-fuchsia-400 focus:outline-none focus:ring-1 focus:ring-fuchsia-400 text-white text-sm placeholder:text-purple-400/50 max-h-32 min-h-[46px]"
              />
            </div>

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputMessage.trim() || loading}
              className="p-3 rounded-2xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.35)] disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95 flex-shrink-0"
              aria-label="Send message"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>

          <p className="text-[11px] text-center text-purple-400/50 mt-2">
            VibeMate uses Gemini 3.8 Flash. Press Shift + Enter for newline.
          </p>
        </div>

      </main>

    </div>
  );
};
