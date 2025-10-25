-- Row Level Security (RLS) Policies ONLY
-- Run this if tables already exist

-- ============================================
-- ENABLE RLS ON ALL TABLES
-- ============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;

-- ============================================
-- DROP EXISTING POLICIES (if any)
-- ============================================

DROP POLICY IF EXISTS "Users are viewable by everyone" ON users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;

DROP POLICY IF EXISTS "Challenges are viewable by everyone" ON challenges;
DROP POLICY IF EXISTS "Service role can insert challenges" ON challenges;

DROP POLICY IF EXISTS "Submissions are viewable by everyone" ON submissions;
DROP POLICY IF EXISTS "Users can insert their own submissions" ON submissions;
DROP POLICY IF EXISTS "Users can update their own pending submissions" ON submissions;

DROP POLICY IF EXISTS "Evaluations are viewable by everyone" ON evaluations;
DROP POLICY IF EXISTS "Service role can insert evaluations" ON evaluations;

-- ============================================
-- USERS POLICIES
-- ============================================

CREATE POLICY "Users are viewable by everyone"
  ON users FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON users FOR INSERT
  WITH CHECK (auth.uid()::text = id::text);

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (auth.uid()::text = id::text);

-- ============================================
-- CHALLENGES POLICIES
-- ============================================

CREATE POLICY "Challenges are viewable by everyone"
  ON challenges FOR SELECT
  USING (true);

CREATE POLICY "Service role can insert challenges"
  ON challenges FOR INSERT
  WITH CHECK (true);

-- ============================================
-- SUBMISSIONS POLICIES
-- ============================================

CREATE POLICY "Submissions are viewable by everyone"
  ON submissions FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own submissions"
  ON submissions FOR INSERT
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own pending submissions"
  ON submissions FOR UPDATE
  USING (auth.uid()::text = user_id::text AND status IN ('pending', 'evaluating'));

-- ============================================
-- EVALUATIONS POLICIES
-- ============================================

CREATE POLICY "Evaluations are viewable by everyone"
  ON evaluations FOR SELECT
  USING (true);

CREATE POLICY "Service role can insert evaluations"
  ON evaluations FOR INSERT
  WITH CHECK (true);

-- ============================================
-- HELPER VIEWS
-- ============================================

-- Drop existing view if it exists
DROP VIEW IF EXISTS leaderboard;

-- Leaderboard view
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

-- Grant access
GRANT SELECT ON leaderboard TO anon, authenticated;

-- ============================================
-- COMPLETE
-- ============================================
