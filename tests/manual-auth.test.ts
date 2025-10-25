import { test, expect } from '@playwright/test';

test('Manual GitHub OAuth Login Test', async ({ page }) => {
  console.log('🌐 Opening browser for manual testing...\n');

  // Navigate to homepage
  await page.goto('http://localhost:3000');
  console.log('✅ Navigated to homepage');

  // Wait a bit for page to load
  await page.waitForTimeout(1000);

  // Navigate to sign in page
  await page.goto('http://localhost:3000/auth/signin');
  console.log('✅ Navigated to sign-in page');

  // Log console messages
  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('Creating user profile') ||
        text.includes('Profile created') ||
        text.includes('Error')) {
      console.log(`📝 Browser Console: ${text}`);
    }
  });

  // Log network requests to Supabase
  page.on('response', response => {
    const url = response.url();
    if (url.includes('supabase.co')) {
      console.log(`📡 ${response.status()} ${url}`);
    }
  });

  console.log('\n🔐 Please sign in with GitHub in the browser window...');
  console.log('⏳ Waiting for you to complete authentication...\n');

  // Pause here - test will wait for manual interaction
  await page.pause();

  // After user completes auth, check the result
  console.log('\n🔍 Checking authentication result...');

  const currentUrl = page.url();
  console.log(`Current URL: ${currentUrl}`);

  if (currentUrl.includes('/profile')) {
    console.log('✅ Successfully redirected to profile page!');

    // Check if profile data is loaded
    await page.waitForTimeout(2000);

    // Look for user info
    const hasUsername = await page.locator('text=/.*@.*/').count() > 0;
    const hasAvatar = await page.locator('img').count() > 0;

    console.log(`Username visible: ${hasUsername}`);
    console.log(`Avatar visible: ${hasAvatar}`);

    // Take a screenshot
    await page.screenshot({ path: 'auth-success.png', fullPage: true });
    console.log('📸 Screenshot saved: auth-success.png');

  } else if (currentUrl.includes('/auth/error')) {
    console.log('❌ Redirected to error page');
    await page.screenshot({ path: 'auth-error.png', fullPage: true });
  } else {
    console.log(`⚠️  Unexpected URL: ${currentUrl}`);
  }

  // Check database for user
  await page.waitForTimeout(2000);
  console.log('\n✅ Test complete! Check the browser and console output above.');
});
