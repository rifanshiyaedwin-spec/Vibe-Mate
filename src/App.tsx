import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { TrilingualShowcase } from './components/TrilingualShowcase';
import { AboutSection } from './components/AboutSection';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { Dashboard } from './components/Dashboard';
import { SettingsModal } from './components/SettingsModal';
import { PrivacyModal } from './components/PrivacyModal';
import { TermsModal } from './components/TermsModal';
import { CompanionPersona, CompanionLanguage } from './types/database';

function MainApp() {
  const { user, loading } = useAuth();
  
  // View states
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>('landing');
  
  // Modal states
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot_password'>('login');
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [termsModalOpen, setTermsModalOpen] = useState(false);

  // Selected companion configurations
  const [selectedPersona, setSelectedPersona] = useState<CompanionPersona>('friendly');
  const [selectedLanguage, setSelectedLanguage] = useState<CompanionLanguage>('english');

  const handleOpenAuth = (mode: 'login' | 'signup' = 'login') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleStartChatting = (
    persona: CompanionPersona = 'friendly',
    language: CompanionLanguage = 'english'
  ) => {
    setSelectedPersona(persona);
    setSelectedLanguage(language);

    if (user) {
      setCurrentView('dashboard');
    } else {
      setAuthMode('signup');
      setAuthModalOpen(true);
    }
  };

  const handleAuthSuccess = () => {
    setCurrentView('dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080511] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-fuchsia-500 to-pink-500 animate-pulse flex items-center justify-center text-white font-bold shadow-[0_0_30px_rgba(168,85,247,0.5)]">
            VM
          </div>
          <p className="text-sm font-semibold text-purple-300 animate-pulse">
            Connecting your vibe...
          </p>
        </div>
      </div>
    );
  }

  // Dashboard View
  if (currentView === 'dashboard' && user) {
    return (
      <>
        <Dashboard
          onOpenSettings={() => setSettingsModalOpen(true)}
          onNavigateHome={() => setCurrentView('landing')}
          defaultPersona={selectedPersona}
          defaultLanguage={selectedLanguage}
        />
        <SettingsModal
          isOpen={settingsModalOpen}
          onClose={() => setSettingsModalOpen(false)}
        />
      </>
    );
  }

  // Landing Page View
  return (
    <div className="min-h-screen bg-[#080511] text-purple-100 selection:bg-fuchsia-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        onOpenAuth={handleOpenAuth}
        onNavigateDashboard={() => setCurrentView('dashboard')}
        onOpenSettings={() => setSettingsModalOpen(true)}
        currentView={currentView}
        onNavigateHome={() => setCurrentView('landing')}
      />

      {/* Hero Section */}
      <Hero
        onStartChatting={() => handleStartChatting('friendly', 'tanglish')}
        onExplorePersonas={() => {
          const el = document.getElementById('personas');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Personas & Features Section */}
      <Features
        onSelectPersona={(persona) => handleStartChatting(persona, selectedLanguage)}
      />

      {/* Trilingual Interactive Showcase */}
      <TrilingualShowcase
        onStartWithLanguage={(language) => handleStartChatting(selectedPersona, language)}
      />

      {/* About VibeMate Section */}
      <AboutSection />

      {/* Footer */}
      <Footer
        onOpenPrivacy={() => setPrivacyModalOpen(true)}
        onOpenTerms={() => setTermsModalOpen(true)}
        onOpenSettings={() => setSettingsModalOpen(true)}
      />

      {/* Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
        onSuccess={handleAuthSuccess}
      />

      <SettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
      />

      <PrivacyModal
        isOpen={privacyModalOpen}
        onClose={() => setPrivacyModalOpen(false)}
      />

      <TermsModal
        isOpen={termsModalOpen}
        onClose={() => setTermsModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
