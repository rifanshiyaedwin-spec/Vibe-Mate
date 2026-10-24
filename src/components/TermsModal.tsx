import React from 'react';
import { X, FileText } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl rounded-3xl glass-card border border-purple-500/30 bg-[#0e081c] p-6 sm:p-8 shadow-[0_0_50px_rgba(168,85,247,0.25)] max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between pb-4 border-b border-purple-500/20">
          <div className="flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-fuchsia-400" />
            <h2 className="text-xl font-bold text-white font-['Plus_Jakarta_Sans']">Terms of Service</h2>
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
            By accessing or using VibeMate, you agree to comply with and be bound by these Terms of Service.
          </p>
          <h3 className="text-sm font-bold text-white pt-2">1. Nature of Service</h3>
          <p>
            VibeMate is an artificial intelligence companion designed for informational, educational, and creative conversation. VibeMate does not provide professional medical, psychiatric, legal, or financial advice.
          </p>
          <h3 className="text-sm font-bold text-white pt-2">2. Acceptable Use</h3>
          <p>
            You agree not to use the service to generate hate speech, encourage self-harm, harass individuals, or violate applicable laws and Google Generative AI prohibited use policies.
          </p>
          <h3 className="text-sm font-bold text-white pt-2">3. Account Ownership</h3>
          <p>
            You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account.
          </p>
          <h3 className="text-sm font-bold text-white pt-2">4. Disclaimers</h3>
          <p>
            The service is provided on an &ldquo;as-is&rdquo; and &ldquo;as-available&rdquo; basis without warranties of any kind.
          </p>
        </div>

        <div className="pt-4 border-t border-purple-500/20 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
