import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const resendClient = resend;

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail({ to, subject, html, from = 'BuildAI Arena <notifications@buildaiarena.com>' }: EmailOptions) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error('Resend API key not configured');
      return { success: false, error: 'Email service not configured' };
    }

    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error };
    }

    console.log('Email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error };
  }
}
