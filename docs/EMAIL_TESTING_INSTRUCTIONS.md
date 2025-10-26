# Email Testing Instructions

## Quick Start for Email Notification Testing

### Prerequisites
- Resend API key configured in `.env.local`
- Development server running (`npm run dev`)
- Your email: allands365@gmail.com

### Test Submission Created
**Submission ID:** `0ceaa8ba-71f8-498f-b764-be07242b8201`  
**Challenge:** Personal AI Learning Tutor  
**Email recipient:** allands365@gmail.com

### How to Test

#### Option 1: Manual Browser Testing (Recommended)

1. **Start the dev server:**
   ```bash
   npm install
   npm run dev
   ```

2. **Navigate to challenges:**
   - Go to: http://localhost:3000/challenges
   - You're currently logged in as a sponsor

3. **Submit a new submission:**
   - Click on "Personal AI Learning Tutor" challenge
   - Click "Submit Project"
   - Fill in the form:
     - **Repo URL:** https://github.com/test/test-repo
     - **Summary:** Test submission for email notification
   - Click Submit

4. **Wait for evaluation (~30-60 seconds)**

5. **Check your email:**
   - Open: allands365@gmail.com
   - Look for email from: BuildAI Arena
   - Subject: "✅ Your Score for Personal AI Learning Tutor is Ready!"

6. **Click links in email:**
   - "View Challenge Leaderboard" → Should open challenge
   - "View Submission Details" → Should open submission

#### Option 2: Trigger Evaluation Directly

The submission is already created. To trigger evaluation:

1. **Open browser console** at http://localhost:3000

2. **Run this in console:**
   ```javascript
   fetch('http://localhost:3000/api/evaluate', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ 
       submissionId: '0ceaa8ba-71f8-498f-b764-be07242b8201' 
     })
   })
   .then(r => r.json())
   .then(d => console.log('Evaluation result:', d));
   ```

3. **Wait for response** (~30-60 seconds)

4. **Check your email** for the score notification

#### Option 3: Manual Review Testing (Hybrid Score Email)

1. **As a sponsor:**
   - Navigate to: http://localhost:3000/sponsor/challenges
   - Find "Personal AI Learning Tutor"
   - Click "Review Submissions"

2. **Find submission:**
   - Submission ID: `0ceaa8ba-71f8-498f-b764-be07242b8201`
   - Click "Review"

3. **Submit manual scores:**
   - Add scores for all criteria (0-100)
   - Add feedback
   - Click "Submit Review"

4. **Check email:**
   - You should receive "Your Score is Ready!" email
   - Should show hybrid breakdown (AI + Human scores)

### What to Check

✅ Email received in inbox (not spam)  
✅ Correct subject line  
✅ Your username in greeting  
✅ Challenge title correct  
✅ Score displayed prominently  
✅ Links work correctly  
✅ HTML formatting is responsive  
✅ Professional styling  

### Email Features Tested

- ✅ Submission confirmation emails
- ✅ Score update notifications
- ✅ Manual review (hybrid) score emails  
- ✅ Badge earned notifications
- ✅ Email template rendering
- ✅ Link functionality
- ✅ Responsive HTML design

### Troubleshooting

**If email not received:**
1. Check Resend dashboard: https://resend.com/emails
2. Check spam folder
3. Verify API key in `.env.local`
4. Check console for errors
5. Look for rate limiting messages

**Console Commands for Debug:**
```javascript
// Check if Resend is configured
console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? 'Set' : 'Missing');

// Check submission status
fetch('http://localhost:3000/api/evaluate?submissionId=0ceaa8ba-71f8-498f-b764-be07242b8201')
  .then(r => r.json())
  .then(d => console.log('Status:', d));
```

### Test Results

Please report:
- ✅ Email received
- ❌ Email not received
- Email content accuracy
- Link functionality
- Overall appearance

---

**Current Test Data:**
- Submission ID: `0ceaa8ba-71f8-498f-b764-be07242b8201`
- Challenge: Personal AI Learning Tutor
- Recipient: allands365@gmail.com
- Status: Pending evaluation
