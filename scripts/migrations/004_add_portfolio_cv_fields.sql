-- Add portfolio and CV fields to users table
-- Migration: 004_add_portfolio_cv_fields.sql

-- Add portfolio and CV related fields
ALTER TABLE users
ADD COLUMN IF NOT EXISTS portfolio_url TEXT,
ADD COLUMN IF NOT EXISTS cv_url TEXT,
ADD COLUMN IF NOT EXISTS skills TEXT[],
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS website_url TEXT,
ADD COLUMN IF NOT EXISTS twitter_url TEXT,
ADD COLUMN IF NOT EXISTS experience_years INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS availability_status TEXT DEFAULT 'available' CHECK (availability_status IN ('available', 'busy', 'not_looking'));

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_skills ON users USING GIN(skills);
CREATE INDEX IF NOT EXISTS idx_users_location ON users(location);
CREATE INDEX IF NOT EXISTS idx_users_availability ON users(availability_status);

-- Add comments for documentation
COMMENT ON COLUMN users.portfolio_url IS 'URL to the user''s portfolio website or GitHub Pages';
COMMENT ON COLUMN users.cv_url IS 'URL to the user''s CV/resume (e.g., Google Drive, Dropbox, personal website)';
COMMENT ON COLUMN users.skills IS 'Array of technical skills and technologies';
COMMENT ON COLUMN users.location IS 'User''s location (city, country)';
COMMENT ON COLUMN users.website_url IS 'Personal or professional website URL';
COMMENT ON COLUMN users.twitter_url IS 'Twitter/X profile URL';
COMMENT ON COLUMN users.experience_years IS 'Years of professional experience';
COMMENT ON COLUMN users.availability_status IS 'Current availability for opportunities';
