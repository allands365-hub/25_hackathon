# Database Migrations for Sponsor Features

## Overview
These migrations add sponsor functionality to BuildAI Arena, enabling a two-sided marketplace.

## Prerequisites
- Supabase project with existing schema
- Environment variables configured in `.env.local`:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`

## Migration Files

### 001_add_sponsor_roles.sql
Adds:
- User roles (builder, sponsor, admin)
- Company profile fields
- Challenge creator tracking
- Prize management
- RLS policies for sponsor-created challenges

### 002_add_manual_reviews.sql
Adds:
- Manual review system
- Hybrid scoring (50% LLM + 50% Human)
- Final scores view
- Updated leaderboard with hybrid scores

## How to Run Migrations

### Option 1: Automated Script (Recommended)
```bash
cd 25_Hackathon
node scripts/run-migrations.js
```

### Option 2: Manual Execution
1. Open Supabase Dashboard → SQL Editor
2. Copy contents of `001_add_sponsor_roles.sql`
3. Click "Run"
4. Copy contents of `002_add_manual_reviews.sql`
5. Click "Run"

### Option 3: Supabase CLI
```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Run migrations
supabase db push
```

## Verification

After running migrations, verify in Supabase:

### 1. Check Users Table
```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'users';
```

Should see: `role`, `company_name`, `company_logo_url`, `company_website`

### 2. Check Challenges Table
```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'challenges';
```

Should see: `created_by`, `prize_amount`, `prize_currency`, `is_published`

### 3. Check Manual Reviews Table
```sql
SELECT * FROM manual_reviews LIMIT 1;
```

Should exist (may be empty)

### 4. Check Final Scores View
```sql
SELECT * FROM final_scores LIMIT 1;
```

Should exist and show hybrid scoring

## Testing

### Create Test Sponsor
```sql
-- Update an existing user to sponsor role
UPDATE users
SET
  role = 'sponsor',
  company_name = 'Test Company',
  company_website = 'https://test.com'
WHERE username = 'your_username';
```

### Create Test Challenge
```sql
INSERT INTO challenges (
  title,
  description,
  problem_statement,
  rubric,
  difficulty,
  deadline,
  created_by,
  prize_amount,
  is_published
) VALUES (
  'Test Sponsor Challenge',
  'Test description',
  'Test problem statement',
  '{"criteria": [{"name": "Test", "weight": 100, "description": "Test criterion"}]}',
  'Intermediate',
  NOW() + INTERVAL '30 days',
  (SELECT id FROM users WHERE role = 'sponsor' LIMIT 1),
  1000,
  true
);
```

## Rollback

If you need to undo these migrations:

```sql
-- Drop new objects
DROP VIEW IF EXISTS leaderboard CASCADE;
DROP VIEW IF EXISTS final_scores CASCADE;
DROP TABLE IF EXISTS manual_reviews CASCADE;

-- Remove new columns
ALTER TABLE challenges
  DROP COLUMN IF EXISTS created_by,
  DROP COLUMN IF EXISTS prize_amount,
  DROP COLUMN IF EXISTS prize_currency,
  DROP COLUMN IF EXISTS is_published;

ALTER TABLE users
  DROP COLUMN IF EXISTS role,
  DROP COLUMN IF EXISTS company_name,
  DROP COLUMN IF EXISTS company_logo_url,
  DROP COLUMN IF EXISTS company_website;

-- Recreate original policies
-- (See supabase-schema.sql for original policies)
```

## Troubleshooting

### Error: "relation already exists"
Some columns may already exist. Safe to ignore or modify migration to use `IF NOT EXISTS`.

### Error: "permission denied"
Ensure you're using the service role key, not the anon key.

### Error: "function exec_sql does not exist"
You need to create the exec_sql function first. Run:
```sql
CREATE OR REPLACE FUNCTION exec_sql(sql_query text)
RETURNS void AS $$
BEGIN
  EXECUTE sql_query;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Next Steps

After successful migration:
1. Update TypeScript types (already done in `types/database.ts`)
2. Create sponsor onboarding flow
3. Build sponsor dashboard
4. Test end-to-end sponsor journey
