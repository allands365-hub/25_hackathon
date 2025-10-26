import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    const { userId, companyName, companyWebsite } = await request.json();

    if (!userId || !companyName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Use service role key to bypass RLS
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Create user profile in users table
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: userId,
        github_id: userId, // Use userId as github_id for sponsors
        email: null, // Will be populated by auth
        username: companyName.toLowerCase().replace(/\s+/g, '-'),
        avatar_url: null,
        bio: null,
        role: 'sponsor',
        company_name: companyName,
        company_website: companyWebsite || null,
        company_logo_url: null,
      });

    if (profileError) {
      console.error('Profile creation error:', profileError);
      return NextResponse.json(
        { error: 'Failed to create user profile', details: profileError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: 'Profile created successfully' });
  } catch (error: any) {
    console.error('Sponsor signup error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred', details: error.message },
      { status: 500 }
    );
  }
}
