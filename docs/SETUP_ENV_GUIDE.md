# Environment Variables Setup Guide

## Quick Setup for Email Notifications

### Step 1: Create `.env.local` file

Create a file named `.env.local` in the root directory with the following content:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Groq AI Configuration
GROQ_API_KEY=your_groq_api_key_here

# Resend Email Configuration
RESEND_API_KEY=your_resend_api_key_here

# Base URL for email links
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Step 2: Restart Development Server

After creating `.env.local`:

1. **Stop the current server** (if running): Press `Ctrl+C` in the terminal
2. **Start the server again:**
   ```bash
   npm run dev
   ```
3. **Wait for** "Ready on http://localhost:3000"

### Step 3: Test Email Notifications

#### Option A: Trigger via Browser Console

1. Open http://localhost:3000
2. Open browser console (F12)
3. Run this command:

```javascript
fetch('http://localhost:3000/api/evaluate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    submissionId: '0ceaa8ba-71f8-498f-b764-be07242b8201' 
  })
})
.then(r => r.json())
.then(data => {
  console.log('Evaluation result:', data);
  alert('Evaluation started! Check your email in 30-60 seconds.');
})
.catch(error => {
  console.error('Error:', error);
  alert('Failed to trigger evaluation');
});
```

#### Option B: Create New Submission

1. Go to http://localhost:3000/challenges
2. Select any challenge
3. Click "Submit Project"
4. Fill in the form and submit
5. Wait 30-60 seconds for evaluation
6. Check email at allands365@gmail.com

### Step 4: Verify Email Delivery

Check your email at **allands365@gmail.com** for:

✅ Subject: "✅ Your Score for Personal AI Learning Tutor is Ready!"
✅ Professional HTML formatting
✅ Your username in the greeting
✅ Score displayed (0-100)
✅ Links to view challenge and submission
✅ Responsive design

## What Happens Next

1. **Email Sent** → Check allands365@gmail.com inbox
2. **Links Work** → Click "View Challenge" and "View Submission"
3. **Score Displayed** → Shows your submission score
4. **HTML Renders** → Professional styling on all devices

## Troubleshooting

### If Email Not Received:
1. Check spam/junk folder
2. Verify RESEND_API_KEY is correct
3. Check Resend dashboard: https://resend.com/emails
4. Look for console errors in terminal

### If 500 Error:
1. Verify all environment variables are set
2. Restart development server
3. Check terminal for error messages
4. Verify RESEND_API_KEY is valid

### If Submission Not Evaluated:
1. Wait 30-60 seconds
2. Refresh submission page
3. Check Groq API key is set
4. Verify GROQ_API_KEY is valid

## Current Status

✅ Resend API key provided  
⏳ Need to create `.env.local` file  
⏳ Need to restart server  
⏳ Email notification ready to test  

---

**Your Resend API Key:**
```
re_GmKZB1H1_CFgB3UAkfD5bSycxp9f7rYsr
```

**Test Submission ID:**
```
0ceaa8ba-71f8-498f-b764-be07242b8201
```

**Email Recipient:**
```
allands365@gmail.com
```

Ready to test once you add the API key to `.env.local` and restart the server!
