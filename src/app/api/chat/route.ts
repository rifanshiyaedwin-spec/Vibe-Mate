import { GoogleGenAI } from '@google/genai';
import { getSystemInstruction, CompanionPersona, CompanionLanguage } from '@/src/lib/gemini';

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return Response.json(
        { 
          error: 'Gemini API key is not configured. Please set GEMINI_API_KEY in your environment variables.',
          isConfigError: true
        },
        { status: 503 }
      );
    }

    const body = await req.json();
    const { messages, persona = 'friendly', language = 'english' } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return Response.json(
        { error: 'Valid messages array is required.' },
        { status: 400 }
      );
    }

    // Limit context history to avoid unbounded tokens
    const recentMessages = messages.slice(-14);

    // Format for Gemini SDK (user <-> model)
    const formattedContents = recentMessages.map((msg: { role: string; content: string }) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content || '' }],
    }));

    // Ensure the conversation does not start with a model message
    while (formattedContents.length > 0 && formattedContents[0].role === 'model') {
      formattedContents.shift();
    }

    if (formattedContents.length === 0) {
      return Response.json(
        { error: 'No user messages found in context.' },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const systemInstruction = getSystemInstruction(
      persona as CompanionPersona,
      language as CompanionLanguage
    );

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: formattedContents,
      config: {
        systemInstruction,
        temperature: 0.8,
        topP: 0.95,
      },
    });

    const replyText = response.text || "I'm here with you. What would you like to explore next?";

    return Response.json({
      reply: replyText,
      success: true,
    });
  } catch (error: any) {
    console.error('Gemini API Route Error:', error);
    const errorMessage = error?.message || 'Failed to generate response from VibeMate.';
    return Response.json(
      { 
        error: errorMessage,
        suggestion: 'Please verify your network or try again in a moment.' 
      },
      { status: 500 }
    );
  }
}
