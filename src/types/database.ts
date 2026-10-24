export type CompanionPersona = 'friendly' | 'study_buddy' | 'creative_muse' | 'productivity_coach';
export type CompanionLanguage = 'english' | 'tamil' | 'tanglish';

export interface UserProfile {
  id: string;
  email: string;
  display_name: string;
  avatar_url?: string;
  preferred_language: CompanionLanguage;
  companion_persona: CompanionPersona;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  title: string;
  persona: CompanionPersona;
  language: CompanionLanguage;
  created_at: string;
  updated_at: string;
  last_message_preview?: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  user_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
}
