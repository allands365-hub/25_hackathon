-- Migration 002: Add Manual Review System
-- Run this in Supabase SQL Editor AFTER 001_add_sponsor_roles.sql

-- ============================================
-- 1. CREATE MANUAL_REVIEWS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS manual_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  score INTEGER CHECK (score >= 0 AND score <= 100),
  criterion_scores JSONB NOT NULL,
  feedback TEXT NOT NULL,
  reviewed_at TIMESTAMPTZ DEFAULT NOW(),

  -- One review per reviewer per submission
  UNIQUE(submission_id, reviewer_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_manual_reviews_submission_id ON manual_reviews(submission_id);
CREATE INDEX IF NOT EXISTS idx_manual_reviews_reviewer_id ON manual_reviews(reviewer_id);

-- ============================================
-- 2. CREATE FINAL_SCORES VIEW
-- ============================================

-- Drop existing view if it exists
DROP VIEW IF EXISTS final_scores;

-- Hybrid scoring: 50% LLM + 50% Human average
CREATE VIEW final_scores AS
SELECT
  s.id AS submission_id,
  s.challenge_id,
  s.user_id,
  e.score AS llm_score,
  ROUND(AVG(mr.score))::INTEGER AS human_score,
  COUNT(mr.id) AS review_count,
  CASE
    -- If human reviews exist, blend with LLM
    WHEN COUNT(mr.id) > 0
    THEN ROUND((e.score * 0.5) + (AVG(mr.score) * 0.5))::INTEGER
    -- Otherwise, use LLM score only
    ELSE e.score
  END AS final_score
FROM submissions s
LEFT JOIN evaluations e ON s.id = e.submission_id
LEFT JOIN manual_reviews mr ON s.id = mr.submission_id
GROUP BY s.id, s.challenge_id, s.user_id, e.score;

-- Grant access to final_scores view
GRANT SELECT ON final_scores TO anon, authenticated;

-- ============================================
-- 3. UPDATE LEADERBOARD VIEW
-- ============================================

-- Drop old leaderboard view
DROP VIEW IF EXISTS leaderboard;

-- New leaderboard using final scores
CREATE VIEW leaderboard AS
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
  fs.llm_score,
  fs.human_score,
  fs.review_count,
  fs.final_score AS score,
  e.criterion_scores,
  e.feedback,
  e.evaluated_at,
  ROW_NUMBER() OVER (PARTITION BY s.challenge_id ORDER BY fs.final_score DESC, e.evaluated_at ASC) AS rank
FROM submissions s
INNER JOIN final_scores fs ON s.id = fs.submission_id
INNER JOIN evaluations e ON s.id = e.submission_id
INNER JOIN users u ON s.user_id = u.id
WHERE s.status = 'evaluated'
ORDER BY s.challenge_id, rank;

-- Grant access to updated leaderboard view
GRANT SELECT ON leaderboard TO anon, authenticated;

-- ============================================
-- 4. RLS POLICIES FOR MANUAL_REVIEWS
-- ============================================

-- Enable RLS
ALTER TABLE manual_reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can view reviews (for transparency)
CREATE POLICY "Reviews are viewable by everyone"
  ON manual_reviews FOR SELECT
  USING (true);

-- Only sponsors can submit reviews for their own challenges
CREATE POLICY "Sponsors can review submissions to their challenges"
  ON manual_reviews FOR INSERT
  WITH CHECK (
    auth.uid()::text = reviewer_id::text
    AND (SELECT role FROM users WHERE id = auth.uid()) = 'sponsor'
    AND EXISTS (
      SELECT 1 FROM submissions s
      JOIN challenges c ON s.challenge_id = c.id
      WHERE s.id = submission_id
      AND c.created_by = auth.uid()
    )
  );

-- Sponsors can update their own reviews
CREATE POLICY "Sponsors can update own reviews"
  ON manual_reviews FOR UPDATE
  USING (auth.uid()::text = reviewer_id::text);

-- Sponsors can delete their own reviews
CREATE POLICY "Sponsors can delete own reviews"
  ON manual_reviews FOR DELETE
  USING (auth.uid()::text = reviewer_id::text);

-- ============================================
-- 5. UPDATE SUBMISSIONS RLS
-- ============================================

-- Sponsors can view submissions to their challenges
CREATE POLICY "Sponsors can view submissions to their challenges"
  ON submissions FOR SELECT
  USING (
    -- Public access OR owner OR sponsor of challenge
    true OR
    auth.uid()::text = user_id::text OR
    challenge_id IN (
      SELECT id FROM challenges WHERE created_by = auth.uid()
    )
  );

-- ============================================
-- MIGRATION COMPLETE
-- ============================================
-- Hybrid scoring is now active!
-- Final Score = 50% LLM + 50% Human (if reviews exist)
