import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { id } = await params;

    const { data: challenge, error } = await supabase
      .from('challenges')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });
      }
      throw error;
    }

    return NextResponse.json({ challenge }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching challenge:', error);
    return NextResponse.json(
      { error: 'Failed to fetch challenge', details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = request.cookies.get('sb-access-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if challenge exists and user owns it
    const { data: existingChallenge, error: fetchError } = await supabase
      .from('challenges')
      .select('created_by')
      .eq('id', id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });
      }
      throw fetchError;
    }

    if (existingChallenge.created_by !== user.id) {
      return NextResponse.json(
        { error: 'You do not have permission to edit this challenge' },
        { status: 403 }
      );
    }

    // Get update data
    const updateData = await request.json();

    // Build update object (only include provided fields)
    const updates: any = {};
    if (updateData.title !== undefined) updates.title = updateData.title;
    if (updateData.description !== undefined) updates.description = updateData.description;
    if (updateData.problem_statement !== undefined)
      updates.problem_statement = updateData.problem_statement;
    if (updateData.rubric !== undefined) updates.rubric = updateData.rubric;
    if (updateData.difficulty !== undefined) updates.difficulty = updateData.difficulty;
    if (updateData.deadline !== undefined) updates.deadline = updateData.deadline;
    if (updateData.prize_amount !== undefined) updates.prize_amount = updateData.prize_amount;
    if (updateData.prize_currency !== undefined) updates.prize_currency = updateData.prize_currency;
    if (updateData.is_published !== undefined) updates.is_published = updateData.is_published;

    // Update challenge
    const { data: challenge, error: updateError } = await supabase
      .from('challenges')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating challenge:', updateError);
      return NextResponse.json(
        { error: 'Failed to update challenge', details: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, challenge }, { status: 200 });
  } catch (error: any) {
    console.error('Challenge update error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = request.cookies.get('sb-access-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if challenge exists and user owns it
    const { data: existingChallenge, error: fetchError } = await supabase
      .from('challenges')
      .select('created_by')
      .eq('id', id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });
      }
      throw fetchError;
    }

    if (existingChallenge.created_by !== user.id) {
      return NextResponse.json(
        { error: 'You do not have permission to delete this challenge' },
        { status: 403 }
      );
    }

    // Delete challenge (cascade will delete related submissions/evaluations)
    const { error: deleteError } = await supabase.from('challenges').delete().eq('id', id);

    if (deleteError) {
      console.error('Error deleting challenge:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete challenge', details: deleteError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('Challenge deletion error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
