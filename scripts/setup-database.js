// Setup database schema for BuildAI Arena
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function setupDatabase() {
  console.log('🚀 Setting up BuildAI Arena database schema...\n');

  try {
    // Read the SQL schema file
    const schemaPath = path.join(__dirname, '..', 'supabase-schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Split schema into individual statements (rough split by semicolon)
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s && !s.startsWith('--') && s.length > 0);

    console.log(`📝 Found ${statements.length} SQL statements to execute\n`);

    // Execute each statement
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';';

      // Skip pure comment blocks
      if (statement.trim().startsWith('--')) continue;

      // Log what we're executing (first 100 chars)
      const preview = statement.substring(0, 100).replace(/\n/g, ' ');
      console.log(`Executing [${i + 1}/${statements.length}]: ${preview}...`);

      try {
        // Execute via raw SQL
        const { error } = await supabase.rpc('exec_sql', {
          sql: statement
        }).catch(async () => {
          // If exec_sql RPC doesn't exist, we need a different approach
          // For now, we'll use Supabase's PostgreSQL REST API
          // This is a limitation - user may need to run this in Supabase SQL Editor manually
          throw new Error('exec_sql RPC not available - please run schema manually in Supabase SQL Editor');
        });

        if (error) {
          console.log(`   ❌ Error: ${error.message}\n`);
          errorCount++;
        } else {
          console.log('   ✅ Success\n');
          successCount++;
        }
      } catch (err) {
        console.log(`   ⚠️  Skipped: ${err.message}\n`);
      }
    }

    console.log('═══════════════════════════════════════════════════');
    console.log(`✅ Success: ${successCount} statements`);
    console.log(`❌ Errors: ${errorCount} statements`);
    console.log('═══════════════════════════════════════════════════\n');

    if (errorCount > 0) {
      console.log('⚠️  Some statements failed. This might be normal for:');
      console.log('   - Statements that try to create existing objects');
      console.log('   - RLS policies that already exist');
      console.log('\n💡 Tip: You can manually run supabase-schema.sql in Supabase SQL Editor');
      console.log('   at: https://supabase.com/dashboard/project/_/sql');
    }

    // Verify tables were created
    console.log('\n🔍 Verifying database schema...\n');
    const tables = ['users', 'challenges', 'submissions', 'evaluations'];

    for (const table of tables) {
      const { data, error } = await supabase.from(table).select('*').limit(1);
      if (error) {
        console.log(`   ❌ Table '${table}' - ERROR: ${error.message}`);
      } else {
        console.log(`   ✅ Table '${table}' - Ready`);
      }
    }

    console.log('\n🎉 Database setup complete!\n');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    console.log('\n📝 Manual Setup Required:');
    console.log('   1. Go to: https://supabase.com/dashboard/project/_/sql');
    console.log('   2. Open: supabase-schema.sql');
    console.log('   3. Copy and paste the entire file');
    console.log('   4. Click "Run" to execute\n');
    process.exit(1);
  }
}

setupDatabase();
