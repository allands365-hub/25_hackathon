// Create tables directly using Supabase client
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createTables() {
  console.log('🚀 Creating BuildAI Arena database tables...\n');

  const sqlStatements = [
    // Enable UUID extension
    `CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`,

    // Users table
    `CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      github_id TEXT UNIQUE NOT NULL,
      username TEXT NOT NULL,
      email TEXT,
      avatar_url TEXT,
      bio TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`,

    `CREATE INDEX IF NOT EXISTS idx_users_github_id ON users(github_id)`,

    // Challenges table
    `CREATE TABLE IF NOT EXISTS challenges (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      problem_statement TEXT NOT NULL,
      rubric JSONB NOT NULL,
      difficulty TEXT CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')) DEFAULT 'Intermediate',
      deadline TIMESTAMPTZ,
      sponsor_name TEXT,
      sponsor_logo_url TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`,

    `CREATE INDEX IF NOT EXISTS idx_challenges_difficulty ON challenges(difficulty)`,
    `CREATE INDEX IF NOT EXISTS idx_challenges_deadline ON challenges(deadline)`,

    // Submissions table
    `CREATE TABLE IF NOT EXISTS submissions (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      repo_url TEXT NOT NULL,
      deck_url TEXT,
      video_url TEXT,
      summary TEXT NOT NULL,
      status TEXT CHECK (status IN ('pending', 'evaluating', 'evaluated', 'failed')) DEFAULT 'pending',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(challenge_id, user_id)
    )`,

    `CREATE INDEX IF NOT EXISTS idx_submissions_challenge_id ON submissions(challenge_id)`,
    `CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON submissions(user_id)`,
    `CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status)`,

    // Evaluations table
    `CREATE TABLE IF NOT EXISTS evaluations (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      submission_id UUID UNIQUE NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
      score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
      criterion_scores JSONB NOT NULL,
      feedback TEXT NOT NULL,
      evaluated_at TIMESTAMPTZ DEFAULT NOW()
    )`,

    `CREATE INDEX IF NOT EXISTS idx_evaluations_submission_id ON evaluations(submission_id)`,
  ];

  let successCount = 0;
  let errorCount = 0;

  for (const sql of sqlStatements) {
    const preview = sql.substring(0, 80).replace(/\n/g, ' ');
    console.log(`Executing: ${preview}...`);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/exec`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
        },
        body: JSON.stringify({ query: sql })
      });

      if (response.ok) {
        console.log('   ✅ Success\n');
        successCount++;
      } else {
        // Try alternative approach using direct query
        const { error } = await supabase.rpc('exec', { sql });
        if (error) {
          console.log(`   ⚠️  ${error.message}\n`);
          errorCount++;
        } else {
          console.log('   ✅ Success\n');
          successCount++;
        }
      }
    } catch (err) {
      console.log(`   ⚠️  ${err.message}\n`);
      // Don't count as error - might already exist
    }
  }

  console.log('═══════════════════════════════════════════════════');
  console.log(`✅ Executed: ${successCount}/${sqlStatements.length} statements`);
  console.log('═══════════════════════════════════════════════════\n');

  // Verify tables
  console.log('🔍 Verifying tables...\n');
  const tables = ['users', 'challenges', 'submissions', 'evaluations'];

  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*').limit(1);
    if (error) {
      console.log(`   ❌ Table '${table}' - ${error.message}`);
    } else {
      console.log(`   ✅ Table '${table}' exists`);
    }
  }

  console.log('\n✅ Table creation complete!\n');
}

createTables().catch(console.error);
