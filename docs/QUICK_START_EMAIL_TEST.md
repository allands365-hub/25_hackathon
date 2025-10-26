# Quick Start: Email Notification & Profile Testing

## 🚀 Quick Setup

### 1. Start the Server
```bash
npm install
npm run dev
```

### 2. Verify Environment Variables
Check `.env.local` contains:
```bash
RESEND_API_KEY=re_xxxxxxxxx
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 3. Open Browser
Navigate to: http://localhost:3000

## 📧 Test Email Notifications

### Test 1: Submission Confirmation (2 minutes)
1. Sign in with GitHub (or sponsor account)
2. Go to `/challenges`
3. Click on any challenge
4. Click "Submit Project"
5. Fill in the form:
   - GitHub repo: `https://github.com/yourusername/project`
   - Pitch deck (optional): Any URL
   - Demo video (optional): Any URL
   - Summary: "This is a test submission"
6. Submit
7. ✅ **Check your email inbox for confirmation**

### Test 2: Score Update Email (3-5 minutes)
1. Wait for AI evaluation (~30-60 seconds)
2. ✅ **Check your email inbox for score notification**
3. Open email and verify:
   - Your score is displayed
   - Challenge name is correct
   - Links work

### Test 3: Manual Review Email (5 minutes)
**As Sponsor:**
1. Sign in as sponsor (or create test sponsor account)
2. Go to `/sponsor/challenges`
3. Select your challenge
4. Click "Review Submissions"
5. Add manual scores (all criteria)
6. Add feedback
7. Submit review

**As Builder:**
1. ✅ **Check your email inbox for hybrid score notification**
2. Open email and verify hybrid score breakdown

## 👤 Test User Profile Features

### Test 4: Profile Portfolio/CV (3 minutes)
1. Sign in as builder
2. Go to `/profile`
3. Scroll to "About" section
4. Fill in:
   - Bio: "AI enthusiast..."
   - LinkedIn: `https://linkedin.com/in/yourprofile`
   - Portfolio: `https://yourportfolio.com`
   - CV URL: `https://drive.google.com/file/...`
   - Location: "San Francisco, CA"
   - Website: `https://yourname.com`
   - Twitter: `https://twitter.com/yourusername`
   - Experience: `5` years
   - Availability: Select status
5. Add skills: Type "React" → Enter, Type "Python" → Enter
6. Click "Update Profile"
7. ✅ Verify success message

### Test 5: View Public Profile (2 minutes)
1. Go to `/users/{your-user-id}` (from profile URL or leaderboard)
2. Verify all portfolio links are visible
3. Click each link to verify they open
4. Check skills are displayed as badges
5. Verify location and experience are shown
6. Check availability status indicator

### Test 6: Profile Links from Leaderboard (2 minutes)
1. Go to `/leaderboard` or any challenge leaderboard
2. Click on a builder's name or avatar
3. ✅ Should navigate to their public profile
4. Verify all portfolio information is displayed

## 🐛 Troubleshooting

### Emails Not Sending?
1. Check Resend dashboard: https://resend.com/emails
2. Verify API key is correct: `.env.local`
3. Check console for errors: `npm run dev`
4. Verify sender domain is configured in Resend

### Profile Not Saving?
1. Check browser console for errors
2. Verify Supabase connection
3. Check network tab in DevTools
4. Try signing out and back in

### Links Not Working in Emails?
1. Check `NEXT_PUBLIC_BASE_URL` in `.env.local`
2. Verify URL format in email HTML
3. Test URLs manually in browser
4. Check for HTTPS/HTTP mismatch

## 📊 Expected Results

### Email Notifications
- ✅ Submission confirmation: < 5 seconds
- ✅ Score update: < 10 seconds after evaluation
- ✅ Manual review score: < 5 seconds after review
- ✅ Badge notification: < 5 seconds after earning

### Profile Features
- ✅ Profile updates: < 1 second
- ✅ Public profile loads: < 2 seconds
- ✅ All portfolio links work
- ✅ Skills display correctly
- ✅ Availability status shows

## 🎯 Key Files to Review

- Email Client: `lib/email/client.ts`
- Email Templates: `lib/email/templates.ts`
- Profile Page: `app/profile/page.tsx`
- Public Profile: `app/users/[id]/page.tsx`
- Evaluation API: `app/api/evaluate/route.ts`
- Manual Review API: `app/api/manual-review/route.ts`

## 🚨 Known Issues to Watch

1. **Resend Rate Limits:** Free tier = 3,000 emails/month
2. **Supabase Connection:** May need to restart if connection drops
3. **Hot Reload:** May need hard refresh (Ctrl+Shift+R) after changes
4. **Authentication:** Session may expire, sign in again if needed

## 📝 Test Data Examples

### Test Submission Data:
```json
{
  "repo_url": "https://github.com/test/test-project",
  "deck_url": "https://example.com/deck.pdf",
  "video_url": "https://youtube.com/watch?v=abc123",
  "summary": "Test AI project submission for testing email notifications"
}
```

### Test Profile Data:
```json
{
  "bio": "AI engineer passionate about building innovative solutions",
  "linkedin_url": "https://linkedin.com/in/testuser",
  "portfolio_url": "https://testuser.dev",
  "cv_url": "https://drive.google.com/file/xyz",
  "location": "San Francisco, CA",
  "website_url": "https://testuser.com",
  "twitter_url": "https://twitter.com/testuser",
  "experience_years": 5,
  "availability_status": "available",
  "skills": ["React", "Python", "AI/ML", "TypeScript"]
}
```

## ✨ Success Criteria

✅ All email templates render correctly  
✅ Email links navigate to correct pages  
✅ Profile portfolio fields save and display  
✅ Skills can be added/removed dynamically  
✅ Public profiles show all portfolio links  
✅ Availability status updates correctly  
✅ Experience years display accurately  
✅ No console errors during testing

**Ready to test? Run `npm install && npm run dev` and follow the scenarios above!**
