import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const challengeId = searchParams.get('challengeId');

    if (!challengeId) {
      return NextResponse.json({ error: 'Challenge ID is required' }, { status: 400 });
    }

    // Use admin client to bypass RLS
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Fetch all submissions for the challenge with full candidate data
    const { data: submissions, error: submissionsError } = await supabase
      .from('submissions')
      .select(`
        *,
        users!inner(
          username,
          email,
          avatar_url,
          bio,
          linkedin_url,
          portfolio_url,
          github_id,
          created_at
        ),
        evaluations(score, criterion_scores, feedback, evaluated_at),
        manual_reviews(score, criterion_scores, feedback, reviewed_at)
      `)
      .eq('challenge_id', challengeId)
      .eq('status', 'evaluated');

    if (submissionsError) {
      console.error('Error fetching submissions:', submissionsError);
      return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 });
    }

    // Format data for export
    const candidatePackets = (submissions || []).map((sub: any) => {
      const llmScore = sub.evaluations?.[0]?.score || null;
      const humanScore = sub.manual_reviews?.[0]?.score || null;
      
      // Calculate final score (hybrid if both exist, otherwise LLM)
      const finalScore = humanScore 
        ? Math.round((llmScore * 0.5) + (humanScore * 0.5))
        : llmScore;

      return {
        'Candidate Name': sub.users.username,
        'Email': sub.users.email || 'Not provided',
        'GitHub': sub.users.github_id || 'Not provided',
        'LinkedIn': sub.users.linkedin_url || 'Not provided',
        'Portfolio': sub.users.portfolio_url || 'Not provided',
        'Bio': sub.users.bio || 'Not provided',
        'Submission URL': sub.repo_url,
        'Pitch Deck URL': sub.deck_url || 'Not provided',
        'Demo Video URL': sub.video_url || 'Not provided',
        'LLM Score': llmScore || 'Not evaluated',
        'Human Score': humanScore || 'Not reviewed',
        'Final Score': finalScore || 'Not calculated',
        'Summary': sub.summary || 'Not provided',
        'Submitted At': sub.created_at || '',
      };
    });

    // Return JSON data
    return NextResponse.json({ candidates: candidatePackets }, {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="candidates-${challengeId}.json"`,
      },
    });

  } catch (error: any) {
    console.error('Error exporting candidates:', error);
    return NextResponse.json({ error: error.message || 'Failed to export candidates' }, { status: 500 });
  }
}

