# Fynd AI Intern Assessment - Task 2 Report
## Two-Dashboard AI Feedback System

**Candidate Name:** Kartikeya Pandey 

**Date:** 7th January 2026  
**Task:** Task 2 - Production Web Application with Dual Dashboards

---

## Executive Summary

This report documents the development of a production-grade AI-powered customer feedback management system featuring dual dashboards (User and Admin) with complete deployment on Vercel and Supabase. The system demonstrates end-to-end full-stack capabilities, server-side AI integration, and production-ready architecture patterns.

**Key Achievements:**
- ✅ Fully deployed and publicly accessible application
- ✅ Real-time data persistence across dashboard refreshes
- ✅ Server-side LLM integration with graceful error handling
- ✅ Production-grade error handling for all edge cases
- ✅ Type-safe API contracts with validation
- ✅ Responsive UI with excellent UX

---

## 1. Task Selection Rationale

### Why I Chose Task 2

I selected Task 2 (Two-Dashboard AI Feedback System) over Task 1 (Rating Prediction) for several strategic reasons:

**1. Real-World Relevance**
- Task 2 more closely mirrors actual work at Fynd (e-commerce platform company)
- Demonstrates ability to ship complete products, not just experiments
- Shows understanding of production systems and business requirements

**2. Differentiation Strategy**
- Task 1 is more approachable, so most candidates likely choose it
- Task 2 demonstrates higher technical capability and ambition
- Creates memorable interview talking points

**3. Skill Demonstration**
- Full-stack development (frontend + backend + database)
- System architecture and design thinking
- AI integration in production contexts
- DevOps and deployment workflows
- Error handling and edge case management

**4. Interview Leverage**
- Task 1 provides ~5 discussion points (prompt engineering, evaluation)
- Task 2 provides more discussion points (architecture, trade-offs, deployment, scaling, UX design, AI prompting, error handling)

---

## 2. Overall Approach

### Development Philosophy

I approached this as a **real product launch**, not just an assessment project. This meant:

1. **User-First Design**: Prioritized excellent UX for both dashboards
2. **Production Mindset**: Comprehensive error handling, not happy-path only
3. **System Reliability**: Graceful degradation when services fail
4. **Code Quality**: Type-safe, well-documented, maintainable code
5. **Deployment Focus**: Ensuring smooth deployment from day one





## 3. Design and Architecture Decisions

### 3.1 Tech Stack Selection

| Component | Choice | Rationale |
|-----------|--------|-----------|
| Framework | Next.js 14 (App Router) | Server components, API routes, optimal Vercel deployment, SEO benefits |
| Frontend | React + TypeScript | Type safety, component reusability, industry standard |
| Styling | Tailwind CSS | Rapid development, consistent design, no CSS conflicts |
| Backend | Next.js API Routes | Eliminates separate backend, serverless benefits, edge runtime |
| Database | Supabase (PostgreSQL) | Free tier, real-time capabilities, managed service, reliable |
| LLM | OpenAI GPT-3.5-turbo | Fast (<2s), cost-effective, JSON mode, reliable |
| Validation | Zod | Type-safe validation, excellent TypeScript integration |
| Deployment | Vercel | Zero-config Next.js deployment, automatic HTTPS, CDN |

### 3.2 System Architecture

```
                    ┌─────────────────┐
                    │   Vercel CDN    │
                    │  (Next.js App)  │
                    └────────┬────────┘
                             │
            ┌────────────────┼────────────────┐
            │                │                │
     ┌──────▼──────┐  ┌─────▼─────┐  ┌──────▼──────┐
     │    User     │  │   Admin   │  │  API Routes │
     │  Dashboard  │  │ Dashboard │  │   (Edge)    │
     └─────────────┘  └───────────┘  └──────┬──────┘
                                             │
                              ┌──────────────┼──────────────┐
                              │              │              │
                       ┌──────▼──────┐ ┌────▼─────┐ ┌─────▼──────┐
                       │   Supabase  │ │  GROQ.   │ │   Vercel   │
                       │  PostgreSQL │ │   API    │ │   Cache    │
                       └─────────────┘ └──────────┘ └────────────┘
```

**Key Design Principles:**

1. **Single Responsibility**: Each component has one clear purpose
2. **Server-Side Processing**: All LLM calls happen server-side for security
3. **Stateless API**: RESTful endpoints with clear contracts
4. **Data Persistence**: Single source of truth (Supabase)
5. **Error Isolation**: Failures don't cascade

### 3.3 Database Schema

```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY,
  rating INTEGER (1-5),
  review_text TEXT,
  user_response TEXT,
  admin_summary TEXT,
  recommended_actions TEXT[],
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

**Design Decisions:**
- **UUID Primary Key**: Better for distributed systems, no collision risk
- **Array for Actions**: Flexible, easy to query, natural representation
- **Timestamps**: Automatic tracking, sorted queries
- **Indexes**: On `created_at` and `rating` for fast admin queries

### 3.4 API Design

**POST /api/reviews/submit**
- Purpose: Submit new review
- Validation: Zod schema
- Error codes: 400 (validation), 500 (server error)
- Response: Success with user_response, or error with message

**GET /api/reviews**
- Purpose: Fetch all reviews (admin)
- Sorting: Newest first
- Edge runtime: Faster cold starts
- Response: Array of reviews or error

**Design Principles:**
- Explicit JSON schemas
- Consistent error format
- Type-safe responses
- Graceful error messages

---

## 4. LLM Integration and Prompt Engineering

### 4.1 Prompt Design Philosophy

I designed two distinct prompts for different audiences:

**User-Facing Response (Empathetic & Brief)**
```
Goal: Make customer feel heard and valued
Tone: Warm, professional, matching their sentiment
Length: 2-3 sentences
Temperature: 0.7 (more natural variation)
```

**Admin Insights (Analytical & Actionable)**
```
Goal: Provide actionable business intelligence
Tone: Professional, objective, data-driven
Format: Structured JSON (summary + 3 actions)
Temperature: 0.5 (more consistent)
```

### 4.2 Prompt Iterations

**Iteration 1: Basic Approach**
```
Prompt: "Generate a response to this review: {review_text}"
Problems:
- Generic, one-size-fits-all responses
- No sentiment awareness
- Often too long
```

**Iteration 2: Sentiment-Aware**
```
Prompt: "A customer left a {rating}-star review: '{review_text}'. 
Respond appropriately to their sentiment."
Improvements:
- Better tone matching
- More empathetic
Problems:
- Still sometimes too long
- Inconsistent structure
```

**Iteration 3: Structured & Constrained (Final)**
```
Prompt: "You are a customer service AI. A customer left a {rating}-star 
review: '{review_text}'.

Generate a professional, empathetic response that:
1. Acknowledges their feedback
2. Addresses their sentiment appropriately  
3. Is brief (2-3 sentences)
4. Matches tone to rating (grateful for 4-5 stars, apologetic for 1-3)

Response:"

Improvements:
✅ Clear constraints (2-3 sentences)
✅ Explicit tone guidance
✅ Structured expectations
✅ Role definition
```

### 4.3 Admin Insights Prompt

```
Prompt: "Analyze this customer review for internal operations:
Rating: {rating}/5
Review: '{review_text}'

Provide:
1. A brief summary (1 sentence) highlighting the key issue or praise
2. Exactly 3 recommended actions for the team

Format as JSON:
{
  'summary': 'one sentence summary',
  'actions': ['action 1', 'action 2', 'action 3']
}"

Features:
- JSON mode for reliability
- Explicit structure requirement
- Actionable focus
- Business context
```

### 4.4 Error Handling Strategy

```typescript
try {
  // LLM call
} catch (error) {
  // Graceful fallback
  return {
    userResponse: rating >= 4 
      ? "Thank you for your positive feedback!"
      : "Thank you for your feedback. We're committed to improving.",
    adminSummary: `${rating}-star review requiring attention`,
    recommendedActions: [
      'Review customer feedback in detail',
      'Assign to appropriate team',
      rating <= 2 ? 'Priority follow-up required' : 'Monitor for trends'
    ]
  }
}
```

**Key Principles:**
- Never expose LLM errors to users
- Always provide sensible defaults
- Log errors for debugging
- Maintain user experience

---

## 5. System Behavior and Trade-offs



### 5.1 Edge Cases Handled

1. **Empty Reviews**: Default text prevents null values
2. **No Rating**: Validation prevents submission
3. **Very Long Text**: 5000 char limit with counter
4. **Special Characters**: Properly escaped in JSON
5. **Multiple Rapid Submissions**: Rate limited by Vercel
6. **LLM Timeout**: 30s timeout with fallback
7. **Database Connection Issues**: Retry logic with exponential backoff
8. **Malformed JSON from LLM**: Try-catch with default values
9. **Concurrent Admin Access**: Postgres handles concurrency
10. **Browser Refresh**: Data persists, session maintained

---

## 6. System Limitations

### 6.1 Current Limitations

**Technical:**
- No user authentication (admin dashboard is public)
- No rate limiting per user (only Vercel-level)
- No pagination (all reviews load at once)
- No real-time updates (polling-based)
- No review editing or deletion
- Single language support (English)

**Business:**
- No sentiment analysis beyond rating
- No automated escalation for critical reviews
- No email notifications
- No export functionality
- No analytics dashboard (basic stats only)

**Scalability:**
- Admin dashboard may slow with 10,000+ reviews
- No caching layer (relies on Vercel edge caching)
- Single region deployment (no global distribution)




## 7. Deployment Links

**GitHub Repository**: [https://github.com/eth-developer03/feedback_simple_dashboard]  
**User Dashboard**: [https://feedback-simple-dashboard.vercel.app/user]  
**Admin Dashboard**: [https://feedback-simple-dashboard.vercel.app/admin]  

---


**Report End**

*This report was generated as part of the Fynd AI Intern Assessment (Task 2)*  
*Date: 7th January 2026*