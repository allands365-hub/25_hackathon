# Project Brief: BuildAI Arena

## Executive Summary

**BuildAI Arena** is a competitive platform where aspiring AI builders create and submit product-ready AI MVPs to solve company-sponsored challenges, while employers discover and recruit proven talent through automated LLM-driven scoring and hybrid leaderboards.

**Problem:** AI-centric companies struggle to assess real product-building skills beyond algorithmic puzzles, while self-taught AI builders lack platforms to showcase holistic AI product capabilities—resulting in prolonged hiring cycles and mismatched talent.

**Target Market:** Self-taught AI builders seeking to demonstrate applied skills (primary) and AI companies/recruiters looking for candidates with proven end-to-end product expertise (secondary).

**Value Proposition:** Unlike traditional coding challenge platforms (LeetCode, HackerRank), BuildAI Arena evaluates complete AI product thinking—prompt design, UX flow, data handling, business framing—through real project submissions scored by Groq-powered LLM evaluation, creating a direct pipeline from demonstrated capability to job opportunities.

## Problem Statement

### The Hiring Skills Gap in Applied AI

The AI industry faces a critical assessment crisis: **companies cannot reliably evaluate whether candidates can ship production-ready AI products**, while talented builders struggle to prove their capabilities through traditional channels.

#### Current State & Pain Points

**For AI-Centric Companies:**
- Hiring processes rely on algorithmic coding tests (LeetCode, HackerRank) that measure computer science fundamentals but fail to assess applied AI product skills
- Interviews miss critical competencies: prompt engineering, AI UX design, data pipeline handling, responsible AI considerations, and business problem framing
- Result: Extended hiring cycles (3-6 months average for AI roles), high mis-hire rates, and overlooked talent from non-traditional backgrounds

**For Self-Taught AI Builders:**
- No standardized way to demonstrate end-to-end AI product capabilities beyond personal GitHub repos (which lack context and validation)
- Portfolio projects often dismissed as "toy projects" without third-party verification
- Traditional credentials (CS degrees, FAANG experience) still dominate hiring despite emergence of capable self-taught builders
- Limited access to real-world problem statements that mirror actual company challenges

#### Impact & Scale

- **Market size:** 300,000+ AI/ML job openings in 2024 (LinkedIn), with 45% reporting difficulty finding qualified candidates
- **Opportunity cost:** Companies lose 6-12 months of productivity per mis-hire
- **Builder frustration:** Estimated 2M+ self-learners globally with AI skills but no pathway to demonstrate them credibly

#### Why Existing Solutions Fall Short

| **Platform** | **What It Measures** | **What It Misses** |
|--------------|---------------------|-------------------|
| LeetCode/HackerRank | Algorithms & data structures | Applied AI, product thinking, UX, business framing |
| Kaggle | Model accuracy on datasets | Full product development, deployment, user experience |
| GitHub Portfolios | Code quality | Validation, context, problem-solving approach, impact |
| Traditional Resumes | Credentials & experience | Actual demonstrated capability on realistic problems |

#### Urgency: Why Now?

1. **AI skill shortage:** Companies are desperate for proven AI builders as adoption accelerates
2. **Democratization of AI tools:** Self-taught builders now have access to world-class models (GPT-4, Claude, Llama) but no credentialing system
3. **LLM-powered evaluation:** For the first time, automated evaluation of complex product submissions is technically feasible
4. **Remote work normalization:** Geographic barriers eliminated, making global talent pools accessible if assessment can be trusted

## Proposed Solution

### BuildAI Arena: Competitive Marketplace for Applied AI Talent

BuildAI Arena transforms how AI builders prove their skills and how companies discover talent by creating a **competitive, challenge-based platform** where real product submissions replace résumés.

#### Core Concept

A web-based competitive arena where:

1. **Companies post real-world AI challenges** with defined problem statements, evaluation rubrics, and deadlines
2. **Builders create full AI product MVPs** including working prototype, pitch deck, and demo video
3. **Automated LLM evaluation** (powered by Groq AI) scores submissions against rubrics for immediate feedback
4. **Hybrid leaderboards** rank participants, surfacing top talent to hiring partners
5. **Direct engagement pipeline** connects high-performing builders with job/freelance opportunities

#### Key Differentiators

**vs. LeetCode/HackerRank:**
- Evaluates **end-to-end product creation**, not isolated algorithms
- Assesses **AI-specific skills**: prompt engineering, RAG implementation, AI UX design

**vs. Kaggle:**
- Focuses on **complete products** (UX + backend + deployment), not just model accuracy
- Includes **business framing** and **user experience** as evaluation criteria

**vs. Devpost:**
- **Standardized evaluation** via LLM-driven rubrics (not just community voting)
- **Direct hiring pipeline** with early access for sponsor companies

**vs. GitHub Portfolios:**
- **Third-party validation** through competitive scoring
- **Real company challenges** provide business context

#### Why This Solution Will Succeed

1. **Automated evaluation breakthrough:** Groq AI enables scalable, consistent scoring of complex product submissions—previously impossible without expensive human reviewers

2. **Two-sided value creation:**
   - **Builders:** Credible portfolio + competition prizes + job opportunities
   - **Companies:** Pre-vetted talent pool + assessment aligned with real needs

3. **Network effects:** Each challenge attracts builders; quality submissions attract more companies; more companies = better challenges

4. **Timing advantage:** First-mover in LLM-evaluated AI product challenges creates defensible moat

#### High-Level Vision

**Phase 1 (MVP - 24 hours):**
- Challenge catalogue with 3-5 seed challenges
- Builder onboarding + submission flow
- Groq-powered automated scoring
- Simple leaderboard

**Phase 2 (Post-hackathon):**
- Company sponsor dashboard
- Badge/recognition system
- Advanced career scoring
- Email notifications
- Payment/prize distribution

**Long-term (12 months):**
- Global competition seasons
- Corporate training programs
- AI builder certification
- Talent marketplace integration

## Target Users

### Primary User Segment: Self-Taught AI Builders

**Profile:**
- **Demographics:** Ages 22-35, globally distributed (heavy concentration in India, Eastern Europe, Southeast Asia, Latin America)
- **Technical background:** Mix of bootcamp graduates, self-learners via online courses (Coursera, FastAI, DeepLearning.AI), career switchers from adjacent tech roles
- **Current skill level:** Intermediate to advanced in Python, familiar with LLMs (OpenAI API, Anthropic Claude, open-source models), comfortable with web frameworks
- **Financial status:** Job-seeking or underemployed relative to skill level; motivated by income improvement

**Current Behaviors:**
- Building personal AI projects (chatbots, RAG applications, automation tools) but struggling to monetize or gain recognition
- Active in AI communities (Twitter/X AI, r/LocalLLaMA, Discord servers, Hugging Face forums)
- Consuming tutorials and keeping up with rapid AI developments, but lacking structured validation of skills
- Applying to jobs with GitHub portfolios that get overlooked due to lack of credentials

**Specific Needs:**
- **Credible proof of applied AI skills** that hiring managers will trust
- **Real-world problem statements** that mirror actual company challenges (not toy datasets)
- **Competitive environment** for motivation and benchmark against peers
- **Direct path to opportunities** without traditional gatekeepers (university degrees, FAANG experience)

**Goals:**
- Land first AI/ML role or level up to senior positions
- Build portfolio that stands out from "ChatGPT wrapper" projects
- Connect with companies actively hiring for AI roles
- Earn income through prizes while job searching

**Pain Points:**
- Personal projects dismissed as "not production-ready" or "toy examples"
- No way to prove skills beyond "trust my GitHub repo"
- Limited access to mentorship or industry-standard problem framing
- Algorithmic interview prep (LeetCode) feels disconnected from actual AI product work

### Secondary User Segment: AI-Hiring Companies

**Profile:**
- **Company type:** Startups (Series A-C) and mid-size tech companies building AI-first products, plus forward-thinking teams at larger enterprises
- **Roles involved:** Engineering managers, tech recruiters, CTOs, VP Engineering
- **Hiring urgency:** High—struggling to fill AI/ML roles despite budget availability
- **Current hiring spend:** $15K-$50K per hire (recruiter fees + time cost)

**Current Behaviors:**
- Posting on LinkedIn, using recruiters, attending AI conferences for talent sourcing
- Conducting multi-stage interviews (resume screen → coding test → system design → cultural fit)
- Relying on LeetCode-style assessments despite knowing they don't measure AI product skills
- Hiring primarily from FAANG or candidates with traditional CS credentials due to perceived lower risk

**Specific Needs:**
- **Pre-vetted talent pool** with demonstrated AI product-building capability
- **Assessment aligned with actual job requirements** (not generic algorithms)
- **Reduced time-to-hire** from 3-6 months to weeks
- **Access to non-traditional talent** (geographic diversity, bootcamp grads, career switchers) with proof of capability

**Goals:**
- Find builders who can ship AI products from day one
- Reduce mis-hire rate and expensive bad hires
- Build employer brand in AI community by sponsoring meaningful challenges
- Gain early access to top talent before competitors

**Pain Points:**
- Algorithmic tests don't predict on-the-job success for AI roles
- GitHub portfolios lack context—hard to distinguish quality
- Interview process is expensive (engineering time) and slow
- Missing out on talented non-traditional candidates due to credential bias

## Goals & Success Metrics

### Business Objectives

- **Launch functional MVP within 24-hour hackathon window** demonstrating core workflow: challenge browse → builder signup → submission → LLM scoring → leaderboard
  - *Success metric:* Complete end-to-end user flow deployable and demoable

- **Achieve technical proof-of-concept for Groq-powered LLM evaluation** that can meaningfully score AI product submissions against a rubric
  - *Success metric:* LLM generates scores (0-100) with written feedback for 3+ evaluation criteria

- **Demonstrate two-sided marketplace value proposition** through polished UI showing both builder and company perspectives
  - *Success metric:* Professional interface using shadcn/ui that could credibly be shown to potential users/investors

- **Validate product-market fit hypothesis** post-hackathon through user feedback and engagement signals
  - *Success metric (post-MVP):* 10+ builders sign up organically; 2+ companies express interest in sponsoring challenges

### User Success Metrics

**For Builders:**
- **Onboarding completion rate:** % of visitors who complete GitHub OAuth → profile setup → view first challenge
  - *Target:* 60%+ (industry standard for OAuth flows)

- **Submission rate:** % of signed-up users who submit to at least one challenge
  - *Target (MVP):* 30%+ (demonstrates value prop resonance)

- **Time to first submission:** Median time from signup to first submission
  - *Target:* < 2 hours (for hackathon demo; real-world would be days/weeks)

**For Companies (Post-MVP):**
- **Challenge posting to first quality submission:** Days until first 70+ scored submission
  - *Target:* < 7 days

- **Talent contact rate:** % of top-10 leaderboard builders contacted by companies
  - *Target:* 50%+

### Key Performance Indicators (KPIs)

**Platform Activity:**
- *Active challenges:* Number of live challenges with submissions - **MVP Target:** 3-5 seed challenges
- *Total submissions:* Count of completed submissions - **MVP Target:** 5+ (can use test data for demo)
- *Average submission score:* Mean LLM-generated score - **Target:** 65-75 (validates rubric isn't too easy/hard)

**Engagement Quality:**
- *Submission completeness:* % of submissions with all required components (repo + deck + video) - **Target:** 80%+
- *LLM evaluation reliability:* Consistency of scores on duplicate submissions - **Target:** ±5 points variance

**Technical Performance:**
- *Page load time:* Homepage to interactive - **Target:** < 2 seconds
- *LLM evaluation latency:* Submission to score display - **Target:** < 30 seconds (Groq is fast!)
- *Platform uptime:* Availability during demo - **Target:** 99.9% (for 24-hour window)

**Post-Hackathon Growth (Phase 2):**
- *Monthly active builders:* Return visitors submitting to challenges - **3-month target:** 100+
- *Company sponsors:* Number of paying challenge sponsors - **3-month target:** 5+
- *Placement rate:* % of top performers who get job offers - **6-month target:** 20%+

## MVP Scope

### Core Features (Must Have for 24-Hour Demo)

**1. Challenge Catalogue**
- **Description:** Filterable, browsable list of AI product challenges with clear problem statements and evaluation rubrics
- **Implementation:** 3-5 hardcoded seed challenges (no admin creation UI needed for MVP)
- **Rationale:** Demonstrates value prop without building full CMS; sufficient for demo
- **Data structure:**
  - Challenge title, description, difficulty level
  - Problem statement (2-3 paragraphs)
  - Evaluation rubric (3-5 criteria with weights)
  - Deadline (fixed for demo purposes)
  - Sponsor company logo/name

**2. Builder Onboarding & Authentication**
- **Description:** Frictionless signup via GitHub OAuth with basic profile completion
- **Implementation:** Supabase Auth + GitHub provider
- **Flow:** Landing page → "Sign in with GitHub" → Profile form (name, bio, skills) → Challenge browse
- **Rationale:** Leverages GitHub as proof of technical credibility; minimal form friction
- **Must capture:** GitHub username, email, profile photo, optional portfolio link

**3. Submission Pipeline**
- **Description:** Form-based submission system for builders to enter their AI MVP project details
- **Implementation:** Multi-step form with validation
- **Required fields:**
  - GitHub repository URL (validated via API)
  - Pitch deck URL (Google Slides/PDF link)
  - Demo video URL (YouTube/Loom embed)
  - Written summary (500 char max)
- **Rationale:** Link-based (not file upload) reduces infrastructure complexity; aligns with real-world sharing patterns
- **Tech:** React Hook Form + Zod validation + Supabase storage for metadata

**4. Groq-Powered LLM Evaluation**
- **Description:** Automated scoring engine that evaluates submissions against challenge rubrics
- **Implementation:** Server-side API route that calls Groq API with structured prompt
- **Evaluation criteria (example for "AI Customer Support Bot" challenge):**
  - **Technical implementation** (30%): RAG quality, LLM integration, error handling
  - **User experience** (25%): UI polish, conversation flow, accessibility
  - **Business value** (20%): Problem-solution fit, scalability considerations
  - **Documentation** (15%): README quality, setup instructions, architecture explanation
  - **Innovation** (10%): Novel approach, creative features
- **Output:** Score (0-100), per-criterion breakdown, written feedback (200-300 words)
- **Rationale:** Groq's speed (<30s) enables real-time evaluation; structured rubric ensures consistency

**5. Leaderboard & Rankings**
- **Description:** Real-time leaderboard showing top submissions per challenge
- **Implementation:** Supabase query ordered by score; updates on new submissions
- **Display:**
  - Rank, builder name/photo, score, submission preview card
  - Filter by challenge
  - Click to view full submission details
- **Rationale:** Core competitive mechanic; drives engagement through social proof
- **Tech:** Server-side rendering for SEO + real-time subscriptions for live updates

**6. Professional UI (shadcn/ui)**
- **Description:** Polished, modern interface that looks production-ready
- **Implementation:** Tailwind CSS + shadcn/ui components (Button, Card, Dialog, Form, Tabs, Badge)
- **Key pages:**
  - Homepage: Value prop + CTA + featured challenges
  - Challenge browse: Grid/list view with filters
  - Challenge detail: Problem statement + leaderboard + submit CTA
  - Submission detail: Full project view + score breakdown
  - User profile: Submissions + badges (placeholder for Phase 2)
- **Rationale:** First impression matters; professional UI validates serious product

### Out of Scope for MVP (Phase 2 Features)

**Explicitly NOT building in 24 hours:**

- ❌ **Sponsor/Company Dashboard** - No challenge creation UI; seed data is hardcoded
- ❌ **Payment/Prize Integration** - No Stripe; mention prizes in copy but don't implement
- ❌ **Badge System** - Show placeholder badges in UI but don't award programmatically
- ❌ **Email Notifications** - No SendGrid/Resend integration
- ❌ **Advanced Filtering** - Basic category filter only, no multi-faceted search
- ❌ **Social Features** - No comments, likes, follows, or social sharing
- ❌ **Career Score / Seasonal Leaderboards** - Single challenge leaderboards only
- ❌ **Sandboxed Code Execution** - LLM evaluation of descriptions/docs only, not running code
- ❌ **Human Judge Interface** - Fully automated evaluation; no manual review UI
- ❌ **Company Contact/Messaging** - Show "Contact" button but don't implement chat
- ❌ **Mobile App** - Responsive web only
- ❌ **Analytics Dashboard** - No admin analytics for MVP

**Trade-off Rationale:**
- **Focus on core loop:** Browse → Submit → Score → Rank
- **Prove LLM evaluation:** This is the technical risk/innovation—must work well
- **Professional polish over feature breadth:** Better to have 6 polished features than 15 half-baked ones

### MVP Success Criteria

**"Demo-ready" means:**

✅ A visitor can land on homepage, understand value prop in <10 seconds
✅ Sign up with GitHub OAuth works smoothly
✅ View 3-5 challenges with clear problem statements and rubrics
✅ Submit a project (via links) to a challenge
✅ See Groq LLM generate a score with feedback in <30 seconds
✅ View leaderboard with ranked submissions
✅ UI looks professional (no broken styles, consistent design system)
✅ No critical bugs or errors during 5-minute walkthrough

**What "works" vs "looks good":**
- **Must work:** Auth, submission form, LLM evaluation, leaderboard
- **Can be mocked:** Multiple challenges (3 is enough), diverse submissions (seed data OK), company logos

## Technical Considerations

### Platform Requirements

**Target Platforms:**
- **Web application** (desktop-first, mobile-responsive)
- **Browsers:** Chrome/Edge (primary), Firefox, Safari (tested)
- **No mobile apps** for MVP

**Performance Requirements:**
- **Page load:** < 2s to interactive (Next.js 15 App Router with streaming)
- **LLM evaluation:** < 30s from submission to score display (Groq's speed advantage)
- **Real-time updates:** Leaderboard updates within 1s of new submission (Supabase real-time)
- **Concurrent users:** Support 50+ simultaneous users during demo (Vercel scales automatically)

**Accessibility:**
- **WCAG 2.1 Level AA** target (shadcn/ui components are accessible by default)
- **Keyboard navigation:** All interactive elements reachable via keyboard
- **Screen reader compatible:** Semantic HTML + ARIA labels where needed

### Technology Stack (Pre-Selected)

**Frontend:**
- **Framework:** Next.js 15 (App Router, React Server Components)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS 3.4+ with shadcn/ui component library
- **Form handling:** React Hook Form + Zod validation
- **State management:** React Server Components (minimize client state); Zustand for complex client state if needed
- **Icons:** Lucide React (bundled with shadcn/ui)

**Backend:**
- **API:** Next.js API Routes (Server Actions for mutations)
- **Authentication:** Supabase Auth with GitHub OAuth provider
- **Database:** Supabase (PostgreSQL)
  - **Tables:** users, challenges, submissions, evaluations, leaderboard_cache
  - **Row Level Security (RLS):** Enabled for user data protection
- **LLM Integration:** Groq API (llama-3.1-70b-versatile model recommended for evaluation quality)
- **File storage:** N/A for MVP (link-based submissions only)

**Hosting/Infrastructure:**
- **Frontend + API:** Vercel (Free tier sufficient for MVP; automatic previews + production)
- **Database:** Supabase Free tier (500MB storage, 50K monthly active users)
- **CDN:** Vercel Edge Network (automatic)
- **Monitoring:** Vercel Analytics (built-in); Supabase dashboard for DB monitoring

**Development Tools:**
- **Version control:** Git + GitHub
- **Package manager:** npm
- **Linting:** ESLint + Prettier
- **Type checking:** TypeScript compiler

### Architecture Considerations

**Repository Structure:**
```
25_Hackathon/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth routes (sign-in, callback)
│   ├── (marketing)/       # Public pages (homepage, about)
│   ├── challenges/        # Challenge browse + detail
│   ├── submit/            # Submission flow
│   ├── leaderboard/       # Rankings
│   ├── profile/           # User profiles
│   └── api/               # API routes (LLM evaluation, webhooks)
├── components/            # React components
│   ├── ui/                # shadcn/ui components
│   └── features/          # Feature-specific components
├── lib/                   # Utilities
│   ├── supabase/          # DB client + server utils
│   ├── groq/              # LLM client + prompts
│   └── utils/             # Helpers
├── types/                 # TypeScript types
└── docs/                  # Project docs (this brief, PRD, architecture)
```

**Service Architecture:**
- **Monolithic** (single Next.js app) - appropriate for MVP scale
- **Server-side rendering (SSR):** Challenge pages for SEO
- **Client-side interactivity:** Submission forms, real-time leaderboard
- **API layer:** Next.js Route Handlers for Groq integration

**Integration Requirements:**
- **Supabase ↔ Next.js:** Supabase client libraries (SSR + client-side)
- **Groq API:** REST API via `groq-sdk` npm package
- **GitHub OAuth:** Supabase Auth provider configuration

### Security & Compliance

**Authentication Security:**
- **OAuth 2.0** via GitHub (no password storage)
- **Session management:** Supabase handles JWT tokens securely
- **HTTPS only:** Enforced by Vercel

**Data Protection:**
- **Row Level Security (RLS):** Users can only modify their own submissions
- **Input validation:** Zod schemas on all forms + API routes
- **Rate limiting:** Vercel automatically rate-limits API routes (100 req/10s per IP)
- **API key security:** Environment variables for Groq API key (never exposed client-side)

**Content Security:**
- **XSS prevention:** React's built-in escaping + Content Security Policy headers
- **SQL injection:** Supabase client uses prepared statements
- **Link validation:** Validate GitHub/YouTube URLs before storing

**Compliance:**
- **No PII storage beyond email** (GDPR-friendly for MVP)
- **Terms of Service + Privacy Policy:** Placeholder pages (legal review post-MVP)

### Technical Constraints

**Hackathon-Specific:**
- **Time:** 24 hours total development time
- **Solo developer:** No team coordination overhead
- **No paid services beyond free tiers:** Supabase Free, Groq Free (rate-limited), Vercel Free

**Technology Constraints:**
- **Groq API rate limits:** 30 requests/minute on free tier → queue evaluation requests if needed
- **Supabase limits:** 500MB storage, 50K MAU (sufficient for MVP)
- **Cold start latency:** Next.js API routes may have 1-2s cold start on Vercel Free

**Known Technical Debt (Acceptable for MVP):**
- **Hardcoded challenges:** No admin UI; seed data in migrations
- **No caching layer:** Direct DB queries (optimize in Phase 2 with Redis)
- **Basic error handling:** Console logs instead of full observability (Sentry in Phase 2)
- **No test coverage:** Manual QA only (add tests post-MVP)

## Constraints & Assumptions

### Constraints

**Budget:**
- **$0 direct costs** for MVP (all free tiers)
- **Groq API:** Free tier (30 req/min, sufficient for demo)
- **Supabase:** Free tier (500MB, 50K MAU)
- **Vercel:** Hobby plan (free)
- **Post-MVP:** Budget $50-100/month for Phase 2 (paid tiers if needed)

**Timeline:**
- **24 hours total** from start to deployed demo
- **Hour breakdown estimate:**
  - Planning/setup: 2hrs
  - Auth + DB schema: 3hrs
  - Challenge UI: 3hrs
  - Submission form: 3hrs
  - LLM evaluation: 4hrs
  - Leaderboard: 2hrs
  - Polish/bug fixes: 4hrs
  - Deployment/testing: 3hrs
- **Hard deadline:** Must be demoable at end of 24-hour window

**Resources:**
- **Solo developer** (you) - no team support
- **Existing boilerplate:** Next.js 15 + Supabase + Groq already configured (saves ~4 hours)
- **No design resources:** Using shadcn/ui defaults + Tailwind utilities (no custom Figma designs)

**Technical:**
- **Must use existing stack:** Next.js 15, Supabase, Groq, shadcn/ui (non-negotiable)
- **Free tier limitations:**
  - Groq: 30 req/min → max 30 evaluations/min
  - Supabase: 500MB storage (ample for text-only data)
  - Vercel: No custom domains on free tier, 100GB bandwidth/month
- **No DevOps complexity:** Serverless-only (no Docker, no Kubernetes, no self-hosting)

### Key Assumptions

**Market Assumptions:**
- **Builders want validation:** Self-taught AI developers are actively seeking credible ways to prove skills beyond personal projects
- **Companies will sponsor:** AI-hiring companies will pay to post challenges and access top talent (validated post-MVP)
- **LLM evaluation is credible:** Employers will trust Groq-powered scoring as a signal of capability (needs validation)
- **Network effects will kick in:** Quality challenges attract builders; quality submissions attract companies

**Technical Assumptions:**
- **Groq quality is sufficient:** llama-3.1-70b-versatile can meaningfully evaluate AI product quality from GitHub README + pitch deck descriptions
- **Link-based submissions work:** Builders are comfortable sharing GitHub repos + Google Slides/YouTube links (vs. file uploads)
- **GitHub OAuth provides enough context:** GitHub profile is sufficient proof of technical credibility for builder onboarding
- **Supabase real-time scales:** Real-time leaderboard updates will work smoothly for 50+ concurrent users

**User Behavior Assumptions:**
- **Builders will submit complete projects:** Users won't abandon mid-submission despite multi-field form
- **30% submission rate is achievable:** Realistic conversion from signup to first submission (though Devpost benchmarks suggest 15% is more realistic)
- **Companies will engage with top performers:** Leaderboard winners will receive outreach from hiring partners

**Business Model Assumptions:**
- **Freemium is viable:** Free for builders, paid for companies (sponsor challenge listings)
- **Prize pools drive engagement:** Future prize offerings will increase submission quality and volume
- **Placement success creates flywheel:** Job placements from platform will drive word-of-mouth growth

## Risks & Open Questions

### Key Risks

**1. LLM Evaluation Credibility (HIGH RISK)**
- **Risk:** Employers don't trust automated LLM scoring as meaningful signal of capability
- **Impact:** Platform becomes "just another portfolio site" without competitive differentiation
- **Mitigation:**
  - Include human judge validation in Phase 2
  - Publish evaluation methodology transparently
  - Show correlation studies between LLM scores and human assessments
  - Start with lower-stakes use case (builder portfolio) before claiming hiring validity

**2. Chicken-and-Egg Marketplace (HIGH RISK)**
- **Risk:** Need builders to attract companies; need companies to attract builders
- **Impact:** Platform stalls without critical mass on either side
- **Mitigation:**
  - Seed with 3-5 high-quality challenges (even if self-created for MVP)
  - Target builders first with free value prop (portfolio showcase)
  - Manually recruit 2-3 pilot companies post-MVP for authentic challenges
  - Build in public to generate early interest

**3. 24-Hour Timeline Overrun (MEDIUM RISK)**
- **Risk:** Complex features (LLM evaluation, real-time leaderboard) take longer than estimated
- **Impact:** Incomplete demo, rushed polish, bugs during presentation
- **Mitigation:**
  - Start with LLM evaluation (highest risk) on hour 1
  - Use seed data for leaderboard if live submissions don't work
  - Have fallback: static demo video if live demo breaks
  - Cut scope aggressively if hitting hour 20 with bugs

**4. Groq API Rate Limiting (MEDIUM RISK)**
- **Risk:** Hit 30 req/min limit during demo with multiple submissions
- **Impact:** Evaluation requests fail or queue with long delays
- **Mitigation:**
  - Implement request queue with graceful degradation
  - Pre-evaluate 3-5 seed submissions to show immediate results
  - Display "Evaluating... estimated wait time" UI for queue
  - Test with multiple rapid submissions before demo

**5. Scope Creep (MEDIUM RISK)**
- **Risk:** Get distracted building "nice-to-have" features during hackathon
- **Impact:** Core features incomplete; MVP doesn't demonstrate value prop
- **Mitigation:**
  - Stick ruthlessly to approved MVP scope (this brief as contract)
  - Set hourly check-ins against time budget
  - Kill any feature taking >1 hour longer than estimated

**6. Poor LLM Evaluation Quality (LOW-MEDIUM RISK)**
- **Risk:** Groq generates generic/unhelpful feedback or inconsistent scores
- **Impact:** Platform feels like a gimmick; doesn't add value over human review
- **Mitigation:**
  - Invest 2+ hours in prompt engineering with test cases
  - Use structured output with clear rubric criteria
  - Show evaluation breakdown (not just score) for transparency
  - Add "Request re-evaluation" feature if score seems off

### Open Questions

**Product Questions:**
- **What makes a "good" challenge?** What level of complexity, time expectation, and problem framing works best?
- **How much detail in rubrics?** Too specific = limits creativity; too vague = inconsistent scoring
- **Should submissions be public?** Visibility drives engagement but may deter some builders (IP concerns)
- **Leaderboard timeframes:** Per-challenge? All-time? Monthly seasons?

**Technical Questions:**
- **Optimal LLM model:** Is llama-3.1-70b best, or should we test mixtral-8x7b for cost/speed?
- **Evaluation prompt structure:** Chain-of-thought reasoning? Structured JSON output? Natural language?
- **Real-time implementation:** Supabase real-time vs. polling vs. Server-Sent Events?
- **Database schema:** How to structure submissions for efficient leaderboard queries?

**Business Questions:**
- **Pricing model:** Per-challenge listing? Monthly subscription? Commission on hires?
- **Prize structure:** Who funds prizes? Platform, sponsors, or hybrid?
- **Legal considerations:** IP ownership of submissions? Terms of service for evaluations?
- **Moderation:** How to handle spam submissions or gaming the LLM scoring?

**User Research Needed:**
- **Builder willingness:** Will self-taught devs actually invest time in building full MVPs for challenges?
- **Employer trust:** What evidence would hiring managers need to trust LLM-scored portfolios?
- **Competitive intelligence:** How do existing platforms (Kaggle, Devpost) handle similar challenges?
- **Feature priorities:** Which Phase 2 features would drive most engagement (badges? prizes? messaging)?

### Areas Needing Further Research

**LLM Evaluation Best Practices:**
- Academic research on automated code/project assessment
- Prompt engineering techniques for consistent scoring
- Benchmark datasets for AI product evaluation

**Marketplace Growth Strategies:**
- Case studies: How Upwork, Toptal, Triplebyte scaled two-sided talent marketplaces
- Community building tactics from successful developer platforms
- Virality loops that worked for Product Hunt, Indie Hackers

**Technical Feasibility:**
- Groq API stability and rate limit behavior under load
- Supabase real-time performance with 100+ concurrent users
- GitHub API rate limits for profile/repo validation

**Regulatory/Legal:**
- Employment law implications of algorithmic hiring assessments
- GDPR/privacy considerations for builder profiles
- Terms of service templates for competitive platforms

## Next Steps

### Immediate Actions

1. **Review and approve this Project Brief** - Ensure all stakeholders (you) agree with scope and priorities
2. **Transition to PM for PRD creation** - Hand off this brief to PM agent for detailed requirements
3. **Begin technical setup** - Initialize Supabase database schema while PM works on PRD
4. **Design evaluation rubrics** - Draft 3-5 challenge rubrics with weighted criteria for LLM prompts

### PM Handoff

This Project Brief provides the full context for **BuildAI Arena**. Please start in 'PRD Generation Mode', review the brief thoroughly to work with the user to create the PRD section by section as the template indicates, asking for any necessary clarification or suggesting improvements.

**Key items for PM to elaborate:**
- **Detailed user stories** for each of the 6 core MVP features
- **Database schema** with tables, relationships, and RLS policies
- **API contracts** for LLM evaluation endpoints
- **UI/UX specifications** for key user flows (onboarding, submission, leaderboard)
- **Acceptance criteria** for each feature to define "done"
- **Non-functional requirements** (performance, security, accessibility)

**Critical for PRD:**
- **LLM evaluation rubric templates** - The PM should define exact rubric structures for 3-5 seed challenges
- **Groq prompt engineering specs** - How to structure prompts for consistent, quality evaluation
- **Real-time leaderboard tech spec** - Supabase subscriptions vs. polling implementation details

---

**🎉 Project Brief Complete!**

This brief is ready for handoff to the PM agent to create the detailed Product Requirements Document (PRD).

