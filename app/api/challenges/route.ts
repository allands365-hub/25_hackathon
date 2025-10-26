import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    // Get user from auth header
    const authHeader = request.headers.get('authorization');
    const token = request.cookies.get('sb-access-token')?.value;

    if (!token && !authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify user
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      token || authHeader?.replace('Bearer ', '') || ''
    );

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user profile to verify they're a sponsor
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('role, company_name')
      .eq('id', user.id)
      .single();

    if (profileError || !profile || profile.role !== 'sponsor') {
      return NextResponse.json(
        { error: 'Only sponsors can create challenges' },
        { status: 403 }
      );
    }

    // Get challenge data from request
    const challengeData = await request.json();

    // Validate required fields
    if (!challengeData.title || !challengeData.description || !challengeData.problem_statement) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create challenge
    const { data: challenge, error: createError } = await supabase
      .from('challenges')
      .insert({
        title: challengeData.title,
        description: challengeData.description,
        problem_statement: challengeData.problem_statement,
        rubric: challengeData.rubric,
        difficulty: challengeData.difficulty || 'Intermediate',
        deadline: challengeData.deadline,
        sponsor_name: profile.company_name,
        created_by: user.id,
        prize_amount: challengeData.prize_amount || 0,
        prize_currency: challengeData.prize_currency || 'USD',
        is_published: challengeData.is_published || false,
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating challenge:', createError);
      return NextResponse.json(
        { error: 'Failed to create challenge', details: createError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, challenge }, { status: 201 });
  } catch (error: any) {
    console.error('Challenge creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    let query = supabase.from('challenges').select('*');

    if (userId) {
      query = query.eq('created_by', userId);
    } else {
      // Only return published challenges for public access
      query = query.eq('is_published', true);
    }

    const { data: challenges, error } = await query.order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ challenges }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching challenges:', error);
    return NextResponse.json(
      { error: 'Failed to fetch challenges', details: error.message },
      { status: 500 }
    );
  }
}
