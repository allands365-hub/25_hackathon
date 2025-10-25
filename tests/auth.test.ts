import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should load homepage', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Check if homepage loaded
    await expect(page.locator('text=Build AI Products')).toBeVisible();
    await expect(page.locator('text=Get Hired')).toBeVisible();

    console.log('✅ Homepage loaded successfully');
  });

  test('should have sign in button', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Check for sign in button
    const signInButton = page.locator('text=Sign In').first();
    await expect(signInButton).toBeVisible();

    console.log('✅ Sign in button found');
  });

  test('should navigate to sign in page', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Click sign in
    await page.click('text=Sign In');

    // Wait for navigation
    await page.waitForURL('**/auth/signin');

    // Check sign in page
    await expect(page.locator('text=Welcome to BuildAI Arena')).toBeVisible();
    await expect(page.locator('text=Sign in with GitHub')).toBeVisible();

    console.log('✅ Sign in page loaded');
  });

  test('should show GitHub OAuth flow when clicking sign in', async ({ page, context }) => {
    await page.goto('http://localhost:3000/auth/signin');

    // Listen for console errors
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // Listen for popup (GitHub OAuth opens in popup or redirect)
    const popupPromise = context.waitForEvent('page', { timeout: 5000 }).catch(() => null);

    // Click GitHub sign in button
    await page.click('text=Sign in with GitHub');

    // Wait a bit for any errors
    await page.waitForTimeout(2000);

    // Check for errors
    if (errors.length > 0) {
      console.log('❌ Errors found:', errors);
    } else {
      console.log('✅ No immediate errors');
    }

    // Check if we got redirected
    const currentUrl = page.url();
    console.log('Current URL:', currentUrl);

    // Check for popup
    const popup = await popupPromise;
    if (popup) {
      console.log('✅ Popup opened:', popup.url());
    } else {
      console.log('ℹ️  No popup (might redirect instead)');

      // Check if we were redirected to GitHub or Supabase
      if (currentUrl.includes('github.com')) {
        console.log('✅ Redirected to GitHub OAuth');
      } else if (currentUrl.includes('supabase')) {
        console.log('✅ Redirected to Supabase Auth');
      } else if (currentUrl.includes('signin')) {
        console.log('⚠️  Still on sign in page - check for errors');
      }
    }
  });

  test('should check Supabase client configuration', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Inject script to check Supabase config
    const supabaseCheck = await page.evaluate(() => {
      return {
        hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      };
    });

    console.log('Supabase config:', supabaseCheck);
  });

  test('should capture full auth flow with network logs', async ({ page }) => {
    // Enable request interception
    await page.route('**/*', route => {
      const url = route.request().url();
      if (url.includes('supabase') || url.includes('auth') || url.includes('github')) {
        console.log(`📡 ${route.request().method()} ${url}`);
      }
      route.continue();
    });

    // Listen for responses
    page.on('response', response => {
      const url = response.url();
      if (url.includes('supabase') || url.includes('auth') || url.includes('github')) {
        console.log(`📥 ${response.status()} ${url}`);
      }
    });

    await page.goto('http://localhost:3000/auth/signin');

    // Click sign in
    await page.click('text=Sign in with GitHub');

    // Wait to see network activity
    await page.waitForTimeout(3000);
  });
});
