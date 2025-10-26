import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import Groq from 'groq-sdk';
import { sendEmail } from '@/lib/email/client';
import { scoreUpdateEmail, type ScoreUpdateData } from '@/lib/email/templates';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export async function POST(request: NextRequest) {
  try {
    const { submissionId } = await request.json();

    if (!submissionId) {
      return NextResponse.json(
        { error: 'Submission ID is required' },
        { status: 400 }
      );
    }

    // Fetch submission with related data
    const { data: submission, error: submissionError } = await supabaseAdmin
      .from('submissions')
      .select(`
        *,
        challenge:challenges(*),
        user:users(username)
      `)
      .eq('id', submissionId)
      .single();

    if (submissionError || !submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }

    // Update status to evaluating
    await supabaseAdmin
      .from('submissions')
      .update({ status: 'evaluating' })
      .eq('id', submissionId);

    // Build evaluation prompt
    const rubric = submission.challenge.rubric;
    const criteriaText = rubric.criteria
      .map(
        (c: any) =>
          `- ${c.name} (${c.weight}%): ${c.description}`
      )
      .join('\n');

    const prompt = `You are an expert evaluator of AI product submissions. Evaluate the following project submission against this rubric:

**Challenge:** ${submission.challenge.title}

**Rubric Criteria:**
${criteriaText}

**Project Submission:**
- GitHub Repository: ${submission.repo_url}
${submission.deck_url ? `- Pitch Deck: ${submission.deck_url}` : ''}
${submission.video_url ? `- Demo Video: ${submission.video_url}` : ''}
- Summary: ${submission.summary}

**Instructions:**
1. Analyze the project based on the provided summary and URLs
2. Score each criterion from 0-100 based on its description
3. Calculate an overall weighted score (0-100)
4. Provide constructive, actionable feedback (2-3 paragraphs)

**Output Format (JSON):**
{
  "overall_score": 85,
  "criterion_scores": {
    "Technical Implementation": 90,
    "User Experience": 85,
    "Innovation": 80,
    "Production Readiness": 85,
    "Problem Solving": 85
  },
  "feedback": "Detailed evaluation feedback here..."
}

Respond ONLY with valid JSON matching the format above.`;

    // Call Groq API for evaluation
    let completion;
    try {
      completion = await groq.chat.completions.create({
        model: 'llama-3.1-8b-instant', // Fast, high-quality model
        messages: [
          {
            role: 'system',
            content:
              'You are a fair and expert AI product evaluator. Provide objective, constructive evaluations in valid JSON format.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3, // Lower temperature for more consistent scoring
        max_tokens: 1500,
        response_format: { type: 'json_object' },
      });
    } catch (groqError: any) {
      console.error('Groq API error:', groqError);
      
      // Handle rate limiting
      if (groqError.status === 429) {
        return NextResponse.json(
          { 
            error: 'Evaluation queue is full. Your submission will be processed shortly.',
            code: 'RATE_LIMITED'
          },
          { status: 429 }
        );
      }
      
      // Handle other API errors
      if (groqError.status >= 400 && groqError.status < 500) {
        return NextResponse.json(
          { 
            error: 'Evaluation service temporarily unavailable. Please try again later.',
            code: 'SERVICE_UNAVAILABLE'
          },
          { status: 503 }
        );
      }
      
      // Handle server errors
      return NextResponse.json(
        { 
          error: 'Evaluation failed. Please try again later.',
          code: 'EVALUATION_FAILED'
        },
        { status: 500 }
      );
    }

    const responseText = completion.choices[0]?.message?.content;

    if (!responseText) {
      throw new Error('No response from Groq API');
    }

    // Parse evaluation result
    let evaluation;
    try {
      evaluation = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse Groq response:', responseText);
      throw new Error('Invalid evaluation response format');
    }

    // Validate required fields
    if (
      typeof evaluation.overall_score !== 'number' ||
      !evaluation.criterion_scores ||
      !evaluation.feedback
    ) {
      throw new Error('Evaluation missing required fields');
    }

    // Clamp score to 0-100
    const clampedScore = Math.max(0, Math.min(100, Math.round(evaluation.overall_score)));

    // Insert evaluation into database
    const { error: evalError } = await supabaseAdmin
      .from('evaluations')
      .insert({
        submission_id: submissionId,
        score: clampedScore,
        criterion_scores: evaluation.criterion_scores,
        feedback: evaluation.feedback,
      });

    if (evalError) {
      console.error('Error inserting evaluation:', evalError);
      throw new Error('Failed to save evaluation');
    }

    // Update submission status to evaluated
    await supabaseAdmin
      .from('submissions')
      .update({ status: 'scored' })
      .eq('id', submissionId);

    // Fetch user email and send notification
    try {
      const { data: userData } = await supabaseAdmin
        .from('users')
        .select('email, username')
        .eq('id', submission.user_id)
        .single();

      if (userData?.email) {
        const notificationData: ScoreUpdateData = {
          userName: userData.username,
          challengeTitle: submission.challenge.title,
          submissionId: submissionId,
          score: clampedScore,
          isHybrid: false,
          llmScore: clampedScore,
          challengeId: submission.challenge_id,
        };

        await sendEmail({
          to: userData.email,
          subject: `✅ Your Score for ${submission.challenge.title} is Ready!`,
          html: scoreUpdateEmail(notificationData),
        });
      }
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
      // Don't fail the evaluation if email fails
    }

    return NextResponse.json({
      success: true,
      score: clampedScore,
      evaluation,
    });
  } catch (error: any) {
    console.error('Evaluation error:', error);

    // Update submission status to failed if we have submissionId
    const body = await request.json().catch(() => ({}));
    if (body.submissionId) {
      await supabaseAdmin
        .from('submissions')
        .update({ status: 'failed' })
        .eq('id', body.submissionId);
    }

    return NextResponse.json(
      {
        error: 'Evaluation failed',
        details: error.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check evaluation status
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const submissionId = searchParams.get('submissionId');

  if (!submissionId) {
    return NextResponse.json(
      { error: 'Submission ID is required' },
      { status: 400 }
    );
  }

  try {
    const { data: evaluation, error } = await supabaseAdmin
      .from('evaluations')
      .select('*')
      .eq('submission_id', submissionId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    const { data: submission } = await supabaseAdmin
      .from('submissions')
      .select('status')
      .eq('id', submissionId)
      .single();

    return NextResponse.json({
      status: submission?.status || 'unknown',
      evaluation: evaluation || null,
    });
  } catch (error) {
    console.error('Error fetching evaluation:', error);
    return NextResponse.json(
      { error: 'Failed to fetch evaluation' },
      { status: 500 }
    );
  }
}
