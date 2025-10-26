import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendEmail } from '@/lib/email/client';
import { scoreUpdateEmail, type ScoreUpdateData } from '@/lib/email/templates';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user profile to verify they're a sponsor
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || !profile || profile.role !== 'sponsor') {
      return NextResponse.json(
        { error: 'Only sponsors can submit manual reviews' },
        { status: 403 }
      );
    }

    // Get review data from request
    const reviewData = await request.json();

    // Validate required fields
    if (!reviewData.submission_id || !reviewData.criterion_scores || !reviewData.feedback) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify submission exists and sponsor owns the challenge
    const { data: submission, error: submissionError } = await supabase
      .from('submissions')
      .select(
        `
        id,
        challenge_id,
        challenges!inner(created_by)
      `
      )
      .eq('id', reviewData.submission_id)
      .single();

    if (submissionError || !submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    if (submission.challenges.created_by !== user.id) {
      return NextResponse.json(
        { error: 'You can only review submissions to your own challenges' },
        { status: 403 }
      );
    }

    // Calculate overall score from criterion scores
    const criterionScores = reviewData.criterion_scores;
    const scores = Object.values(criterionScores) as number[];

    if (scores.some((score) => score < 0 || score > 100)) {
      return NextResponse.json(
        { error: 'All scores must be between 0 and 100' },
        { status: 400 }
      );
    }

    // Calculate weighted average
    // For now, we'll use a simple average. In production, you'd weight by criterion weights
    const overallScore = Math.round(
      scores.reduce((sum, score) => sum + score, 0) / scores.length
    );

    // Check if review already exists for this user/submission
    const { data: existingReview, error: existingError } = await supabase
      .from('manual_reviews')
      .select('id')
      .eq('submission_id', reviewData.submission_id)
      .eq('reviewer_id', user.id)
      .single();

    let result;

    if (existingReview) {
      // Update existing review
      const { data, error } = await supabase
        .from('manual_reviews')
        .update({
          score: overallScore,
          criterion_scores: criterionScores,
          feedback: reviewData.feedback,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', existingReview.id)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      // Insert new review
      const { data, error } = await supabase
        .from('manual_reviews')
        .insert({
          submission_id: reviewData.submission_id,
          reviewer_id: user.id,
          score: overallScore,
          criterion_scores: criterionScores,
          feedback: reviewData.feedback,
        })
        .select()
        .single();

      if (error) {
        console.error('Error inserting review:', error);
        throw error;
      }
      result = data;
    }

    // Send email notification to user about manual review
    try {
      // Fetch submission details with user email
      const { data: submissionWithUser } = await supabase
        .from('submissions')
        .select(`
          id,
          challenge_id,
          users!inner(email, username),
          challenges!inner(title, created_by)
        `)
        .eq('id', reviewData.submission_id)
        .single();

      if (submissionWithUser && submissionWithUser.users?.email) {
        // Calculate final hybrid score from manual review
        const finalScore = overallScore; // This will be recalculated by the view

        const notificationData: ScoreUpdateData = {
          userName: submissionWithUser.users.username,
          challengeTitle: submissionWithUser.challenges.title,
          submissionId: reviewData.submission_id,
          score: finalScore,
          isHybrid: true,
          humanScore: overallScore,
          challengeId: submissionWithUser.challenge_id,
        };

        await sendEmail({
          to: submissionWithUser.users.email,
          subject: `✅ Your Score for ${submissionWithUser.challenges.title} is Ready!`,
          html: scoreUpdateEmail(notificationData),
        });
      }
    } catch (emailError) {
      console.error('Failed to send email notification for manual review:', emailError);
      // Don't fail the review submission if email fails
    }

    return NextResponse.json(
      {
        success: true,
        review: result,
        message: existingReview ? 'Review updated successfully' : 'Review submitted successfully',
      },
      { status: existingReview ? 200 : 201 }
    );
  } catch (error: any) {
    console.error('Manual review submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const submissionId = searchParams.get('submissionId');
    const challengeId = searchParams.get('challengeId');

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let query = supabase
      .from('manual_reviews')
      .select(
        `
        *,
        users!reviewer_id(username, avatar_url, company_name),
        submissions!submission_id(
          challenge_id,
          users!user_id(username, avatar_url)
        )
      `
      );

    if (submissionId) {
      query = query.eq('submission_id', submissionId);
    } else if (challengeId) {
      query = query.eq('submissions.challenge_id', challengeId);
    }

    const { data: reviews, error } = await query.order('reviewed_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ reviews }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews', details: error.message },
      { status: 500 }
    );
  }
}
