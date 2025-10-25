-- Row Level Security (RLS) Policies for BuildAI Arena
-- Run this in Supabase SQL Editor after creating tables

-- ============================================
-- ENABLE RLS ON ALL TABLES
-- ============================================

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

-- For MVP: Allow service role to insert challenges (we'll seed manually)
-- In production, add role-based access control
CREATE POLICY "Service role can insert challenges"
  ON challenges FOR INSERT
  WITH CHECK (true); -- Will use service role key from API

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
  USING (auth.uid()::text = user_id::text AND status IN ('pending', 'evaluating'));

-- ============================================
-- EVALUATIONS POLICIES
-- ============================================

-- Anyone can view evaluation results (for leaderboards)
CREATE POLICY "Evaluations are viewable by everyone"
  ON evaluations FOR SELECT
  USING (true);

-- For MVP: Allow service role to insert evaluations (via API route)
CREATE POLICY "Service role can insert evaluations"
  ON evaluations FOR INSERT
  WITH CHECK (true); -- Will use service role key from API

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
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_users_github_id ON users(github_id);
CREATE INDEX IF NOT EXISTS idx_challenges_difficulty ON challenges(difficulty);
CREATE INDEX IF NOT EXISTS idx_challenges_deadline ON challenges(deadline);
CREATE INDEX IF NOT EXISTS idx_submissions_challenge_id ON submissions(challenge_id);
CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
CREATE INDEX IF NOT EXISTS idx_evaluations_submission_id ON evaluations(submission_id);

-- ============================================
-- COMPLETE
-- ============================================
-- RLS policies, views, and indexes are now set up!
