const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function runSQL(sql, label) {
  console.log(`\n📝 ${label}...`);
  
  try {
    // Try to use exec_sql function
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
    
    if (error) {
      if (error.message.includes('does not exist')) {
        console.log('⚠️  exec_sql function not found. Creating it...');
        return false; // Signal to create the function
      }
      throw error;
    }
    
    console.log('✅ Success!');
    return true;
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  }
}

async function main() {
  console.log('🚀 Starting Database Migrations\n');
  console.log(`📍 Database: ${process.env.NEXT_PUBLIC_SUPABASE_URL}\n`);
  
  // Step 1: Create exec_sql function
  const createFunctionSQL = `
CREATE OR REPLACE FUNCTION exec_sql(sql_query text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE sql_query;
END;
$$;
  `.trim();
  
  console.log('Step 1: Creating exec_sql function...');
  const funcCreated = await runSQL(createFunctionSQL, 'Creating helper function');
  
  if (!funcCreated) {
    console.log('\n❌ Unable to create exec_sql function automatically.');
    console.log('\n📋 Please create it manually in Supabase SQL Editor:');
    console.log('\n' + createFunctionSQL);
    console.log('\nThen run this script again.\n');
    process.exit(1);
  }
  
  // Step 2: Run Migration 001
  const migration001 = fs.readFileSync(
    path.join(__dirname, 'migrations', '001_add_sponsor_roles.sql'),
    'utf8'
  );
  
  await runSQL(migration001, 'Migration 001: Add Sponsor Roles');
  
  // Step 3: Run Migration 002
  const migration002 = fs.readFileSync(
    path.join(__dirname, 'migrations', '002_add_manual_reviews.sql'),
    'utf8'
  );
  
  await runSQL(migration002, 'Migration 002: Add Manual Reviews');
  
  console.log('\n🎉 All migrations completed successfully!\n');
  console.log('✅ Database is now ready with:');
  console.log('   - Sponsor roles and company profiles');
  console.log('   - Manual review system');
  console.log('   - Hybrid scoring (50% AI + 50% Human)');
  console.log('   - Enhanced leaderboard\n');
}

main().catch(error => {
  console.error('\n💥 Migration failed:', error);
  process.exit(1);
});
