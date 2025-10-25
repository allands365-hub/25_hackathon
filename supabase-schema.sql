-- BuildAI Arena Database Schema
-- Database: hackathon
-- Generated for 24-hour hackathon MVP

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE
-- ============================================
-- Stores user profiles synced from GitHub OAuth
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  github_id TEXT UNIQUE NOT NULL,
  username TEXT NOT NULL,
  email TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster GitHub ID lookups
CREATE INDEX IF NOT EXISTS idx_users_github_id ON users(github_id);

-- ============================================
-- CHALLENGES TABLE
-- ============================================
-- Stores AI product challenges posted by companies
CREATE TABLE IF NOT EXISTS challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  problem_statement TEXT NOT NULL,
  rubric JSONB NOT NULL, -- JSON structure: { "criteria": [{ "name": "Technical Implementation", "weight": 30, "description": "..." }] }
  difficulty TEXT CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')) DEFAULT 'Intermediate',
  deadline TIMESTAMPTZ,
  sponsor_name TEXT,
  sponsor_logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for filtering by difficulty
CREATE INDEX IF NOT EXISTS idx_challenges_difficulty ON challenges(difficulty);

-- Index for sorting by deadline
CREATE INDEX IF NOT EXISTS idx_challenges_deadline ON challenges(deadline);

-- ============================================
-- SUBMISSIONS TABLE
-- ============================================
-- Stores builder project submissions to challenges
CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  repo_url TEXT NOT NULL,
  deck_url TEXT,
  video_url TEXT,
  summary TEXT NOT NULL,
  status TEXT CHECK (status IN ('pending', 'evaluating', 'evaluated', 'failed')) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Prevent duplicate submissions from same user to same challenge
  UNIQUE(challenge_id, user_id)
);

-- Index for fetching submissions by challenge (for leaderboard)
CREATE INDEX IF NOT EXISTS idx_submissions_challenge_id ON submissions(challenge_id);

-- Index for fetching submissions by user (for profile)
CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON submissions(user_id);

-- Index for filtering by status
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);

-- ============================================
-- EVALUATIONS TABLE
-- ============================================
-- Stores Groq LLM evaluation results for submissions
CREATE TABLE IF NOT EXISTS evaluations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submission_id UUID UNIQUE NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  criterion_scores JSONB NOT NULL, -- JSON structure: { "Technical Implementation": 85, "Innovation": 90, ... }
  feedback TEXT NOT NULL,
  evaluated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for joining evaluations with submissions
CREATE INDEX IF NOT EXISTS idx_evaluations_submission_id ON evaluations(submission_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;

-- ============================================
-- USERS POLICIES
-- ============================================

-- Anyone can view user profiles (for leaderboards, submissions)
CREATE POLICY "Users are viewable by everyone"
  ON users FOR SELECT
  USING (true);

-- Users can insert their own profile (on first login)
CREATE POLICY "Users can insert their own profile"
  ON users FOR INSERT
  WITH CHECK (auth.uid()::text = id::text);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (auth.uid()::text = id::text);

-- ============================================
-- CHALLENGES POLICIES
-- ============================================

-- Anyone can view challenges (public catalog)
CREATE POLICY "Challenges are viewable by everyone"
  ON challenges FOR SELECT
  USING (true);

-- Only admins can create challenges (for MVP, we'll seed manually)
-- Note: In production, add auth.jwt() -> role = 'admin' check
CREATE POLICY "Only admins can insert challenges"
  ON challenges FOR INSERT
  WITH CHECK (false); -- Disabled for MVP (manual seeding only)

-- ============================================
-- SUBMISSIONS POLICIES
-- ============================================

-- Anyone can view submissions (for leaderboards)
CREATE POLICY "Submissions are viewable by everyone"
  ON submissions FOR SELECT
  USING (true);

-- Authenticated users can submit to challenges
CREATE POLICY "Users can insert their own submissions"
  ON submissions FOR INSERT
  WITH CHECK (auth.uid()::text = user_id::text);

-- Users can update their own submissions (only if not evaluated yet)
CREATE POLICY "Users can update their own pending submissions"
  ON submissions FOR UPDATE
  USING (auth.uid()::text = user_id::text AND status = 'pending');

-- ============================================
-- EVALUATIONS POLICIES
-- ============================================

-- Anyone can view evaluation results (for leaderboards)
CREATE POLICY "Evaluations are viewable by everyone"
  ON evaluations FOR SELECT
  USING (true);

-- Only system/API can insert evaluations (via service role)
CREATE POLICY "Only service role can insert evaluations"
  ON evaluations FOR INSERT
  WITH CHECK (false); -- API routes will use service role key

-- ============================================
-- HELPER VIEWS
-- ============================================

-- Leaderboard view: joins submissions with evaluations and user info
CREATE OR REPLACE VIEW leaderboard AS
SELECT
  s.id AS submission_id,
  s.challenge_id,
  s.user_id,
  u.username,
  u.avatar_url,
  s.repo_url,
  s.deck_url,
  s.video_url,
  s.summary,
  s.created_at AS submitted_at,
  e.score,
  e.criterion_scores,
  e.feedback,
  e.evaluated_at,
  ROW_NUMBER() OVER (PARTITION BY s.challenge_id ORDER BY e.score DESC, e.evaluated_at ASC) AS rank
FROM submissions s
INNER JOIN evaluations e ON s.id = e.submission_id
INNER JOIN users u ON s.user_id = u.id
WHERE s.status = 'evaluated'
ORDER BY s.challenge_id, rank;

-- Grant access to leaderboard view
GRANT SELECT ON leaderboard TO anon, authenticated;

-- ============================================
-- SEED DATA (for MVP testing)
-- ============================================

-- Note: Actual seed data will be inserted via separate script
-- This section documents the seed data structure

-- Example challenge seed:
-- INSERT INTO challenges (title, description, problem_statement, rubric, difficulty, deadline, sponsor_name)
-- VALUES (
--   'AI-Powered Customer Support Bot',
--   'Build an intelligent customer support chatbot using LLMs',
--   'Companies waste millions on repetitive customer support queries...',
--   '{"criteria": [{"name": "Technical Implementation", "weight": 30, "description": "Code quality, architecture, and scalability"}]}',
--   'Intermediate',
--   NOW() + INTERVAL '30 days',
--   'Acme Corp'
-- );

-- ============================================
-- MAINTENANCE & OPTIMIZATION
-- ============================================

-- Vacuum analyze for query optimization
ANALYZE users;
ANALYZE challenges;
ANALYZE submissions;
ANALYZE evaluations;

-- ============================================
-- SCHEMA COMPLETE
-- ============================================
-- Run this script in your Supabase SQL Editor to create all tables, indexes, RLS policies, and views.
-- Total tables: 4 (users, challenges, submissions, evaluations)
-- Total indexes: 7 (optimized for common queries)
-- Total policies: 9 (secure RLS for all operations)
-- Total views: 1 (leaderboard with rankings)
