import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { getSystemInstruction, CompanionPersona, CompanionLanguage } from './src/lib/gemini.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10);

  app.use(express.json({ limit: '5mb' }));

  // Health check endpoint
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
      timestamp: new Date().toISOString(),
    });
  });

  // Server-side Gemini AI Chat Endpoint
  app.post('/api/chat', async (req: Request, res: Response) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(503).json({
          error: 'Gemini API key is not configured on the server. Please set GEMINI_API_KEY in your environment variables.',
          isConfigError: true,
        });
      }

      const { messages, persona = 'friendly', language = 'english' } = req.body;

      if (!Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: 'Valid messages array is required.' });
      }

      // Bound history to prevent token explosion
      const recentMessages = messages.slice(-14);

      // Map roles to Gemini specifications ('user' | 'model')
      const formattedContents = recentMessages.map((msg: { role: string; content: string }) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content || '' }],
      }));

      // Ensure first message is user
      while (formattedContents.length > 0 && formattedContents[0].role === 'model') {
        formattedContents.shift();
      }

      if (formattedContents.length === 0) {
        return res.status(400).json({ error: 'No user message found to respond to.' });
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
          temperature: 0.85,
          topP: 0.95,
        },
      });

      const replyText = response.text || "I'm right here with you! Tell me what's on your mind.";

      return res.json({
        reply: replyText,
        success: true,
      });
    } catch (err: any) {
      console.error('Error handling Gemini chat in server.ts:', err);
      const isRateLimit = err?.status === 429 || err?.message?.includes('429');
      const isTimeout = err?.code === 'ETIMEDOUT' || err?.message?.includes('timeout');

      let userMessage = err?.message || 'Failed to generate response.';
      if (isRateLimit) {
        userMessage = 'High volume on the AI model right now. Please wait a few seconds and try again.';
      } else if (isTimeout) {
        userMessage = 'The request timed out. Please check your connection and retry.';
      }

      return res.status(500).json({
        error: userMessage,
        retryable: true,
      });
    }
  });

  // Attach Vite middleware in development
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`VibeMate server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
