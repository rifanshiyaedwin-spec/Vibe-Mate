# VibeMate — Your Space. Your Vibe. ✨

> A complete, production-ready AI companion website engineered with emotional intelligence, study coaching, creative brainstorming, and authentic trilingual support in English, Tamil (தமிழ்), and Tanglish. Powered by Google Gemini 3.8 Flash and Supabase PostgreSQL with Row Level Security (RLS).

---

## 🌟 Highlights

- **4 Dynamic Personas**:
  - **💖 Friendly Companion**: Empathetic, supportive, safe space to vent, share wins, and decompress.
  - **🎓 Study Buddy**: Socratic learning, practice quizzes, complex concept analogies, and exam study schedules.
  - **🎨 Creative Muse**: Brainstorming partner for scripts, lyrics, worldbuilding, and overcoming writer's block.
  - **⚡ Productivity Coach**: Pomodoro timeboxing, breaking daunting goals into 15-minute action sprints.
- **Trilingual Fluency**: Native support for **English**, **தமிழ் (Tamil)**, and **Tanglish** (conversational Tamil transliterated into English script).
- **Google Gemini 3.8 Flash**: Fast, real-time responses with bounded context windows, strict input validation, and resilient error recovery.
- **Supabase Authentication & PostgreSQL RLS**: Bank-grade security where users strictly own and control their own profiles, conversations, and messages.
- **Voice & Accessibility**:
  - Built-in **Speech-to-Text dictation** for hands-free typing.
  - Built-in **Text-to-Speech audio read aloud** for companion replies.
  - **Markdown rendering** and **one-click transcript export** (.md format).
- **Vercel Deployment Ready**: Out-of-the-box support for both modern full-stack development and standard Vercel deployments.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 19 + TypeScript |
| **Styling & Design** | Tailwind CSS 4, Midnight-Purple aesthetic, Glassmorphism |
| **AI Intelligence** | Official `@google/genai` TypeScript SDK (`gemini-3.8-flash`) |
| **Authentication & Database** | Supabase Auth + PostgreSQL with Row Level Security (RLS) |
| **Backend API Route** | Express / Next.js App Router (`/api/chat`) |
| **Deployment Target** | Vercel / Cloud Run |

---

## 🚀 Getting Started Locally

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/your-username/vibemate.git
cd vibemate
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory (based on `.env.example`):

```bash
cp .env.example .env
```

Fill in your credentials:

```ini
# Google Gemini API Key (Required for AI responses)
GEMINI_API_KEY="your_actual_gemini_api_key_here"

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"

VITE_SUPABASE_URL="https://your-project-id.supabase.co"
VITE_SUPABASE_ANON_KEY="your-supabase-anon-key"

APP_URL="http://localhost:3000"
```

> **Note**: If Supabase credentials are not provided initially, VibeMate automatically operates in **Local Preview Mode** with persistent browser storage so you can test all features and Gemini responses without interruption!

### 3. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 🗄️ Supabase Database & Auth Setup

Follow these simple steps to set up persistent database storage:

1. **Create Project**: Go to [supabase.com](https://supabase.com) and create a new project.
2. **Execute Database Migration**:
   - Open **SQL Editor** in Supabase Studio.
   - Copy the contents of `/supabase/schema.sql` (or `/supabase/migrations/20261024000000_vibemate_schema.sql`).
   - Paste and click **Run**.
   - This creates `public.profiles`, `public.conversations`, `public.messages`, automated triggers, indexes, and strict Row Level Security (RLS) policies.
3. **Configure Authentication Redirects**:
   - In Supabase, go to **Authentication** &gt; **URL Configuration**.
   - Set **Site URL** to your deployment domain (e.g. `https://vibemate.vercel.app` or `http://localhost:3000`).
   - In **Redirect URLs**, add:
     - `http://localhost:3000/**`
     - `https://your-vercel-domain.vercel.app/**`
4. **Copy API Keys**:
   - Go to **Project Settings** &gt; **API**.
   - Copy **Project URL** and **Project API Key (anon/public)** into your `.env` or Vercel settings.

---

## ☁️ Vercel Deployment Instructions

### Method A: Deploy via GitHub (Recommended)

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "feat: complete VibeMate production release"
   git branch -M main
   git remote add origin https://github.com/<your-username>/vibemate.git
   git push -u origin main
   ```
2. **Import into Vercel**:
   - Go to [vercel.com](https://vercel.com) and click **Add New Project**.
   - Select your GitHub repository.
3. **Configure Environment Variables**:
   In the Vercel project configuration, add:
   - `GEMINI_API_KEY`: Your Gemini API key from Google AI Studio.
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL.
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase Anon Key.
   - `VITE_SUPABASE_URL`: Your Supabase Project URL.
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase Anon Key.
4. **Deploy**:
   - Click **Deploy**. Vercel will build and launch your production application!

---

## 🔒 Security & Privacy Architecture

- **Server-Only API Keys**: `GEMINI_API_KEY` is strictly held on the server side (`/api/chat`) and is never sent or exposed to client-side bundles.
- **Row Level Security (RLS)**: Enforced directly inside PostgreSQL so that user data is isolated at the database level (`auth.uid() = user_id`).
- **Bounded Context**: Incoming chat prompts are trimmed to the most recent conversation turns to prevent token runaway and maintain snappy latency.

---

## 📄 License

Apache-2.0 License. Designed with care for thinkers, learners, and dreamers.
