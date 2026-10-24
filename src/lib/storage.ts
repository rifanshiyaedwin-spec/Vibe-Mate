import { supabase, isSupabaseConfigured } from './supabaseClient';
import { Conversation, Message, UserProfile, CompanionPersona, CompanionLanguage } from '../types/database';

const LOCAL_CONVERSATIONS_KEY = 'vibemate_conversations_';
const LOCAL_MESSAGES_KEY = 'vibemate_messages_';
const LOCAL_PROFILE_KEY = 'vibemate_profile_';

// ---------------------------------------------------------
// Profiles
// ---------------------------------------------------------
export async function getProfile(userId: string): Promise<UserProfile | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (!error && data) {
        return data as UserProfile;
      }
    } catch (err) {
      console.warn('Supabase getProfile error:', err);
    }
  }

  // Fallback to localStorage
  const saved = localStorage.getItem(`${LOCAL_PROFILE_KEY}${userId}`);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  }

  return null;
}

export async function saveProfile(profile: UserProfile): Promise<UserProfile> {
  profile.updated_at = new Date().toISOString();

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .upsert(profile)
        .select()
        .single();

      if (!error && data) {
        localStorage.setItem(`${LOCAL_PROFILE_KEY}${profile.id}`, JSON.stringify(data));
        return data as UserProfile;
      }
    } catch (err) {
      console.warn('Supabase saveProfile error:', err);
    }
  }

  // Fallback
  localStorage.setItem(`${LOCAL_PROFILE_KEY}${profile.id}`, JSON.stringify(profile));
  return profile;
}

// ---------------------------------------------------------
// Conversations
// ---------------------------------------------------------
export async function getConversations(userId: string): Promise<Conversation[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (!error && data) {
        localStorage.setItem(`${LOCAL_CONVERSATIONS_KEY}${userId}`, JSON.stringify(data));
        return data as Conversation[];
      }
    } catch (err) {
      console.warn('Supabase getConversations error:', err);
    }
  }

  // Fallback to localStorage
  const saved = localStorage.getItem(`${LOCAL_CONVERSATIONS_KEY}${userId}`);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  }

  return [];
}

export async function createConversation(
  userId: string,
  title: string = 'New Conversation',
  persona: CompanionPersona = 'friendly',
  language: CompanionLanguage = 'english'
): Promise<Conversation> {
  const newConv: Conversation = {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `conv_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    user_id: userId,
    title,
    persona,
    language,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .insert({
          id: newConv.id,
          user_id: userId,
          title: newConv.title,
          persona: newConv.persona,
          language: newConv.language,
        })
        .select()
        .single();

      if (!error && data) {
        return data as Conversation;
      }
    } catch (err) {
      console.warn('Supabase createConversation error:', err);
    }
  }

  // Fallback
  const existing = await getConversations(userId);
  const updated = [newConv, ...existing];
  localStorage.setItem(`${LOCAL_CONVERSATIONS_KEY}${userId}`, JSON.stringify(updated));
  return newConv;
}

export async function updateConversation(
  userId: string,
  conversationId: string,
  updates: Partial<Pick<Conversation, 'title' | 'persona' | 'language'>>
): Promise<void> {
  const now = new Date().toISOString();

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase
        .from('conversations')
        .update({ ...updates, updated_at: now })
        .eq('id', conversationId)
        .eq('user_id', userId);
    } catch (err) {
      console.warn('Supabase updateConversation error:', err);
    }
  }

  // Local sync
  const existing = await getConversations(userId);
  const updated = existing.map((c) =>
    c.id === conversationId ? { ...c, ...updates, updated_at: now } : c
  );
  localStorage.setItem(`${LOCAL_CONVERSATIONS_KEY}${userId}`, JSON.stringify(updated));
}

export async function deleteConversation(userId: string, conversationId: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase
        .from('conversations')
        .delete()
        .eq('id', conversationId)
        .eq('user_id', userId);
    } catch (err) {
      console.warn('Supabase deleteConversation error:', err);
    }
  }

  // Local sync
  const existing = await getConversations(userId);
  const updated = existing.filter((c) => c.id !== conversationId);
  localStorage.setItem(`${LOCAL_CONVERSATIONS_KEY}${userId}`, JSON.stringify(updated));
  localStorage.removeItem(`${LOCAL_MESSAGES_KEY}${conversationId}`);
}

// ---------------------------------------------------------
// Messages
// ---------------------------------------------------------
export async function getMessages(conversationId: string, userId: string): Promise<Message[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (!error && data) {
        localStorage.setItem(`${LOCAL_MESSAGES_KEY}${conversationId}`, JSON.stringify(data));
        return data as Message[];
      }
    } catch (err) {
      console.warn('Supabase getMessages error:', err);
    }
  }

  // Fallback to localStorage
  const saved = localStorage.getItem(`${LOCAL_MESSAGES_KEY}${conversationId}`);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  }

  return [];
}

export async function saveMessage(
  conversationId: string,
  userId: string,
  role: 'user' | 'assistant' | 'system',
  content: string
): Promise<Message> {
  const newMsg: Message = {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    conversation_id: conversationId,
    user_id: userId,
    role,
    content,
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          id: newMsg.id,
          conversation_id: conversationId,
          user_id: userId,
          role,
          content,
        })
        .select()
        .single();

      if (!error && data) {
        // Also touch conversation updated_at
        await supabase
          .from('conversations')
          .update({ updated_at: new Date().toISOString() })
          .eq('id', conversationId)
          .eq('user_id', userId);

        return data as Message;
      }
    } catch (err) {
      console.warn('Supabase saveMessage error:', err);
    }
  }

  // Fallback
  const existing = await getMessages(conversationId, userId);
  const updated = [...existing, newMsg];
  localStorage.setItem(`${LOCAL_MESSAGES_KEY}${conversationId}`, JSON.stringify(updated));

  // Update conversation timestamp locally
  const convs = await getConversations(userId);
  const updatedConvs = convs.map((c) =>
    c.id === conversationId ? { ...c, updated_at: new Date().toISOString() } : c
  );
  localStorage.setItem(`${LOCAL_CONVERSATIONS_KEY}${userId}`, JSON.stringify(updatedConvs));

  return newMsg;
}
