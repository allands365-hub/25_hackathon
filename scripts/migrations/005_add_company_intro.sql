-- Add company_intro field to users table
-- Migration: 005_add_company_intro.sql

ALTER TABLE users
ADD COLUMN IF NOT EXISTS company_intro TEXT;

-- Add a comment for documentation
COMMENT ON COLUMN users.company_intro IS 'Brief introduction about the company that will be visible on challenge pages';
