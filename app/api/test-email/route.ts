import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email/client';
import { scoreUpdateEmail, type ScoreUpdateData } from '@/lib/email/templates';

export async function GET() {
  console.log('🧪 [TEST EMAIL] Starting test...');
  
  try {
    const notificationData: ScoreUpdateData = {
      userName: 'Allan Dsouza',
      challengeTitle: 'Personal AI Learning Tutor',
      submissionId: 'test-submission-123',
      score: 85,
      isHybrid: false,
      llmScore: 85,
      challengeId: 'fdfcfae1-4da6-421a-94ed-ebfbb85f9269',
    };

    console.log('📧 [TEST EMAIL] Attempting to send test email to allands365@gmail.com...');

    const result = await sendEmail({
      to: 'allands365@gmail.com',
      subject: `✅ Test Email: Your Score for ${notificationData.challengeTitle} is Ready!`,
      html: scoreUpdateEmail(notificationData),
    });

    if (result.success) {
      console.log('✅ [TEST EMAIL] Email sent successfully!');
      console.log(`✅ [TEST EMAIL] Email ID: ${result.data?.id}`);
      
      return NextResponse.json({
        success: true,
        message: 'Test email sent successfully!',
        emailId: result.data?.id,
      });
    } else {
      console.error('❌ [TEST EMAIL] Email sending failed:', result.error);
      
      return NextResponse.json({
        success: false,
        error: result.error,
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('❌ [TEST EMAIL] Test failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Unknown error',
    }, { status: 500 });
  }
}

