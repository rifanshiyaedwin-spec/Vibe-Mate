import React from 'react';
import { X, ShieldCheck } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl rounded-3xl glass-card border border-purple-500/30 bg-[#0e081c] p-6 sm:p-8 shadow-[0_0_50px_rgba(168,85,247,0.25)] max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between pb-4 border-b border-purple-500/20">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-fuchsia-400" />
            <h2 className="text-xl font-bold text-white font-['Plus_Jakarta_Sans']">Privacy Policy</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-purple-300 hover:text-white hover:bg-purple-900/30"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 text-xs sm:text-sm text-purple-200/80 space-y-4 leading-relaxed pr-2">
          <p>
            <strong>Effective Date:</strong> October 2026
          </p>
          <p>
            Welcome to VibeMate. Your privacy and emotional safety are fundamental to our mission. This policy outlines how your data is handled.
          </p>
          <h3 className="text-sm font-bold text-white pt-2">1. Information We Collect</h3>
          <p>
            We collect the information you provide directly: your display name, email address, password hash, conversation titles, and dialogue messages.
          </p>
          <h3 className="text-sm font-bold text-white pt-2">2. How Your Conversations Are Used</h3>
          <p>
            Messages are transmitted securely to Google Gemini APIs strictly to generate your companion responses in real-time. We do not sell, rent, or monetize your private chats.
          </p>
          <h3 className="text-sm font-bold text-white pt-2">3. Database Security & Isolation</h3>
          <p>
            Your chats are protected by PostgreSQL Row Level Security (RLS). Database policies guarantee that only your authenticated account can access, modify, or delete your conversation threads.
          </p>
          <h3 className="text-sm font-bold text-white pt-2">4. Your Data Rights</h3>
          <p>
            You have the right to export your conversations at any time via the Export button in the chat interface, and delete individual chats or your entire account with permanent effect.
          </p>
        </div>

        <div className="pt-4 border-t border-purple-500/20 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
