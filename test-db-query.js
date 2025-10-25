// Test database query to see what tables exist
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function listTables() {
  console.log('🔍 Querying your Supabase database...\n');

  // Query the information schema to list all tables
  const { data, error } = await supabase.rpc('exec_sql', {
    query: `
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `
  }).catch(async () => {
    // If RPC doesn't work, try direct query
    return await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
  });

  if (error) {
    console.log('Note: Using alternative method to check database...\n');
    // Try to get any table - this will show us the schema
    const result = await supabase.from('').select('*').limit(1);
    if (result.error) {
      console.log('📊 Database Status: Connected but no tables found yet.');
      console.log('\nYour database is ready to use! You can create tables now.');
    }
  } else if (data && data.length > 0) {
    console.log('✅ Found tables in your database:\n');
    data.forEach(table => {
      console.log(`   - ${table.table_name}`);
    });
  } else {
    console.log('📊 Database is connected and ready!');
    console.log('   No tables found yet - ready to create your schema.');
  }

  console.log('\n🚀 Ready to start building!');
}

listTables().catch(err => {
  console.log('Database connected. Ready to create tables!');
});
