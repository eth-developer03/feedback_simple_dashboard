# Fynd AI Intern - Take Home Assessment 2.0

**Candidate:** Kartikeya Pandey  
**Submission Date:** 7th January 2026

A comprehensive assessment demonstrating prompt engineering expertise and production-grade full-stack development with AI integration.

---

## 📋 Project Overview

This repository contains two complete deliverables:

### **Task 1**: Yelp Review Rating Prediction (Prompt Engineering)
Advanced prompt engineering with systematic evaluation of multiple approaches for classifying Yelp reviews into 1-5 star ratings.

### **Task 2**: AI-Powered Feedback Management System
Production-grade web application with dual dashboards (User + Admin) featuring real-time analytics and AI-generated insights.

---

## 🎯 Task 1: Rating Prediction via Prompting

### Objective
Design and evaluate prompting strategies to classify Yelp reviews into star ratings (1-5) with structured JSON output.

### Notebook: `https://www.kaggle.com/code/kartikeyapandey04/task1-yelp-rating-prediction`

### Prompting Approaches Implemented

| # | Approach | Strategy | Key Innovation |
|---|----------|----------|----------------|
| 1 | **Baseline** | Simple, direct instruction | Establishes performance baseline |
| 2 | **Context-Enhanced** | Added explicit rating criteria | Defines what each star level means |
| 3 | **Few-Shot Learning** | Concrete examples (1 per rating) | Pattern learning from examples |
| 4 | **Chain-of-Thought** | Step-by-step reasoning | Explicit analysis before decision |

### Evaluation Metrics

- **Exact Accuracy**: Predicted rating matches actual rating
- **Off-by-One Accuracy**: Prediction within ±1 star (more lenient)
- **JSON Validity Rate**: Percentage of properly formatted responses
- **Confusion Matrix**: Per-rating error analysis

### Dataset
- **Source**: Yelp Reviews (Kaggle)
- **Sample Size**: 200 reviews (stratified across all ratings)
- **Approach**: Balanced sampling (40 reviews per star rating)

### Key Findings

**Best Performing Approach:** Few-Shot Learning consistently achieved highest accuracy by teaching through concrete examples rather than abstract rules.

**Common Error Pattern:** Adjacent ratings (3★ vs 4★) most frequently confused due to subtle sentiment differences.

**JSON Reliability:** All approaches achieved >95% validity through careful prompt structure and output format specification.

### Tech Stack
- **LLM**: Open AI 
- **Libraries**: pandas, scikit-learn, matplotlib, seaborn
- **Evaluation**: Stratified sampling, confusion matrices, comparative analysis


### Generated Artifacts
- `approach_comparison.csv` - Performance metrics table
- `approach_comparison.png` - Visual comparison charts
- `confusion_matrices.png` - Detailed error patterns
- `approach_X_predictions.csv` - Full predictions for each approach

---

## 🚀 Task 2: AI Feedback Management System

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


## LINKS 

**DEPLOYED USER LINK** : https://feedback-simple-dashboard.vercel.app/user
**DEPLOYED ADMIN LINK** : https://feedback-simple-dashboard.vercel.app/admin
**REPORT LINK** : https://drive.google.com/file/d/11vZ6z9YQSd1Q2mWT7To8NGgVfZQYfeN4/view?usp=sharing