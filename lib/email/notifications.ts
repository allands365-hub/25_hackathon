import { sendEmail } from './client';
import {
  submissionConfirmationEmail,
  scoreUpdateEmail,
  badgeNotificationEmail,
  type SubmissionNotificationData,
  type ScoreUpdateData,
  type BadgeNotificationData
} from './templates';

/**
 * Send submission confirmation email to user
 */
export async function notifySubmissionReceived(data: SubmissionNotificationData) {
  if (!data.userName) {
    console.log('No email to send - user name not found');
    return;
  }

  const subject = '🎉 Your Submission Has Been Received';
  
  return await sendEmail({
    to: data.userName, // Will be replaced with actual email in implementation
    subject,
    html: submissionConfirmationEmail(data),
  });
}

/**
 * Send score update email to user
 */
export async function notifyScoreUpdate(data: ScoreUpdateData) {
  if (!data.userName) {
    console.log('No email to send - user name not found');
    return;
  }

  const subject = `✅ Your Score for ${data.challengeTitle} is Ready!`;
  
  return await sendEmail({
    to: data.userName, // Will be replaced with actual email in implementation
    subject,
    html: scoreUpdateEmail(data),
  });
}

/**
 * Send badge notification email to user
 */
export async function notifyBadgeEarned(data: BadgeNotificationData) {
  if (!data.userName) {
    console.log('No email to send - user name not found');
    return;
  }

  const subject = '🏅 You Earned a Badge!';
  
  return await sendEmail({
    to: data.userName, // Will be replaced with actual email in implementation
    subject,
    html: badgeNotificationEmail(data),
  });
}

/**
 * Helper to determine badge based on submission criteria
 */
export function checkForBadges(submissions: any[]) {
  const badges = [];
  
  // First submission
  if (submissions.length === 1) {
    badges.push({
      name: 'First Submission',
      description: 'Submitted your first project',
      icon: '🎯'
    });
  }
  
  // High scorer (score >= 80)
  const hasHighScore = submissions.some(s => s.evaluation?.score >= 80);
  if (hasHighScore) {
    badges.push({
      name: 'High Scorer',
      description: 'Achieved a score above 80',
      icon: '🎉'
    });
  }
  
  // Top 10% (score >= 90)
  const hasTopScore = submissions.some(s => s.evaluation?.score >= 90);
  if (hasTopScore) {
    badges.push({
      name: 'Top 10%',
      description: 'Achieved a score in the top 10%',
      icon: '🌟'
    });
  }
  
  // Challenge winner (rank 1)
  const hasWon = submissions.some(s => s.evaluation?.rank === 1);
  if (hasWon) {
    badges.push({
      name: 'Challenge Winner',
      description: 'Won first place in a challenge',
      icon: '🏆'
    });
  }
  
  // Prolific builder (5+ submissions)
  if (submissions.length >= 5) {
    badges.push({
      name: 'Prolific Builder',
      description: 'Submitted 5 or more projects',
      icon: '💻'
    });
  }
  
  return badges;
}
