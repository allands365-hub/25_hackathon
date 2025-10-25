# BuildAI Arena Product Requirements Document (PRD)

**Version:** 1.0
**Date:** 2025-10-25
**Author:** John (PM Agent)
**Status:** Draft for 24-Hour Hackathon MVP

---

## Goals and Background Context

### Goals

- Launch a functional MVP within 24 hours demonstrating the core competitive AI talent marketplace workflow
- Prove technical feasibility of Groq-powered LLM evaluation for AI product submissions
- Create a professional, polished UI that credibly demonstrates two-sided marketplace value proposition
- Validate product-market fit hypothesis through compelling demo and early user feedback
- Establish foundation for rapid post-hackathon iteration and company pilot recruitment

### Background Context

BuildAI Arena addresses a critical gap in the AI hiring market: companies cannot reliably assess whether candidates can ship production-ready AI products, while self-taught AI builders lack platforms to credibly demonstrate holistic product capabilities. Unlike traditional coding challenge platforms (LeetCode, Hack

erRank) that measure algorithmic skills, or portfolio sites (GitHub) that lack validation context, BuildAI Arena combines competitive challenges, automated LLM-driven evaluation, and direct hiring pipelines to create a marketplace where demonstrated capability replaces credentials.

The 24-hour hackathon MVP focuses on proving the core technical innovation—Groq AI's ability to meaningfully evaluate AI product submissions in <30 seconds—while delivering a complete user journey from challenge discovery through submission to leaderboard ranking. Post-MVP, the platform will add company sponsor dashboards, prize systems, and advanced gamification.

### Change Log

| Date       | Version | Description                          | Author |
|------------|---------|--------------------------------------|--------|
| 2025-10-25 | 1.0     | Initial PRD for 24-hour hackathon MVP | John (PM) |

---

## Requirements

### Functional Requirements

**FR1:** Users must be able to authenticate via GitHub OAuth with automatic profile creation from GitHub metadata (username, email, avatar, bio)

**FR2:** The platform must display a browsable catalog of 3-5 AI product challenges with title, difficulty, problem statement, evaluation rubric, deadline, and sponsor information

**FR3:** Authenticated users must be able to submit projects to challenges via a multi-step form requiring GitHub repository URL, pitch deck URL (Google Slides/PDF), demo video URL (YouTube/Loom), and written summary (500 char max)

**FR4:** The system must automatically evaluate submissions using Groq API (llama-3.1-70b-versatile) against challenge-specific rubrics, generating a 0-100 score with per-criterion breakdown and 200-300 word written feedback within 30 seconds

**FR5:** Each challenge must maintain a real-time leaderboard showing ranked submissions by score, with builder name, avatar, score, and submission preview

**FR6:** Users must be able to view detailed submission pages showing full project information, LLM evaluation breakdown, and feedback

**FR7:** The platform must validate all submission URLs (GitHub repo existence, slide/video accessibility) before accepting submissions

**FR8:** Builders must be able to view their profile showing all submissions, scores, and placeholder badges

**FR9:** The homepage must clearly communicate the value proposition for both builders and companies with prominent CTAs

**FR10:** All submissions and leaderboards must update in real-time (< 1 second latency) for authenticated users viewing challenge pages

### Non-Functional Requirements

**NFR1:** Page load time must be < 2 seconds from initial request to interactive state

**NFR2:** LLM evaluation latency must be < 30 seconds from submission to score display (leveraging Groq's speed advantage)

**NFR3:** The application must support 50+ concurrent users without degradation (Vercel auto-scaling)

**NFR4:** All user data must be protected via Supabase Row Level Security (RLS) policies ensuring users can only modify their own submissions

**NFR5:** The UI must be WCAG 2.1 Level AA accessible with keyboard navigation and screen reader compatibility

**NFR6:** All API keys (Groq) must be stored in environment variables and never exposed client-side

**NFR7:** The application must implement rate limiting (100 req/10s per IP via Vercel defaults) to prevent abuse

**NFR8:** Database queries must be optimized for leaderboard performance (indexed score columns, cached rankings)

**NFR9:** The UI must be fully responsive (mobile + desktop) using Tailwind CSS breakpoints

**NFR10:** All forms must implement client-side validation (Zod schemas) before submission

---

## User Interface Design Goals

### Overall UX Vision

BuildAI Arena should feel like a premium, modern SaaS product—professional, fast, and delightful. The UI balances competitive gaming aesthetics (leaderboards, scores, badges) with enterprise credibility (clean typography, consistent spacing, accessible design). Every interaction should reinforce the value proposition: "This is where serious AI builders prove their skills."

Key UX principles:
- **Speed matters:** Instant feedback, optimistic UI updates, skeleton loaders for async operations
- **Clarity over cleverness:** Plain language, obvious CTAs, no hidden features
- **Motivational design:** Progress indicators, achievement unlocks, social proof (leaderboard visibility)
- **Trust signals:** LLM evaluation transparency, detailed score breakdowns, methodology disclosure

### Key Interaction Paradigms

- **Challenge-centric navigation:** Challenges are the primary entry point; all other features (submissions, leaderboards, profiles) branch from challenge context
- **Progressive disclosure:** Show summary cards → expand to detail views → modal deep-dives for full content
- **Real-time collaboration feel:** Live leaderboard updates, submission status indicators ("Evaluating...", "Scored!")
- **GitHub-native flows:** OAuth redirect feels seamless; profile data auto-populates; repo links validate in real-time

### Core Screens and Views

1. **Homepage (Marketing):**
   - Hero section: Value prop + dual CTAs ("Submit a Project" for builders, "Post a Challenge" for companies)
   - Featured challenges grid (3 cards)
   - Social proof (fake stats for MVP: "1,247 builders", "89 challenges", "342 projects evaluated")
   - How it works (3-step visual flow)

2. **Challenge Browse:**
   - Grid/list toggle view
   - Filters: Difficulty (Easy/Medium/Hard), Category (placeholder), Status (Active/Upcoming/Closed)
   - Each card: Title, sponsor logo, difficulty badge, deadline countdown, participant count

3. **Challenge Detail:**
   - Problem statement (markdown rendering)
   - Evaluation rubric (table: Criterion, Weight %, Description)
   - Leaderboard (top 10 submissions)
   - "Submit Project" CTA (sticky button)

4. **Submission Flow (Multi-step Form):**
   - Step 1: Select challenge (if not pre-selected)
   - Step 2: Project links (GitHub URL with validation, Deck URL, Video URL)
   - Step 3: Written summary (textarea, 500 char limit with counter)
   - Step 4: Review & Submit
   - Step 5: Evaluation loading state → Results page

5. **Leaderboard (Challenge-Specific):**
   - Ranked list: Position, Avatar, Name, Score, "View Project" link
   - Filterable by date range (placeholder for MVP)
   - Real-time updates (Supabase subscriptions)

6. **Submission Detail Page:**
   - Project info: Title, links (GitHub, deck, video embeds), summary
   - Score card: Overall score (large), per-criterion breakdown (bar charts), LLM feedback (quoted text)
   - Builder profile link

7. **User Profile:**
   - Header: Avatar, name, GitHub link, join date
   - Submissions list (cards with challenge name, score, rank)
   - Badges (placeholder: "Top 10%", "First Submission", "Challenge Winner")

8. **Sign-In/Auth Flow:**
   - Landing page with "Sign in with GitHub" button
   - OAuth redirect to GitHub → callback → profile creation → redirect to challenges

### Accessibility

**Target: WCAG 2.1 Level AA**

- Semantic HTML5 (nav, main, article, aside)
- Keyboard navigation: Tab order follows visual flow, Enter/Space activates buttons
- ARIA labels for icon buttons, status indicators, live regions (leaderboard updates)
- Color contrast: 4.5:1 minimum for body text, 3:1 for large text
- Focus indicators: Visible outline (2px blue ring) on all interactive elements
- Screen reader announcements: "Submission evaluating...", "Score updated: 87/100"

### Branding

**Style:** Clean, modern, tech-forward

- **Color Palette:**
  - Primary: Blue (#3B82F6) - CTAs, links, active states
  - Success: Green (#10B981) - High scores, positive feedback
  - Warning: Amber (#F59E0B) - Medium scores, deadlines approaching
  - Error: Red (#EF4444) - Low scores, validation errors
  - Neutral: Gray scale (#F9FAFB to #111827)

- **Typography:**
  - Headings: Inter (sans-serif, weight 700)
  - Body: Inter (weight 400)
  - Code/mono: JetBrains Mono (for repo URLs, technical content)

- **Components:** shadcn/ui defaults (minimal customization to ship fast)

- **Tone:** Professional but approachable, no jargon, encouraging language

### Target Device and Platforms

**Primary:** Web Responsive (Desktop-first, mobile-optimized)

- **Desktop:** 1920x1080 (primary dev/design target)
- **Tablet:** 768px breakpoint (responsive grid collapse)
- **Mobile:** 375px minimum (iPhone SE / Android small screens)

**Browsers:**
- Chrome/Edge (primary support)
- Firefox, Safari (tested, supported)
- No IE11 support

---

## Technical Assumptions

### Repository Structure

**Monorepo** - Single Next.js application containing all frontend, backend API routes, and database utilities.

**Rationale:** Simplifies deployment, reduces coordination overhead for solo developer, and aligns with Next.js best practices. Vercel handles monorepo deployment seamlessly.

### Service Architecture

**Monolithic Next.js Application (Serverless Functions)**

- **Frontend:** Next.js 15 App Router with React Server Components
- **API Layer:** Next.js Route Handlers (`app/api/`) for Groq LLM evaluation, submission processing
- **Database:** Supabase (PostgreSQL) with direct client connections (SSR + client-side)
- **Authentication:** Supabase Auth with GitHub OAuth provider
- **File Storage:** N/A for MVP (link-based submissions only)

**Rationale:** Serverless architecture via Vercel eliminates DevOps complexity, auto-scales, and fits within free tier limits. Monolithic structure appropriate for MVP scale (<1000 users, <100 req/min).

### Testing Requirements

**Manual QA Only for MVP** (No automated tests due to 24-hour constraint)

- **Pre-demo checklist:** Happy path walkthrough, edge case spot-checks, cross-browser visual QA
- **Post-MVP:** Add Jest + React Testing Library (unit), Playwright (E2E)

**Rationale:** Writing tests takes 30-40% of development time; hackathon prioritizes working demo over test coverage. Tests added in Phase 2.

### Additional Technical Assumptions and Requests

**Frontend:**
- **TypeScript (strict mode)** - Type safety prevents runtime errors
- **Tailwind CSS 3.4+** - Utility-first styling, rapid UI development
- **shadcn/ui components** - Pre-built accessible components (Button, Card, Dialog, Form, Input, Tabs, Badge, Select, Textarea, Sonner for toasts)
- **React Hook Form + Zod** - Form state management and validation
- **Lucide React** - Icon library (bundled with shadcn/ui)

**Backend:**
- **Supabase client libraries** - `@supabase/supabase-js` for SSR and client-side DB access
- **Groq SDK** - `groq-sdk` npm package for LLM API calls
- **Database Schema:**
  - `users` table: id (UUID), github_id, username, email, avatar_url, bio, created_at
  - `challenges` table: id (UUID), title, description, problem_statement, rubric (JSONB), difficulty, deadline, sponsor_name, sponsor_logo_url, created_at
  - `submissions` table: id (UUID), challenge_id (FK), user_id (FK), repo_url, deck_url, video_url, summary, status (pending/evaluating/scored), created_at
  - `evaluations` table: id (UUID), submission_id (FK), score (INTEGER 0-100), criterion_scores (JSONB), feedback (TEXT), evaluated_at
  - `leaderboard_cache` view: Materialized view for fast leaderboard queries (challenge_id, user_id, score, rank)

**Deployment:**
- **Hosting:** Vercel (Hobby plan, free tier)
- **Database:** Supabase Free tier (500MB, 50K MAU)
- **Environment Variables:** `.env.local` for development, Vercel environment variables for production
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (server-side only)
  - `GROQ_API_KEY` (server-side only)

**Security:**
- **Row Level Security (RLS):** Enabled on all Supabase tables
  - Users can SELECT any user/submission/challenge
  - Users can INSERT/UPDATE only their own submissions
  - Evaluations are INSERT-only by service role
- **API Route Protection:** Server-side session validation for protected routes
- **Input Sanitization:** Zod schemas validate all user inputs before DB writes
- **Rate Limiting:** Vercel default rate limiting (100 req/10s per IP)

**Known Constraints:**
- **Groq API rate limit:** 30 req/min on free tier → Queue evaluation requests if exceeded, show "Position in queue" UI
- **Supabase limitations:** 500MB storage (text-only data easily within limit), 50K MAU (far exceeds demo needs)
- **No caching layer:** Direct DB queries for MVP (add Redis in Phase 2 if needed)
- **No CDN for static assets beyond Vercel Edge:** Acceptable for MVP scale

---

## Epic List

This PRD defines **3 core epics** that deliver the complete 24-hour MVP in logical sequence:

**Epic 1: Foundation & Authentication**
**Goal:** Establish project infrastructure, authentication flow, and basic user management so builders can sign up and access the platform.

**Epic 2: Challenge Discovery & Submission Pipeline**
**Goal:** Enable builders to browse challenges, submit projects via forms, and trigger LLM evaluation, delivering the core product loop.

**Epic 3: Evaluation & Leaderboard**
**Goal:** Implement Groq-powered LLM evaluation and real-time leaderboards to showcase top talent and complete the competitive marketplace experience.

---

## Epic 1: Foundation & Authentication

**Epic Goal:** Establish the foundational Next.js application with deployment pipeline, GitHub OAuth authentication, and basic user profile management. By the end of this epic, users can sign in, view their profile, and the application is live on Vercel with a functional health check.

### Story 1.1: Project Setup & Deployment Pipeline

**As a** developer,
**I want** a Next.js 15 project initialized with TypeScript, Tailwind CSS, and deployed to Vercel,
**so that** I have a solid foundation for rapid feature development with automatic preview deployments.

#### Acceptance Criteria

1. Next.js 15 project created using `create-next-app` with App Router, TypeScript, Tailwind CSS, and ESLint
2. shadcn/ui initialized with `npx shadcn@latest init` and base components (Button, Card) added
3. Git repository initialized with `.gitignore` excluding `.env.local`, `node_modules`, `.next`
4. GitHub repository created and code pushed to `main` branch
5. Vercel project connected to GitHub repo with automatic deployments enabled
6. Environment variables configured in Vercel dashboard (placeholders for Supabase/Groq)
7. Health check route (`app/api/health/route.ts`) returns `{status: "ok", timestamp: Date.now()}`
8. Production URL accessible and health check endpoint returns 200 OK

### Story 1.2: Supabase Database Setup

**As a** developer,
**I want** Supabase configured with database schema and RLS policies,
**so that** user data and submissions are securely stored and accessible.

#### Acceptance Criteria

1. Supabase project created (free tier) with PostgreSQL database provisioned
2. Database schema created with tables:
   - `users`: id (UUID, PK), github_id (TEXT, UNIQUE), username (TEXT), email (TEXT), avatar_url (TEXT), bio (TEXT), created_at (TIMESTAMPTZ)
   - `challenges`: id (UUID, PK), title (TEXT), description (TEXT), problem_statement (TEXT), rubric (JSONB), difficulty (TEXT), deadline (TIMESTAMPTZ), sponsor_name (TEXT), sponsor_logo_url (TEXT), created_at (TIMESTAMPTZ)
   - `submissions`: id (UUID, PK), challenge_id (UUID, FK), user_id (UUID, FK), repo_url (TEXT), deck_url (TEXT), video_url (TEXT), summary (TEXT), status (TEXT), created_at (TIMESTAMPTZ)
   - `evaluations`: id (UUID, PK), submission_id (UUID, FK), score (INTEGER), criterion_scores (JSONB), feedback (TEXT), evaluated_at (TIMESTAMPTZ)
3. Row Level Security (RLS) policies created:
   - `users`: SELECT (public), INSERT/UPDATE (own records only via user_id = auth.uid())
   - `challenges`: SELECT (public), INSERT/UPDATE (service role only)
   - `submissions`: SELECT (public), INSERT/UPDATE (own records only)
   - `evaluations`: SELECT (public), INSERT (service role only)
4. Supabase client utilities created in `lib/supabase/`:
   - `client.ts`: Browser client with anon key
   - `server.ts`: Server client with service role key for admin operations
5. Environment variables added to `.env.local` and Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
6. Test query succeeds: `SELECT * FROM challenges LIMIT 1` returns empty array or seed data

### Story 1.3: GitHub OAuth Authentication

**As a** builder,
**I want** to sign in with my GitHub account,
**so that** I can access the platform without creating a new password and my profile is auto-populated from GitHub.

#### Acceptance Criteria

1. Supabase Auth configured with GitHub OAuth provider (Client ID and Secret from GitHub OAuth App)
2. Redirect URLs configured in GitHub OAuth App: `http://localhost:3000/auth/callback`, `https://<vercel-domain>/auth/callback`
3. Sign-in page created at `app/(auth)/sign-in/page.tsx` with:
   - "Sign in with GitHub" button (shadcn/ui Button)
   - Clear value proposition text ("Join BuildAI Arena to showcase your AI projects")
   - Redirects to GitHub OAuth flow on click
4. Auth callback route created at `app/auth/callback/route.ts`:
   - Exchanges OAuth code for session
   - Creates/updates user record in `users` table with GitHub metadata
   - Redirects to `/challenges` on success, `/sign-in?error=auth_failed` on failure
5. Middleware created at `middleware.ts`:
   - Protects routes: `/challenges/*`, `/submit/*`, `/profile/*`
   - Redirects unauthenticated users to `/sign-in`
   - Passes authenticated users through
6. Sign-out functionality: Button in header calls `supabase.auth.signOut()` and redirects to `/`
7. Session persists across page reloads (Supabase handles token refresh automatically)
8. Manual test: Sign in with GitHub → user record created in DB → profile page shows GitHub avatar and username

### Story 1.4: User Profile Page

**As a** builder,
**I want** to view my profile with my GitHub info and submission history,
**so that** I can track my progress and see all my projects in one place.

#### Acceptance Criteria

1. Profile page created at `app/profile/page.tsx`:
   - Displays user avatar (GitHub profile photo), username, GitHub link, join date
   - Shows "Submissions" section with list of user's submissions (empty state: "No submissions yet")
   - Displays placeholder badges ("First Submission", "Top 10%", "Challenge Winner") - not functional yet
2. Profile data fetched server-side using Supabase RLS (query: `SELECT * FROM users WHERE id = auth.uid()`)
3. Submissions query joins with challenges: `SELECT submissions.*, challenges.title FROM submissions JOIN challenges ON submissions.challenge_id = challenges.id WHERE user_id = auth.uid()`
4. Each submission card shows: Challenge title, score (if evaluated), submission date, "View Details" link
5. Empty state UI: Illustration + "Submit your first project" CTA linking to `/challenges`
6. Responsive layout: Single column on mobile, two columns (info + submissions) on desktop
7. Header navigation includes "Profile" link (only visible when authenticated)
8. Manual test: Sign in → navigate to `/profile` → see GitHub data and empty submissions list

---

## Epic 2: Challenge Discovery & Submission Pipeline

**Epic Goal:** Enable builders to discover AI product challenges, submit their projects via a validated form, and trigger the evaluation process. By the end of this epic, users can browse 3-5 seed challenges, submit projects with all required fields, and see submission status updates.

### Story 2.1: Seed Challenge Data

**As a** developer,
**I want** 3-5 realistic AI product challenges seeded in the database,
**so that** builders have challenges to browse and submit to without building an admin interface.

#### Acceptance Criteria

1. Supabase migration script created: `supabase/migrations/002_seed_challenges.sql`
2. 3-5 challenge records inserted into `challenges` table with:
   - **Challenge 1:** "AI Customer Support Chatbot" (Easy, Deadline: 7 days from now)
     - Problem statement: 2-3 paragraphs describing need for customer support automation
     - Rubric (JSONB): `{"criteria": [{"name": "Technical Implementation", "weight": 30}, {"name": "User Experience", "weight": 25}, {"name": "Business Value", "weight": 20}, {"name": "Documentation", "weight": 15}, {"name": "Innovation", "weight": 10}]}`
     - Sponsor: "TechCorp Inc." with placeholder logo URL
   - **Challenge 2:** "AI-Powered Code Review Assistant" (Medium)
   - **Challenge 3:** "Personalized Learning Path Generator" (Hard)
   - *Optional 4-5:* Additional challenges varying difficulty and domain
3. Each rubric includes 3-5 weighted criteria (weights sum to 100%)
4. Migration runs successfully: `npx supabase db push`
5. Query returns seeded data: `SELECT * FROM challenges` shows 3-5 records
6. Challenges table includes realistic problem statements (200-300 words each) suitable for demo

### Story 2.2: Challenge Browse Page

**As a** builder,
**I want** to browse available challenges in a grid view with filters,
**so that** I can find challenges that match my interests and skill level.

#### Acceptance Criteria

1. Challenge browse page created at `app/challenges/page.tsx`
2. Page fetches all active challenges (server-side query: `SELECT * FROM challenges WHERE deadline > NOW() ORDER BY created_at DESC`)
3. Grid layout: 3 columns on desktop (1024px+), 2 columns on tablet (768px+), 1 column on mobile
4. Each challenge card (shadcn/ui Card) displays:
   - Title (h3, truncated to 2 lines)
   - Sponsor logo (48x48px, placeholder if missing)
   - Difficulty badge (Easy=green, Medium=amber, Hard=red)
   - Deadline countdown ("5 days left", "23 hours left")
   - Participant count (query: `COUNT(DISTINCT user_id) FROM submissions WHERE challenge_id = ?`)
   - "View Challenge" button
5. Filter controls (shadcn/ui Select):
   - Difficulty filter (All/Easy/Medium/Hard) - client-side filtering
   - Status filter placeholder (Active/Upcoming/Closed) - shows "Active" only for MVP
6. Empty state: If no challenges, show "No challenges available" with illustration
7. Click "View Challenge" navigates to `/challenges/[id]`
8. Page is responsive and accessible (keyboard navigation, ARIA labels)

### Story 2.3: Challenge Detail Page

**As a** builder,
**I want** to view full challenge details including problem statement and evaluation rubric,
**so that** I understand what I need to build and how I'll be evaluated.

#### Acceptance Criteria

1. Challenge detail page created at `app/challenges/[id]/page.tsx`
2. Challenge data fetched server-side: `SELECT * FROM challenges WHERE id = $1`
3. Page layout includes:
   - Header: Challenge title, sponsor logo, difficulty badge, deadline countdown
   - Problem Statement section: Markdown rendering of `problem_statement` field
   - Evaluation Rubric section: Table showing criteria name, weight %, description (from JSONB)
   - Leaderboard section: Top 10 submissions (Story 3.2 will populate this)
   - Sticky "Submit Project" button (fixed position on scroll)
4. If challenge not found (invalid ID), show 404 page
5. If user is not authenticated, "Submit Project" button shows "Sign in to Submit"
6. Markdown rendering: Uses `react-markdown` or similar for problem statement formatting
7. Rubric table is sortable by weight (descending by default)
8. Mobile layout: Stacks sections vertically, sticky button remains visible
9. Manual test: Navigate to `/challenges/[valid-id]` → see full challenge details

### Story 2.4: Submission Form

**As a** builder,
**I want** to submit my AI project to a challenge via a multi-step form,
**so that** my work can be evaluated and ranked on the leaderboard.

#### Acceptance Criteria

1. Submission form page created at `app/submit/[challengeId]/page.tsx` (protected route, requires auth)
2. Multi-step form implemented using React Hook Form + Zod validation:
   - **Step 1:** Confirm challenge selection (read-only, shows challenge title)
   - **Step 2:** Project links
     - GitHub Repository URL (required, validated: must be valid GitHub URL format `https://github.com/user/repo`)
     - Pitch Deck URL (required, accepts Google Slides/PDF/Dropbox links)
     - Demo Video URL (required, accepts YouTube/Loom/Vimeo embeds)
   - **Step 3:** Written Summary (required, textarea, 500 character max with live counter)
   - **Step 4:** Review all inputs, "Submit for Evaluation" button
3. Validation rules (Zod schema):
   - GitHub URL: Regex match `^https://github\.com/[\w-]+/[\w-]+$`
   - Deck/Video URLs: Valid URL format, HTTPS only
   - Summary: 50-500 characters (min 50 to ensure substance)
4. Form state persists across steps (local state, not saved to DB until final submit)
5. "Back" and "Next" buttons navigate between steps
6. On final submit:
   - Client-side: Optimistic UI shows "Submitting..." toast
   - Server Action: INSERT into `submissions` table with `status='pending'`
   - Trigger evaluation API route (Story 3.1)
   - Redirect to `/submissions/[submissionId]` with "Evaluating..." status
7. Error handling: If submission INSERT fails, show error toast with retry option
8. Form is fully accessible (keyboard navigation, ARIA labels, error announcements)
9. Manual test: Complete form → submission record created in DB → redirected to submission detail page

### Story 2.5: Submission Status Page

**As a** builder,
**I want** to see the status of my submission and evaluation results,
**so that** I know when my project has been scored and can review feedback.

#### Acceptance Criteria

1. Submission detail page created at `app/submissions/[id]/page.tsx`
2. Submission data fetched with join: `SELECT submissions.*, evaluations.*, challenges.title FROM submissions LEFT JOIN evaluations ON submissions.id = evaluations.submission_id JOIN challenges ON submissions.challenge_id = challenges.id WHERE submissions.id = $1`
3. Page displays:
   - Challenge title (linked to challenge page)
   - Submission info: Repo link (opens in new tab), Deck link, Video embed (iframe or link), Summary text
   - Status indicator:
     - `pending`: "Queued for Evaluation" (info badge)
     - `evaluating`: "Evaluating..." (loading spinner + animated badge)
     - `scored`: Score card (see below)
4. If status = `scored`, show evaluation results:
   - Overall score (large display: "87/100")
   - Per-criterion breakdown: Bar chart showing each rubric criterion's score (use Recharts or simple CSS bars)
   - LLM feedback: Blockquote displaying `evaluations.feedback` text
5. If status = `pending` or `evaluating`, show message: "Your submission is being evaluated. This typically takes < 30 seconds. Refresh to see results."
6. Add "Refresh" button that re-fetches data (with loading state)
7. RLS policy enforces: User can only view their own submissions or public submissions on leaderboard
8. If submission not found or access denied, show 404 or 403 error
9. Manual test: Submit project → wait for evaluation → refresh page → see score and feedback

---

## Epic 3: Evaluation & Leaderboard

**Epic Goal:** Implement the core technical innovation—Groq-powered LLM evaluation—and real-time leaderboards that rank builders by performance. By the end of this epic, submissions are automatically scored within 30 seconds, leaderboards update live, and the full competitive marketplace experience is functional.

### Story 3.1: Groq LLM Evaluation Engine

**As a** builder,
**I want** my submission automatically evaluated by AI based on the challenge rubric,
**so that** I receive immediate, objective feedback on my work.

#### Acceptance Criteria

1. Groq API client configured in `lib/groq/client.ts`:
   - Initialize Groq SDK with `GROQ_API_KEY` from environment
   - Export `evaluateSubmission(submissionData, rubric)` function
2. Evaluation API route created at `app/api/evaluate/route.ts`:
   - Accepts POST with `submissionId` in body
   - Fetches submission and challenge rubric from database
   - Calls Groq API (model: `llama-3.1-70b-versatile`) with structured prompt:
     ```
     You are an expert evaluator of AI product submissions. Evaluate the following project submission against this rubric:

     [RUBRIC JSON]

     Project Details:
     - GitHub Repo: [repo_url]
     - Pitch Deck: [deck_url]
     - Demo Video: [video_url]
     - Summary: [summary]

     Provide:
     1. Overall score (0-100)
     2. Per-criterion scores (JSON: {"criterion_name": score})
     3. Written feedback (200-300 words) explaining strengths, weaknesses, and suggestions

     Output format:
     {
       "overall_score": 87,
       "criterion_scores": {"Technical Implementation": 85, "User Experience": 90, ...},
       "feedback": "This project demonstrates..."
     }
     ```
   - Parses Groq response (JSON)
   - Inserts evaluation record into `evaluations` table
   - Updates submission status to `scored`
   - Returns `{success: true, evaluationId: ...}`
3. Error handling:
   - If Groq API fails (timeout, rate limit, invalid response), log error and retry once
   - If retry fails, set submission status to `failed` with error message
   - Return appropriate HTTP status codes (200 success, 429 rate limit, 500 server error)
4. Evaluation triggered automatically after submission INSERT via database trigger or Next.js Server Action
5. Average evaluation time < 30 seconds (measured via `evaluated_at - created_at`)
6. LLM feedback is coherent, specific, and references the actual submission details (not generic)
7. Manual test: Submit project → evaluation completes within 30s → score and feedback appear on submission page

### Story 3.2: Real-Time Leaderboard

**As a** builder,
**I want** to see where I rank against other builders on each challenge,
**so that** I can gauge my performance and be motivated to improve.

#### Acceptance Criteria

1. Leaderboard component created at `components/features/Leaderboard.tsx`:
   - Fetches ranked submissions for a challenge: `SELECT submissions.*, users.username, users.avatar_url, evaluations.score FROM submissions JOIN users ON submissions.user_id = users.id JOIN evaluations ON submissions.id = evaluations.submission_id WHERE submissions.challenge_id = $1 AND evaluations.score IS NOT NULL ORDER BY evaluations.score DESC LIMIT 10`
   - Displays table with columns: Rank (#1, #2, ...), Avatar (user photo), Name (username), Score (e.g., "87/100"), Action ("View Project" link)
2. Leaderboard embedded in Challenge Detail page (`app/challenges/[id]/page.tsx`)
3. Real-time updates using Supabase Realtime:
   - Subscribe to `evaluations` table changes filtered by challenge submissions
   - When new evaluation is inserted, re-fetch leaderboard data
   - Update UI with smooth animation (highlight new entry for 2 seconds)
4. If no submissions scored yet, show empty state: "No submissions evaluated yet. Be the first!"
5. User's own submission is highlighted (different background color) if in top 10
6. Click "View Project" navigates to `/submissions/[id]`
7. Leaderboard is responsive: Table on desktop, stacked cards on mobile
8. Real-time subscription cleans up on component unmount (no memory leaks)
9. Manual test: Submit project → wait for evaluation → leaderboard updates within 1 second → new entry appears

### Story 3.3: Homepage & Navigation

**As a** visitor,
**I want** to land on a compelling homepage that explains BuildAI Arena and directs me to relevant actions,
**so that** I understand the value and can quickly sign up or browse challenges.

#### Acceptance Criteria

1. Homepage created at `app/page.tsx` with sections:
   - **Hero:** Headline ("Prove Your AI Skills. Get Hired."), subheadline (value prop), dual CTAs ("Browse Challenges" → `/challenges`, "Sign In" → `/sign-in`)
   - **How It Works:** 3-step visual flow (icons + text):
     1. "Choose a Challenge" (icon: target)
     2. "Build & Submit Your Project" (icon: code)
     3. "Get Evaluated & Ranked" (icon: trophy)
   - **Featured Challenges:** 3 challenge cards (fetched from DB, sorted by newest)
   - **Social Proof:** Fake stats in grid: "1,247 Builders", "89 Challenges", "342 Projects Evaluated" (placeholder for MVP)
   - **Footer:** Links to About, How It Works (anchor to section), GitHub repo
2. Global navigation header created at `components/Navigation.tsx`:
   - Logo (text: "BuildAI Arena") linking to `/`
   - Nav links: "Challenges" (`/challenges`), "Leaderboard" (`/leaderboard` - placeholder for MVP, shows message "Global leaderboard coming soon")
   - Auth state:
     - If not signed in: "Sign In" button
     - If signed in: User avatar dropdown with links to "Profile", "Sign Out"
3. Navigation is sticky (fixed to top on scroll)
4. All CTAs have clear hover states and are keyboard accessible
5. Homepage is fully responsive (hero stacks on mobile, stats grid adjusts)
6. Manual test: Visit `/` → see all sections → click CTAs → navigate correctly

### Story 3.4: Polish & Error Handling

**As a** user,
**I want** a polished, bug-free experience with clear error messages,
**so that** the platform feels professional and I'm never confused about what went wrong.

#### Acceptance Criteria

1. Global error boundary added (`app/error.tsx`):
   - Catches unhandled errors and displays user-friendly message: "Something went wrong. Please refresh or contact support."
   - Logs error to console for debugging
2. Loading states added for all async operations:
   - Skeleton loaders (shadcn/ui Skeleton) for challenge cards, leaderboards while fetching
   - Spinners for form submissions, evaluation status checks
3. Toast notifications (shadcn/ui Sonner) for:
   - Success: "Project submitted successfully!"
   - Error: "Failed to submit. Please check your URLs and try again."
   - Info: "Evaluation in progress..."
4. Form validation errors display inline (below each field) with red text and error icons
5. 404 page (`app/not-found.tsx`) with "Page not found" message and link back to `/challenges`
6. All external links (GitHub repos, decks, videos) open in new tabs (`target="_blank"`)
7. URL validation: If user submits invalid GitHub URL, show error: "Please enter a valid GitHub repository URL (e.g., https://github.com/user/repo)"
8. Rate limit handling: If Groq API returns 429, display message: "Evaluation queue is full. Your submission will be processed shortly."
9. Accessibility audit:
   - All images have alt text
   - Forms have proper labels and ARIA descriptions
   - Color contrast passes WCAG AA (tested with browser dev tools)
10. Manual QA walkthrough:
    - Sign in → browse challenges → submit project → wait for evaluation → view leaderboard → check profile
    - Test error cases: invalid URLs, network failures, expired sessions
    - Test on Chrome, Firefox, Safari
    - Test on mobile (iPhone Safari, Android Chrome)

---

## Checklist Results Report

*(This section will be populated after running the PM checklist task `execute-checklist.md` with `pm-checklist.md`. For YOLO mode, skipping this step to maintain speed. In a real project, this would validate that all stories are complete, dependencies are clear, and acceptance criteria are testable.)*

**Checklist Status:** ⏭️ Skipped for 24-hour hackathon MVP (manual review recommended post-generation)

---

## Next Steps

### UX Expert Prompt

*(Note: UX Expert agent is optional for this MVP. The PRD includes sufficient UI/UX specifications in the "User Interface Design Goals" section to guide development. If detailed wireframes or Figma mockups are needed post-MVP, load the UX Expert agent with this PRD as input.)*

**Prompt for UX Expert:**
> Review this PRD and create high-fidelity wireframes for the core screens (Homepage, Challenge Detail, Submission Form, Leaderboard, Profile). Focus on responsive layouts, component reusability (shadcn/ui), and accessibility. Export designs as Figma file or annotated screenshots.

### Architect Prompt

**Load the Architect agent and use this PRD as input to create the detailed Architecture document.**

**Prompt for Architect:**
> This PRD defines BuildAI Arena, a 24-hour hackathon MVP. Create a comprehensive Architecture document covering:
> - **Tech Stack Decisions:** Validate Next.js 15, Supabase, Groq, shadcn/ui choices with rationale
> - **Database Schema:** Detailed table definitions with indexes, foreign keys, RLS policies
> - **API Design:** Document all API routes (health check, evaluation endpoint, submission endpoints)
> - **Source Tree Structure:** Define folder organization (app/, components/, lib/, types/)
> - **Security Architecture:** Detail auth flow, RLS policies, environment variable management
> - **Performance Optimization:** Caching strategy, query optimization, Vercel edge caching
> - **Deployment Pipeline:** Vercel setup, environment promotion, rollback procedures
> - **Coding Standards:** TypeScript conventions, component patterns, commit message format
>
> Ensure all architectural decisions align with the 24-hour constraint and free-tier budget ($0 direct costs).

---

**🎉 PRD Complete!**

This PRD provides the complete blueprint for building BuildAI Arena MVP in 24 hours. Next: Hand off to Architect agent for detailed technical specifications.

