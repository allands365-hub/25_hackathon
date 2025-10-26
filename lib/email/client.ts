import { Resend } from 'resend';

// Log Resend API status
if (process.env.RESEND_API_KEY) {
  console.log('✅ [EMAIL SERVICE] Resend API key is configured');
  console.log(`✅ [EMAIL SERVICE] Resend API key exists: ${process.env.RESEND_API_KEY.substring(0, 10)}...`);
} else {
  console.error('❌ [EMAIL SERVICE] Resend API key NOT found');
}

const resend = new Resend(process.env.RESEND_API_KEY);

export const resendClient = resend;

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail({ to, subject, html, from = 'onboarding@resend.dev' }: EmailOptions) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error('❌ [EMAIL SERVICE] Resend API key not configured');
      return { success: false, error: 'Email service not configured' };
    }
    
    console.log(`📧 [EMAIL SERVICE] Attempting to send email to: ${to}`);
    console.log(`📧 [EMAIL SERVICE] Subject: ${subject}`);

    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
    });

    if (error) {
      console.error('❌ [EMAIL SERVICE] Resend error:', error);
      return { success: false, error };
    }

    console.log('✅ [EMAIL SERVICE] Email sent successfully!');
    console.log('✅ [EMAIL SERVICE] Email ID:', data?.id);
    return { success: true, data };
  } catch (error) {
    console.error('❌ [EMAIL SERVICE] Email sending failed:', error);
    return { success: false, error };
  }
}
