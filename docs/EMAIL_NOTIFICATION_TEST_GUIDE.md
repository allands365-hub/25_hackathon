# Email Notification Testing Guide

## Overview
This guide covers testing the email notification system using Resend, which includes:
1. Submission confirmation emails
2. Score update notifications
3. Badge earned notifications
4. User profile portfolio/CV features

## Prerequisites
- Resend API key configured in `.env.local`
- Development server running (`npm run dev`)
- Test user accounts (builder and sponsor)

## Test Scenarios

### 1. Submission Confirmation Email

**Steps:**
1. Sign in as a builder
2. Navigate to any challenge
3. Submit a project (GitHub repo, deck, video, summary)
4. **Expected:** Receive confirmation email within seconds
5. Check email for:
   - Proper formatting
   - Challenge name
   - Submission status (Evaluating)
   - Link to view submission

**Email Template:** `lib/email/templates.ts` - `submissionConfirmationEmail()`

### 2. Score Update Email (AI Evaluation)

**Steps:**
1. Submit a project (from scenario 1)
2. Wait for AI evaluation (~30-60 seconds)
3. **Expected:** Receive score update email
4. Check email for:
   - Final score (0-100)
   - Challenge title
   - Leaderboard rank (if applicable)
   - Links to view challenge and submission

**Email Template:** `lib/email/templates.ts` - `scoreUpdateEmail()`

### 3. Score Update Email (Hybrid - Manual Review)

**Steps:**
1. Submit a project as a builder
2. Sign in as a sponsor (challenge creator)
3. Navigate to challenge → Submissions
4. Select a submission to review
5. Submit manual scores for each criterion
6. Add feedback
7. **Expected:** Builder receives hybrid score email
8. Check email for:
   - Hybrid score breakdown (AI + Human)
   - Individual criterion scores
   - Overall score
   - Links to view details

**Email Template:** `lib/email/templates.ts` - `scoreUpdateEmail()` (with hybrid data)

### 4. Badge Earned Email

**Steps:**
1. Earn a badge by:
   - Submitting first project → "First Submission"
   - Scoring above 80 → "High Scorer"
   - Scoring above 90 → "Top 10%"
   - Winning first place → "Challenge Winner"
   - Submitting 5+ projects → "Prolific Builder"
2. **Expected:** Receive badge notification email
3. Check email for:
   - Badge name and description
   - Badge icon/emoji
   - Link to view profile

**Email Template:** `lib/email/templates.ts` - `badgeNotificationEmail()`

### 5. User Profile Portfolio/CV Testing

#### Adding Portfolio/CV Information

**Steps:**
1. Sign in as a builder
2. Navigate to Profile page (`/profile`)
3. Fill in portfolio fields:
   - LinkedIn URL
   - Portfolio Website URL
   - CV/Resume URL (Google Drive, Dropbox, etc.)
   - Location
   - Personal Website
   - Twitter/X Profile
   - Years of Experience
   - Availability Status
   - Technical Skills (add multiple)
4. Click "Update Profile"
5. **Expected:** Profile updated successfully
6. Refresh page to verify data persistence

#### Viewing Public Profile

**Steps:**
1. Sign in as a different user (or view as guest)
2. Navigate to builder's public profile (`/users/{user-id}`)
3. Check for:
   - All portfolio links (GitHub, LinkedIn, Portfolio, CV)
   - Skills displayed as badges
   - Location and experience years
   - Availability status indicator
   - Bio and submission history

#### Profile Links Visibility

**Test Each Link:**
1. GitHub - Should open user's GitHub profile
2. LinkedIn - Should open user's LinkedIn
3. Portfolio - Should open portfolio website
4. CV - Should open downloadable CV
5. Website - Should open personal website
6. Twitter - Should open Twitter profile

## Technical Implementation

### Email Service Architecture

```
lib/email/
├── client.ts          # Resend client wrapper
├── templates.ts       # Email HTML templates
└── notifications.ts   # Notification helper functions

app/api/
├── evaluate/route.ts      # Sends score emails
├── manual-review/route.ts # Sends hybrid score emails
└── submissions/
    └── notify/route.ts     # Submission confirmation
```

### Environment Variables

Required in `.env.local`:
```
RESEND_API_KEY=re_xxxxxxxxx
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Database Fields for Portfolio

Added via migration `004_add_portfolio_cv_fields.sql`:
- `portfolio_url` - Portfolio website
- `cv_url` - Resume/CV link
- `skills` - Array of technical skills
- `location` - Geographic location
- `website_url` - Personal website
- `twitter_url` - Twitter/X profile
- `experience_years` - Years of experience
- `availability_status` - Job availability

## Testing Checklist

### Email Notifications
- [ ] Submission confirmation emails sent
- [ ] AI score update emails sent
- [ ] Manual review (hybrid) score emails sent
- [ ] Badge earned emails sent
- [ ] Email links work correctly
- [ ] Email formatting is responsive
- [ ] Email content is accurate

### Profile Features
- [ ] All portfolio fields can be edited
- [ ] Skills can be added/removed
- [ ] Profile data persists after refresh
- [ ] Public profile displays all information
- [ ] All links open correctly
- [ ] Availability status updates
- [ ] Experience years display correctly

### Error Handling
- [ ] Submission succeeds even if email fails
- [ ] Manual review succeeds even if email fails
- [ ] Profile updates succeed even if database fails
- [ ] Error messages are user-friendly
- [ ] Failed emails are logged to console

## Common Issues

### Emails Not Sending
1. Check Resend API key is correct in `.env.local`
2. Verify domain is verified in Resend dashboard
3. Check console for error messages
4. Ensure `NEXT_PUBLIC_BASE_URL` is set correctly

### Profile Not Updating
1. Check browser console for errors
2. Verify Supabase connection
3. Check RLS policies allow profile updates
4. Ensure user is authenticated

### Links Not Working
1. Verify `NEXT_PUBLIC_BASE_URL` is set
2. Check URL structure in email templates
3. Test links manually in browser
4. Check for HTTPS/HTTP mismatch

## Performance Testing

1. **Email Delivery Time:**
   - Submission email: < 5 seconds
   - Score update: < 10 seconds after evaluation
   - Badge email: < 5 seconds after badge earned

2. **Profile Load Time:**
   - Private profile: < 2 seconds
   - Public profile: < 2 seconds
   - Profile update: < 1 second

## Browser Testing

Use these browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## API Endpoints to Test

1. `POST /api/evaluate` - Triggers score email
2. `POST /api/manual-review` - Triggers hybrid score email
3. `POST /api/submissions/notify` - Sends confirmation email
4. `PUT /profile` - Updates profile data

## Next Steps

1. Install dependencies: `npm install`
2. Start dev server: `npm run dev`
3. Test each scenario above
4. Verify emails in Resend dashboard
5. Check Resend logs for delivery status
6. Monitor console for any errors

## Support

If email notifications fail:
1. Check Resend dashboard for errors
2. Review console logs
3. Verify API key permissions
4. Test with Resend's test email endpoint

If profile features fail:
1. Check database migration status
2. Verify Supabase connection
3. Check RLS policies
4. Review authentication flow
