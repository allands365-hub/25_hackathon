# 🚀 Migration Instructions

## Quick Setup (2 minutes)

### Step 1: Create the exec_sql Function

1. Open your Supabase Dashboard: https://supabase.com/dashboard/project/qbbdfgszjgfteusxlykl
2. Go to **SQL Editor** (left sidebar)
3. Click **New Query**
4. Copy and paste this SQL:

```sql
CREATE OR REPLACE FUNCTION exec_sql(sql_query text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE sql_query;
END;
$$;
```

5. Click **Run** (or press Ctrl+Enter)
6. You should see "Success. No rows returned"

### Step 2: Run Migration 001 (Sponsor Roles)

1. In the SQL Editor, click **New Query**
2. Open the file: `scripts/migrations/001_add_sponsor_roles.sql`
3. Copy the ENTIRE contents
4. Paste into the SQL Editor
5. Click **Run**
6. Wait for "Success" message

**What this does:**
- Adds `role` column to users (builder, sponsor, admin)
- Adds company fields (company_name, company_logo_url, company_website)
- Adds challenge ownership (created_by)
- Adds prize fields
- Updates RLS policies

### Step 3: Run Migration 002 (Manual Reviews)

1. In the SQL Editor, click **New Query**
2. Open the file: `scripts/migrations/002_add_manual_reviews.sql`
3. Copy the ENTIRE contents
4. Paste into the SQL Editor
5. Click **Run**
6. Wait for "Success" message

**What this does:**
- Creates `manual_reviews` table
- Creates `final_scores` view (hybrid score calculation)
- Creates `leaderboard` view (with hybrid scores)
- Adds RLS policies for manual reviews

### Step 4: Verify Migrations

In the Supabase Dashboard:

1. Go to **Table Editor**
2. Check these tables exist:
   - `users` - should have new columns: role, company_name, company_logo_url, company_website
   - `challenges` - should have new columns: created_by, prize_amount, prize_currency, is_published
   - `manual_reviews` - should be a new table
3. Check these views exist (in SQL Editor):
   ```sql
   SELECT * FROM final_scores LIMIT 1;
   SELECT * FROM leaderboard LIMIT 1;
   ```

---

## ✅ Done!

Your database is now ready with:
- ✅ Sponsor roles and company profiles
- ✅ Manual review system
- ✅ Hybrid scoring (50% AI + 50% Human)
- ✅ Enhanced leaderboard

You can now:
1. Sign up as a sponsor
2. Create challenges
3. Review submissions manually
4. See hybrid scores in the leaderboard

---

## 🐛 Troubleshooting

### Error: "relation already exists"
This means the migration was already partially run. It's safe to ignore.

### Error: "permission denied"
Make sure you're using the service role key, not the anon key.

### Error: "column already exists"
The migration includes `IF NOT EXISTS` checks, so this should be rare. If you see this, the migration might have already run.

### Need to roll back?
If something goes wrong, you can manually drop the added columns/tables in the SQL Editor, but be careful - this will delete data!

---

## Alternative: Automated Migration Script

If you prefer to run migrations programmatically, use this command:

```bash
node scripts/run-migrations.js
```

**Note:** This requires the exec_sql function to be created first (Step 1 above).
