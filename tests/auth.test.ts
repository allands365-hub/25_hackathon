import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should load homepage', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Check if homepage loaded using data-testid
    await expect(page.getByTestId('hero-title')).toBeVisible();
    await expect(page.getByTestId('hero-title')).toHaveText('Prove Your AI Skills.');
    await expect(page.getByTestId('hero-subtitle')).toHaveText('Get Hired.');

    console.log('✅ Homepage loaded successfully');
  });

  test('should have sign in button', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Check for sign in button using data-testid
    const signInButton = page.getByTestId('nav-signin-btn');
    await expect(signInButton).toBeVisible();

    console.log('✅ Sign in button found');
  });

  test('should navigate to sign in page', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Click sign in using data-testid
    await page.getByTestId('nav-signin-btn').click();

    // Wait for navigation
    await page.waitForURL('**/auth/signin');

    // Check sign in page using data-testid
    await expect(page.getByTestId('signin-welcome-heading')).toBeVisible();
    await expect(page.getByTestId('signin-welcome-heading')).toHaveText('Welcome Back');

    console.log('✅ Sign in page loaded');
  });

  test('should show GitHub OAuth flow when clicking sign in', async ({ page, context }) => {
    await page.goto('http://localhost:3000/auth/signin');

    // Select builder role first
    await page.getByTestId('role-builder-card').click();

    // Wait for builder signin page
    await page.waitForSelector('[data-testid="signin-builder-page"]');

    // Listen for console errors
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // Listen for popup (GitHub OAuth opens in popup or redirect)
    const popupPromise = context.waitForEvent('page', { timeout: 5000 }).catch(() => null);

    // Click GitHub sign in button using data-testid
    await page.getByTestId('github-signin-btn').click();

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

    // Select builder role
    await page.getByTestId('role-builder-card').click();
    await page.waitForSelector('[data-testid="signin-builder-page"]');

    // Click sign in using data-testid
    await page.getByTestId('github-signin-btn').click();

    // Wait to see network activity
    await page.waitForTimeout(3000);
  });

  test('should display role selection cards', async ({ page }) => {
    await page.goto('http://localhost:3000/auth/signin');

    // Check both role cards are visible
    const builderCard = page.getByTestId('role-builder-card');
    await expect(builderCard).toBeVisible();
    await expect(builderCard).toContainText("I'm a Builder");

    const sponsorCard = page.getByTestId('role-sponsor-card');
    await expect(sponsorCard).toBeVisible();
    await expect(sponsorCard).toContainText("I'm a Company/Sponsor");

    console.log('✅ Both role selection cards are visible');
  });

  test('should navigate to builder signin after role selection', async ({ page }) => {
    await page.goto('http://localhost:3000/auth/signin');

    // Click builder card
    await page.getByTestId('role-builder-card').click();

    // Check builder signin page loaded
    await expect(page.getByTestId('signin-builder-heading')).toBeVisible();
    await expect(page.getByTestId('signin-builder-heading')).toHaveText('Welcome to BuildAI Arena');

    console.log('✅ Builder signin page loaded after role selection');
  });

  test('should navigate to sponsor signin after role selection', async ({ page }) => {
    await page.goto('http://localhost:3000/auth/signin');

    // Click sponsor card
    await page.getByTestId('role-sponsor-card').click();

    // Check sponsor signin page loaded
    await expect(page.getByTestId('signin-sponsor-heading')).toBeVisible();
    await expect(page.getByTestId('signin-sponsor-heading')).toHaveText('Sponsor Sign In');

    // Check form inputs are visible
    await expect(page.getByTestId('sponsor-email-input')).toBeVisible();
    await expect(page.getByTestId('sponsor-password-input')).toBeVisible();
    await expect(page.getByTestId('sponsor-signin-btn')).toBeVisible();

    console.log('✅ Sponsor signin page loaded with form fields');
  });
});
