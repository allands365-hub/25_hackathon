# Sponsor Features Architecture

## Overview
Add sponsor/company functionality to transform BuildAI Arena into a true two-sided marketplace.

---

## Database Schema Changes

### 1. Update `users` table
```sql
ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'builder' CHECK (role IN ('builder', 'sponsor', 'admin'));
ALTER TABLE users ADD COLUMN company_name TEXT;
ALTER TABLE users ADD COLUMN company_logo_url TEXT;
ALTER TABLE users ADD COLUMN company_website TEXT;
CREATE INDEX idx_users_role ON users(role);
```

### 2. Update `challenges` table
```sql
ALTER TABLE challenges ADD COLUMN created_by UUID REFERENCES users(id);
ALTER TABLE challenges ADD COLUMN prize_amount INTEGER DEFAULT 0;
ALTER TABLE challenges ADD COLUMN prize_currency TEXT DEFAULT 'USD';
ALTER TABLE challenges ADD COLUMN is_published BOOLEAN DEFAULT false;
CREATE INDEX idx_challenges_created_by ON challenges(created_by);
```

### 3. Create `manual_reviews` table
```sql
CREATE TABLE manual_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES users(id),
  score INTEGER CHECK (score >= 0 AND score <= 100),
  criterion_scores JSONB NOT NULL,
  feedback TEXT NOT NULL,
  reviewed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(submission_id, reviewer_id)
);

CREATE INDEX idx_manual_reviews_submission_id ON manual_reviews(submission_id);
CREATE INDEX idx_manual_reviews_reviewer_id ON manual_reviews(reviewer_id);
```

### 4. Create `final_scores` view
```sql
CREATE OR REPLACE VIEW final_scores AS
SELECT
  s.id AS submission_id,
  s.challenge_id,
  s.user_id,
  e.score AS llm_score,
  AVG(mr.score)::INTEGER AS human_score,
  CASE
    WHEN COUNT(mr.id) > 0
    THEN ((e.score * 0.5) + (AVG(mr.score) * 0.5))::INTEGER
    ELSE e.score
  END AS final_score
FROM submissions s
LEFT JOIN evaluations e ON s.id = e.submission_id
LEFT JOIN manual_reviews mr ON s.id = mr.submission_id
GROUP BY s.id, s.challenge_id, s.user_id, e.score;
```

---

## Route Structure

```
app/
├── sponsor/
│   ├── layout.tsx                    # Sponsor-only layout with navigation
│   ├── page.tsx                      # Dashboard overview
│   ├── challenges/
│   │   ├── page.tsx                  # List of sponsor's challenges
│   │   ├── new/
│   │   │   └── page.tsx              # Create new challenge
│   │   └── [id]/
│   │       ├── page.tsx              # Challenge detail & edit
│   │       ├── submissions/
│   │       │   └── page.tsx          # View all submissions
│   │       └── review/
│   │           └── [submissionId]/
│   │               └── page.tsx      # Review single submission
│   └── settings/
│       └── page.tsx                  # Company profile settings
└── api/
    ├── challenges/
    │   ├── route.ts                  # POST create challenge
    │   └── [id]/
    │       └── route.ts              # PUT/DELETE update challenge
    ├── manual-review/
    │   └── route.ts                  # POST submit manual review
    └── download/
        └── candidate-packet/
            └── [submissionId]/
                └── route.ts          # GET download candidate data
```

---

## Component Architecture

### New Components

1. **SponsorNav.tsx** - Sponsor dashboard navigation
2. **ChallengeForm.tsx** - Create/edit challenge form
3. **SubmissionReviewCard.tsx** - Display submission for review
4. **ManualScoreForm.tsx** - Manual scoring interface
5. **CandidatePacket.tsx** - Candidate info display
6. **SponsorStats.tsx** - Dashboard statistics

---

## Authentication Flow Changes

### Role Selection on Signup
```
1. User signs in with GitHub
2. Callback redirects to /onboarding
3. User selects role: "Builder" or "Sponsor"
4. If Sponsor:
   - Collect company name, logo, website
   - Set role = 'sponsor'
5. Redirect to appropriate dashboard
```

### Middleware Protection
```typescript
// Protect sponsor routes
if (pathname.startsWith('/sponsor')) {
  if (!user || user.role !== 'sponsor') {
    return NextResponse.redirect('/challenges')
  }
}
```

---

## Features Breakdown

### Phase 1: Foundation (Priority 1)
- [ ] Database migrations
- [ ] Role-based authentication
- [ ] Sponsor onboarding flow
- [ ] Basic sponsor dashboard
- [ ] Middleware protection

### Phase 2: Challenge Management (Priority 2)
- [ ] Create challenge form
- [ ] Edit challenge
- [ ] Publish/unpublish toggle
- [ ] Prize management
- [ ] View challenge submissions list

### Phase 3: Review System (Priority 3)
- [ ] Manual review interface
- [ ] Criterion-by-criterion scoring
- [ ] Final score calculation (hybrid)
- [ ] Review submission history

### Phase 4: Hiring Tools (Priority 4)
- [ ] Candidate packet download (PDF)
- [ ] Contact builder action
- [ ] Shortlist/favorite submissions
- [ ] Bulk export

---

## UI/UX Patterns

### Sponsor Dashboard Layout
```
+------------------------------------------+
| BuildAI Arena | [Dashboard] [Challenges] |
+------------------------------------------+
| Overview                                 |
| - Active Challenges: 3                   |
| - Total Submissions: 47                  |
| - Reviewed: 12 / 47                      |
+------------------------------------------+
| Recent Submissions                       |
| [Submission Card] [Submission Card]      |
+------------------------------------------+
```

### Challenge Creation Flow
```
Step 1: Basic Info
  - Title
  - Description
  - Difficulty
  - Deadline

Step 2: Problem Statement
  - Detailed requirements
  - Success criteria

Step 3: Evaluation Rubric
  - Add criteria
  - Set weights (must sum to 100%)

Step 4: Prize & Publishing
  - Prize amount
  - Publish immediately or draft
```

### Manual Review Interface
```
+------------------------------------------+
| Submission: [Project Name]               |
| Builder: @username                       |
+------------------------------------------+
| LLM Score: 85/100                        |
+------------------------------------------+
| [Repo] [Deck] [Video]                    |
| Summary: ...                             |
+------------------------------------------+
| Your Review:                             |
| Technical Implementation: [____] / 100   |
| User Experience: [____] / 100            |
| Innovation: [____] / 100                 |
| Production Readiness: [____] / 100       |
| Problem Solving: [____] / 100            |
|                                          |
| Feedback: [textarea]                     |
|                                          |
| Final Score: 87/100 (calculated)         |
| [Submit Review]                          |
+------------------------------------------+
```

---

## API Endpoints

### POST /api/challenges
```typescript
{
  title: string;
  description: string;
  problem_statement: string;
  rubric: { criteria: Array<{name, weight, description}> };
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  deadline: Date;
  prize_amount?: number;
  is_published: boolean;
}
```

### POST /api/manual-review
```typescript
{
  submission_id: string;
  criterion_scores: Record<string, number>;
  feedback: string;
}
```

### GET /api/download/candidate-packet/[submissionId]
```typescript
// Returns JSON with builder profile + submission data
{
  builder: {
    username, email, github_id, avatar_url, bio
  },
  submission: {
    repo_url, deck_url, video_url, summary
  },
  scores: {
    llm_score, human_score, final_score, criterion_breakdown
  }
}
```

---

## Security Considerations

### RLS Policies
```sql
-- Sponsors can create challenges
CREATE POLICY "Sponsors can create challenges"
  ON challenges FOR INSERT
  WITH CHECK (auth.uid()::text = created_by::text AND (
    SELECT role FROM users WHERE id = auth.uid()
  ) = 'sponsor');

-- Sponsors can only edit their own challenges
CREATE POLICY "Sponsors can update own challenges"
  ON challenges FOR UPDATE
  USING (auth.uid()::text = created_by::text);

-- Sponsors can view all submissions to their challenges
CREATE POLICY "Sponsors can view submissions to their challenges"
  ON submissions FOR SELECT
  USING (challenge_id IN (
    SELECT id FROM challenges WHERE created_by = auth.uid()
  ));
```

---

## Migration Strategy

### Migration 1: Add sponsor roles
```sql
-- 001_add_sponsor_roles.sql
ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'builder';
ALTER TABLE users ADD COLUMN company_name TEXT;
-- ... rest of schema changes
```

### Migration 2: Add manual reviews
```sql
-- 002_add_manual_reviews.sql
CREATE TABLE manual_reviews (...);
CREATE VIEW final_scores AS ...;
```

---

## Success Metrics

After implementation, we should be able to:
- ✅ Sponsor can sign up and create company profile
- ✅ Sponsor can create/edit/publish challenges
- ✅ Sponsor can view all submissions to their challenges
- ✅ Sponsor can manually review submissions with scores
- ✅ Final leaderboard shows hybrid scores (50% LLM + 50% Human)
- ✅ Sponsor can download candidate packets
- ✅ Builders see challenges from multiple sponsors

---

## Timeline Estimate

- **Phase 1 (Foundation):** 4-6 hours
- **Phase 2 (Challenge Mgmt):** 6-8 hours
- **Phase 3 (Review System):** 4-6 hours
- **Phase 4 (Hiring Tools):** 2-4 hours

**Total: 16-24 hours** for full sponsor feature set.

---

## Next Steps

1. Create database migration files
2. Update user schema and RLS policies
3. Build onboarding flow for role selection
4. Create sponsor dashboard skeleton
5. Implement challenge creation form
6. Build manual review interface
7. Add candidate packet download
8. Test end-to-end sponsor flow
