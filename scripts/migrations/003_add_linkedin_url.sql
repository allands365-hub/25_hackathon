-- Add LinkedIn profile URL field to users table
-- This allows users to add their LinkedIn profile link for networking

ALTER TABLE users
ADD COLUMN IF NOT EXISTS linkedin_url TEXT;

-- Add index for better query performance (optional)
CREATE INDEX IF NOT EXISTS idx_users_linkedin ON users(linkedin_url) WHERE linkedin_url IS NOT NULL;

-- Add comment to explain the field
COMMENT ON COLUMN users.linkedin_url IS 'LinkedIn profile URL for networking and recruiter discovery';

