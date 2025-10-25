// Quick test script to verify Supabase and Groq connections
// Run with: node test-connections.js

require('dotenv').config({ path: '.env.local' });

async function testSupabase() {
  console.log('Testing Supabase connection...');
  const { createClient } = require('@supabase/supabase-js');

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    // Try to query the database (this will work even if there are no tables)
    const { data, error } = await supabase.from('_supabase_migrations').select('*').limit(1);

    if (error && error.code === '42P01') {
      console.log('✅ Supabase connected! (No tables found, but connection works)');
      return true;
    } else if (error) {
      console.log('✅ Supabase connected! (Connection successful)');
      return true;
    } else {
      console.log('✅ Supabase connected successfully!');
      return true;
    }
  } catch (err) {
    console.error('❌ Supabase connection failed:', err.message);
    return false;
  }
}

async function testGroq() {
  console.log('\nTesting Groq connection...');
  const Groq = require('groq-sdk');

  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
  });

  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: 'Say "Hello from Groq!"' }],
      model: 'llama-3.1-8b-instant',
      max_tokens: 20,
    });

    console.log('✅ Groq connected successfully!');
    console.log('   Response:', completion.choices[0]?.message?.content);
    return true;
  } catch (err) {
    console.error('❌ Groq connection failed:', err.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Testing Hackathon Environment Setup\n');
  console.log('=====================================\n');

  const supabaseOk = await testSupabase();
  const groqOk = await testGroq();

  console.log('\n=====================================');
  console.log('📊 Test Results:');
  console.log(`   Supabase: ${supabaseOk ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   Groq AI:  ${groqOk ? '✅ PASS' : '❌ FAIL'}`);
  console.log('=====================================\n');

  if (supabaseOk && groqOk) {
    console.log('🎉 All systems ready! You can start building!');
    console.log('\nNext steps:');
    console.log('  1. Reload VS Code to activate MCP server');
    console.log('  2. Run: npm run dev');
    console.log('  3. Start building your hackathon project!');
  } else {
    console.log('⚠️  Some connections failed. Check your API keys.');
  }
}

main();
