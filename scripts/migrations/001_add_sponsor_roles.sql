-- Migration 001: Add Sponsor Roles and Company Profile Fields
-- Run this in Supabase SQL Editor

-- ============================================
-- 1. ADD ROLE AND COMPANY FIELDS TO USERS
-- ============================================

-- Add role column (builder, sponsor, admin)
ALTER TABLE users
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'builder' CHECK (role IN ('builder', 'sponsor', 'admin'));

-- Add company profile fields for sponsors
ALTER TABLE users
ADD COLUMN IF NOT EXISTS company_name TEXT,
ADD COLUMN IF NOT EXISTS company_logo_url TEXT,
ADD COLUMN IF NOT EXISTS company_website TEXT;

-- Create index for faster role-based queries
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- ============================================
-- 2. UPDATE CHALLENGES TABLE
-- ============================================

-- Add creator tracking
ALTER TABLE challenges
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES users(id) ON DELETE SET NULL;

-- Add prize information
ALTER TABLE challenges
ADD COLUMN IF NOT EXISTS prize_amount INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS prize_currency TEXT DEFAULT 'USD',
ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_challenges_created_by ON challenges(created_by);
CREATE INDEX IF NOT EXISTS idx_challenges_is_published ON challenges(is_published);

-- ============================================
-- 3. UPDATE RLS POLICIES FOR CHALLENGES
-- ============================================

-- Drop old policies
DROP POLICY IF EXISTS "Only admins can insert challenges" ON challenges;

-- Sponsors can create challenges
CREATE POLICY "Sponsors can create challenges"
  ON challenges FOR INSERT
  WITH CHECK (
    auth.uid()::text = created_by::text
    AND (SELECT role FROM users WHERE id = auth.uid()) = 'sponsor'
  );

-- Sponsors can update their own challenges
CREATE POLICY "Sponsors can update own challenges"
  ON challenges FOR UPDATE
  USING (auth.uid()::text = created_by::text);

-- Sponsors can delete their own challenges
CREATE POLICY "Sponsors can delete own challenges"
  ON challenges FOR DELETE
  USING (auth.uid()::text = created_by::text);

-- Everyone can view published challenges
DROP POLICY IF EXISTS "Challenges are viewable by everyone" ON challenges;
CREATE POLICY "Published challenges are viewable by everyone"
  ON challenges FOR SELECT
  USING (is_published = true OR created_by = auth.uid());

-- ============================================
-- 4. UPDATE EXISTING DATA
-- ============================================

-- Set existing challenges as published
UPDATE challenges SET is_published = true WHERE is_published IS NULL;

-- ============================================
-- MIGRATION COMPLETE
-- ============================================
-- Next: Run 002_add_manual_reviews.sql
