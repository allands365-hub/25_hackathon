import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { sendEmail } from '@/lib/email/client';
import { submissionConfirmationEmail, type SubmissionNotificationData } from '@/lib/email/templates';

/**
 * API route to send submission confirmation email
 * Called after a submission is created
 */
export async function POST(request: NextRequest) {
  try {
    const { submissionId } = await request.json();

    if (!submissionId) {
      return NextResponse.json(
        { error: 'Submission ID is required' },
        { status: 400 }
      );
    }

    // Fetch submission with user and challenge details
    const { data: submission, error: submissionError } = await supabaseAdmin
      .from('submissions')
      .select(`
        *,
        users!inner(email, username),
        challenges!inner(title)
      `)
      .eq('id', submissionId)
      .single();

    if (submissionError || !submission) {
      console.error('Submission not found for notification:', submissionError);
      return NextResponse.json({ success: false, error: 'Submission not found' });
    }

    // Send confirmation email
    const notificationData: SubmissionNotificationData = {
      userName: submission.users.username,
      challengeTitle: submission.challenges.title,
      submissionId: submissionId,
      status: 'evaluating',
      challengeId: submission.challenge_id,
    };

    const result = await sendEmail({
      to: submission.users.email,
      subject: '🎉 Your Submission Has Been Received',
      html: submissionConfirmationEmail(notificationData),
    });

    return NextResponse.json({ success: result.success });
  } catch (error: any) {
    console.error('Submission notification error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
