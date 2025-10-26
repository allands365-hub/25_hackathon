export interface SubmissionNotificationData {
  userName: string;
  challengeTitle: string;
  submissionId: string;
  status: 'pending' | 'evaluating' | 'scored';
  score?: number;
  challengeId: string;
}

export interface ScoreUpdateData {
  userName: string;
  challengeTitle: string;
  submissionId: string;
  score: number;
  rank?: number;
  isHybrid?: boolean;
  llmScore?: number;
  humanScore?: number;
  challengeId: string;
}

export interface BadgeNotificationData {
  userName: string;
  badgeName: string;
  badgeDescription: string;
  imageUrl?: string;
}

/**
 * Template for submission confirmation email
 */
export function submissionConfirmationEmail(data: SubmissionNotificationData) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Submission Received</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">🎉 Submission Received!</h1>
      </div>
      
      <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
        <p style="font-size: 16px; margin-bottom: 20px;">Hi ${data.userName},</p>
        
        <p style="font-size: 16px; margin-bottom: 20px;">
          Great news! We've received your submission for <strong>${data.challengeTitle}</strong>.
        </p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin: 20px 0;">
          <p style="margin: 0; color: #6b7280; font-size: 14px;">Status</p>
          <p style="margin: 5px 0 0 0; font-size: 18px; font-weight: 600;">${getStatusLabel(data.status)}</p>
        </div>
        
        ${data.status === 'evaluating' ? `
          <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #92400e;">
              ⏳ Your submission is being evaluated by our AI. This typically takes 1-2 minutes.
            </p>
          </div>
        ` : ''}
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/submissions/${data.submissionId}" 
             style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
            View Your Submission
          </a>
        </div>
        
        <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
          You'll receive another email when your submission has been scored!
        </p>
      </div>
      
      <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #9ca3af;">
        <p>BuildAI Arena • AI-powered challenge evaluation</p>
      </div>
    </body>
    </html>
  `;
}

/**
 * Template for score update email
 */
export function scoreUpdateEmail(data: ScoreUpdateData) {
  const hasManualReview = data.isHybrid && data.humanScore;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Score is Ready!</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">${getScoreEmoji(data.score)} Your Score is Ready!</h1>
      </div>
      
      <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
        <p style="font-size: 16px; margin-bottom: 20px;">Hi ${data.userName},</p>
        
        <p style="font-size: 16px; margin-bottom: 20px;">
          Your submission for <strong>${data.challengeTitle}</strong> has been evaluated!
        </p>
        
        <div style="background: white; padding: 30px; border-radius: 8px; border-left: 4px solid #10b981; margin: 20px 0; text-align: center;">
          <p style="margin: 0; color: #6b7280; font-size: 14px;">Final Score</p>
          <p style="margin: 5px 0; font-size: 48px; font-weight: 700; color: #10b981;">${data.score}</p>
          ${hasManualReview && (
            `<p style="margin: 10px 0 0 0; font-size: 12px; color: #6b7280;">
              Hybrid: ${data.llmScore} (AI) + ${data.humanScore} (Human) = ${data.score}
            </p>`
          )}
        </div>
        
        ${data.rank ? `
          <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <p style="margin: 0; color: #92400e; font-weight: 600;">
              🏆 Rank #${data.rank} on the leaderboard!
            </p>
          </div>
        ` : ''}
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/challenges/${data.challengeId}" 
             style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600; margin-right: 10px;">
            View Challenge Leaderboard
          </a>
          <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/submissions/${data.submissionId}" 
             style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
            View Submission Details
          </a>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #9ca3af;">
        <p>BuildAI Arena • AI-powered challenge evaluation</p>
      </div>
    </body>
    </html>
  `;
}

/**
 * Template for badge notification email
 */
export function badgeNotificationEmail(data: BadgeNotificationData) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>You Earned a Badge!</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">🏅 You Earned a Badge!</h1>
      </div>
      
      <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
        <p style="font-size: 16px; margin-bottom: 20px;">Hi ${data.userName},</p>
        
        <p style="font-size: 16px; margin-bottom: 30px;">
          Congratulations! You've earned the <strong>${data.badgeName}</strong> badge!
        </p>
        
        <div style="background: white; padding: 40px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 20px 0; text-align: center;">
          <div style="font-size: 64px; margin-bottom: 20px;">${data.imageUrl || '🏅'}</div>
          <h2 style="margin: 0 0 10px 0; font-size: 24px; color: #f59e0b;">${data.badgeName}</h2>
          <p style="margin: 0; color: #6b7280; font-size: 14px;">${data.badgeDescription}</p>
        </div>
        
        <div style="background: #ecfdf5; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #065f46;">
            🎉 Keep up the great work! Badges are displayed on your profile and help sponsors discover your skills.
          </p>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
          <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/profile" 
             style="background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
            View Your Profile
          </a>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #9ca3af;">
        <p>BuildAI Arena • Showcase your AI skills</p>
      </div>
    </body>
    </html>
  `;
}

/**
 * Helper to get status label
 */
function getStatusLabel(status: 'pending' | 'evaluating' | 'scored'): string {
  const labels = {
    pending: '📝 Pending Evaluation',
    evaluating: '⏳ Evaluating',
    scored: '✅ Scored'
  };
  return labels[status];
}

/**
 * Helper to get emoji based on score
 */
function getScoreEmoji(score: number): string {
  if (score >= 90) return '🌟';
  if (score >= 80) return '🎉';
  if (score >= 70) return '✅';
  if (score >= 60) return '👍';
  return '💪';
}
