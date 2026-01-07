# Fynd AI Feedback System

A production-grade, AI-powered customer feedback management system with dual dashboards for user submissions and admin analytics.

## 🎯 Project Overview

This system demonstrates a complete production workflow for handling customer feedback with AI integration:
- **User Dashboard**: Public-facing interface for customers to submit ratings and reviews
- **Admin Dashboard**: Internal interface with real-time analytics and AI-generated insights
- **AI Integration**: Server-side LLM calls for personalized responses and actionable recommendations
- **Production-Ready**: Full error handling, data persistence, and deployment configuration

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 14 (App Router) + React + TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes (Edge Runtime)
- **Database**: Supabase (PostgreSQL)
- **LLM**: GROQ API 
- **Deployment**: Vercel
- **Validation**: Zod schemas

### System Design
```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   User      │────────>│  Next.js API │────────>│  Supabase   │
│ Dashboard   │         │   Routes     │         │  Database   │
└─────────────┘         └──────────────┘         └─────────────┘
                               │
                               │ Server-side only
                               ▼
                        ┌──────────────┐
                        │  GROQ   API  │
                        └──────────────┘
                               │
                               ▼
┌─────────────┐         ┌──────────────┐
│   Admin     │────────>│  Next.js API │
│ Dashboard   │         │   Routes     │
└─────────────┘         └──────────────┘
```

## 🚀 Quick Start



### Step 1: Clone and Install
```bash
git clone <your-repo-url>
cd fynd-feedback-system
npm install
```

### Step 2: Set Up Supabase
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to initialize (~2 minutes)
3. Go to Project Settings → API
4. Copy your `Project URL` and `anon/public` key
5. Go to SQL Editor and run the schema:

```sql
-- Copy and paste contents from database/schema.sql
```

### Step 3: Configure Environment Variables
```bash
cp .env.example .env
```

Edit `.env` with your values:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
GROQ_API_KEY=sk-your-groq-key
NODE_ENV=development
```

### Step 4: Run Development Server
```bash
npm run dev
```

Visit:
- Landing page: http://localhost:3000
- User dashboard: http://localhost:3000/user
- Admin dashboard: http://localhost:3000/admin



## 🎨 Features

### User Dashboard
✅ Interactive 5-star rating system  
✅ Optional text review (up to 5000 characters)  
✅ Real-time validation  
✅ Instant AI-generated response  
✅ Loading states and error handling  
✅ Success feedback with auto-reset  

### Admin Dashboard
✅ Real-time review feed (auto-refreshes every 10s)  
✅ Analytics overview (total, average rating, distribution)  
✅ Filter by rating  
✅ AI-generated summaries for each review  
✅ Recommended actions for team  
✅ Timestamp with relative time display  
✅ Manual refresh button  

## 🧠 AI Integration

### Prompt Design Philosophy
The system uses carefully crafted prompts for two distinct purposes:

**1. User-Facing Response (Empathetic & Professional)**
- Acknowledges customer feedback
- Matches tone to rating (grateful for high ratings, apologetic for low)
- Brief and conversational (2-3 sentences)
- Temperature: 0.7 (more natural variation)

**2. Admin Insights (Analytical & Actionable)**
- One-sentence summary highlighting key issues/praise
- Three specific, actionable recommendations
- Structured JSON output for reliability
- Temperature: 0.5 (more consistent)

### Error Handling
- Graceful fallback responses if LLM fails
- Never exposes API errors to users
- Default recommendations if JSON parsing fails
- Validates all LLM outputs before storage

## 🔒 Security & Best Practices

### Implemented
✅ All LLM calls are server-side only  
✅ Input validation with Zod schemas  
✅ Environment variables for sensitive data  
✅ SQL injection protection (Supabase client)  
✅ Rate limiting via Vercel (automatic)  
✅ CORS handling (Next.js default)  
✅ Type-safe API contracts  

### Database Security
- Row Level Security enabled on Supabase
- Indexes for query performance
- Automatic timestamp management
- UUID primary keys

## 📊 Data Model

```typescript
type Review = {
  id: string              // UUID
  rating: number          // 1-5
  review_text: string     // User's review
  user_response: string   // AI response shown to user
  admin_summary: string   // AI-generated summary
  recommended_actions: string[]  // AI suggestions
  created_at: string      // ISO timestamp
  updated_at: string      // ISO timestamp
}
```

## 🔧 API Endpoints

### POST /api/reviews/submit
Submit a new review




### GET /api/reviews
Fetch all reviews (for admin dashboard)




## 🎯 Design Decisions

### Why Next.js 14?
- Server-side rendering for better SEO
- API routes eliminate need for separate backend
- Edge runtime for faster cold starts
- Built-in deployment optimization for Vercel

### Why Supabase?
- Real-time capabilities (future feature: live updates)
- Generous free tier
- PostgreSQL (reliable, scalable)
- Built-in authentication (if needed later)

### Why Server-Side LLM Calls?
- Security: API keys never exposed to client
- Cost control: Rate limiting at server level
- Consistency: Same responses regardless of client
- Error handling: Better control over failures





## 🐛 Error Scenarios Handled

1. **Empty reviews**: Defaults to "No additional comments provided"
2. **Long reviews**: Validated at 5000 characters max
3. **Invalid ratings**: Validated 1-5 range with Zod
4. **LLM failures**: Graceful fallback responses
5. **Database errors**: User-friendly error messages
6. **Network timeouts**: Loading states and retry options

