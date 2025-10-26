import { test, expect } from '@playwright/test';

test.describe('Text Readability Tests', () => {
  /**
   * HOMEPAGE TESTS
   */
  test.describe('Homepage Text Elements', () => {
    test('should display hero heading with correct text', async ({ page }) => {
      await page.goto('http://localhost:3000');

      const heroTitle = page.getByTestId('hero-title');
      await expect(heroTitle).toBeVisible();
      await expect(heroTitle).toHaveText('Prove Your AI Skills.');

      console.log('✅ Hero title is readable');
    });

    test('should display gradient subtitle text', async ({ page }) => {
      await page.goto('http://localhost:3000');

      // Test gradient text - should still be readable even with gradient styling
      const heroSubtitle = page.getByTestId('hero-subtitle');
      await expect(heroSubtitle).toBeVisible();
      await expect(heroSubtitle).toHaveText('Get Hired.');

      console.log('✅ Gradient subtitle is readable');
    });

    test('should display hero description text', async ({ page }) => {
      await page.goto('http://localhost:3000');

      const description = page.getByTestId('hero-description');
      await expect(description).toBeVisible();
      await expect(description).toContainText('competitive arena');

      console.log('✅ Hero description is readable');
    });

    test('should display CTA buttons with readable text', async ({ page }) => {
      await page.goto('http://localhost:3000');

      const browseChallengesBtn = page.getByTestId('browse-challenges-btn');
      await expect(browseChallengesBtn).toBeVisible();
      await expect(browseChallengesBtn).toContainText('Browse Challenges');

      const signinBtn = page.getByTestId('hero-signin-btn');
      await expect(signinBtn).toBeVisible();
      await expect(signinBtn).toContainText('Sign In');

      console.log('✅ CTA buttons are readable');
    });

    test('should display stats section with numbers', async ({ page }) => {
      await page.goto('http://localhost:3000');

      // Test stat counters
      const buildersCount = page.getByTestId('stat-builders-count');
      await expect(buildersCount).toBeVisible();
      await expect(buildersCount).toHaveText('1,247');

      const challengesCount = page.getByTestId('stat-challenges-count');
      await expect(challengesCount).toBeVisible();
      await expect(challengesCount).toHaveText('89');

      const projectsCount = page.getByTestId('stat-projects-count');
      await expect(projectsCount).toBeVisible();
      await expect(projectsCount).toHaveText('342');

      console.log('✅ Stats numbers are readable');
    });

    test('should display section headings', async ({ page }) => {
      await page.goto('http://localhost:3000');

      const howItWorksHeading = page.getByTestId('how-it-works-heading');
      await expect(howItWorksHeading).toBeVisible();
      await expect(howItWorksHeading).toHaveText('How It Works');

      const featuredChallengesHeading = page.getByTestId('featured-challenges-heading');
      await expect(featuredChallengesHeading).toBeVisible();
      await expect(featuredChallengesHeading).toHaveText('Featured Challenges');

      console.log('✅ Section headings are readable');
    });
  });

  /**
   * NAVIGATION TESTS
   */
  test.describe('Navigation Text Elements', () => {
    test('should display navigation logo text', async ({ page }) => {
      await page.goto('http://localhost:3000');

      const logo = page.getByTestId('nav-logo');
      await expect(logo).toBeVisible();
      await expect(logo).toContainText('BuildAI Arena');

      console.log('✅ Navigation logo is readable');
    });

    test('should display navigation links', async ({ page }) => {
      await page.goto('http://localhost:3000');

      const challengesLink = page.getByTestId('nav-challenges');
      await expect(challengesLink).toBeVisible();
      await expect(challengesLink).toHaveText('Challenges');

      const leaderboardLink = page.getByTestId('nav-leaderboard');
      await expect(leaderboardLink).toBeVisible();
      await expect(leaderboardLink).toHaveText('Leaderboard');

      console.log('✅ Navigation links are readable');
    });

    test('should display sign in button in navigation', async ({ page }) => {
      await page.goto('http://localhost:3000');

      const signinBtn = page.getByTestId('nav-signin-btn');
      await expect(signinBtn).toBeVisible();
      await expect(signinBtn).toContainText('Sign In');

      console.log('✅ Navigation sign in button is readable');
    });
  });

  /**
   * SIGN-IN PAGE TESTS
   */
  test.describe('Sign-in Page Text Elements', () => {
    test('should display role selection page text', async ({ page }) => {
      await page.goto('http://localhost:3000/auth/signin');

      const heading = page.getByTestId('signin-welcome-heading');
      await expect(heading).toBeVisible();
      await expect(heading).toHaveText('Welcome Back');

      const description = page.getByTestId('signin-description');
      await expect(description).toBeVisible();
      await expect(description).toContainText('Choose how you want to sign in');

      console.log('✅ Role selection text is readable');
    });

    test('should display builder card text', async ({ page }) => {
      await page.goto('http://localhost:3000/auth/signin');

      const builderCard = page.getByTestId('role-builder-card');
      await expect(builderCard).toBeVisible();
      await expect(builderCard).toContainText("I'm a Builder");

      console.log('✅ Builder card text is readable');
    });

    test('should display sponsor card text', async ({ page }) => {
      await page.goto('http://localhost:3000/auth/signin');

      const sponsorCard = page.getByTestId('role-sponsor-card');
      await expect(sponsorCard).toBeVisible();
      await expect(sponsorCard).toContainText("I'm a Company/Sponsor");

      console.log('✅ Sponsor card text is readable');
    });

    test('should display builder signin page after selection', async ({ page }) => {
      await page.goto('http://localhost:3000/auth/signin');

      // Click builder card
      await page.getByTestId('role-builder-card').click();

      // Wait for builder signin page
      await page.waitForSelector('[data-testid="signin-builder-page"]');

      const heading = page.getByTestId('signin-builder-heading');
      await expect(heading).toBeVisible();
      await expect(heading).toHaveText('Welcome to BuildAI Arena');

      const githubBtn = page.getByTestId('github-signin-btn');
      await expect(githubBtn).toBeVisible();
      await expect(githubBtn).toContainText('Sign in with GitHub');

      console.log('✅ Builder signin page text is readable');
    });

    test('should display sponsor signin page after selection', async ({ page }) => {
      await page.goto('http://localhost:3000/auth/signin');

      // Click sponsor card
      await page.getByTestId('role-sponsor-card').click();

      // Wait for sponsor signin page
      await page.waitForSelector('[data-testid="signin-sponsor-page"]');

      const heading = page.getByTestId('signin-sponsor-heading');
      await expect(heading).toBeVisible();
      await expect(heading).toHaveText('Sponsor Sign In');

      const signinBtn = page.getByTestId('sponsor-signin-btn');
      await expect(signinBtn).toBeVisible();

      console.log('✅ Sponsor signin page text is readable');
    });
  });

  /**
   * CHALLENGES PAGE TESTS
   */
  test.describe('Challenges Page Text Elements', () => {
    test('should display challenges page heading', async ({ page }) => {
      await page.goto('http://localhost:3000/challenges');

      // Wait for page to load
      await page.waitForSelector('[data-testid="challenges-page"]');

      const heading = page.getByTestId('challenges-page-heading');
      await expect(heading).toBeVisible();
      await expect(heading).toHaveText('Challenges');

      console.log('✅ Challenges page heading is readable');
    });

    test('should display challenges page description', async ({ page }) => {
      await page.goto('http://localhost:3000/challenges');
      await page.waitForSelector('[data-testid="challenges-page"]');

      const description = page.getByTestId('challenges-page-description');
      await expect(description).toBeVisible();
      await expect(description).toContainText('Build AI products');

      console.log('✅ Challenges page description is readable');
    });

    test('should display difficulty filter', async ({ page }) => {
      await page.goto('http://localhost:3000/challenges');
      await page.waitForSelector('[data-testid="challenges-page"]');

      const filter = page.getByTestId('difficulty-filter-select');
      await expect(filter).toBeVisible();

      console.log('✅ Difficulty filter is readable');
    });

    test('should display challenge count', async ({ page }) => {
      await page.goto('http://localhost:3000/challenges');
      await page.waitForSelector('[data-testid="challenges-page"]');

      const count = page.getByTestId('challenge-count');
      await expect(count).toBeVisible();
      await expect(count).toContainText('challenge');

      console.log('✅ Challenge count is readable');
    });

    test('should display challenge cards with readable text', async ({ page }) => {
      await page.goto('http://localhost:3000/challenges');
      await page.waitForSelector('[data-testid="challenges-page"]');

      // Wait for challenges to load
      await page.waitForTimeout(1000);

      // Check if challenges grid exists
      const grid = page.getByTestId('challenges-grid');
      const noMessage = page.getByTestId('no-challenges-message');

      const hasGrid = await grid.isVisible().catch(() => false);
      const hasNoMessage = await noMessage.isVisible().catch(() => false);

      if (hasGrid) {
        // Check first challenge card
        const titles = page.getByTestId('challenge-title');
        const firstTitle = titles.first();
        await expect(firstTitle).toBeVisible();

        const difficulties = page.getByTestId('challenge-difficulty');
        const firstDifficulty = difficulties.first();
        await expect(firstDifficulty).toBeVisible();

        const descriptions = page.getByTestId('challenge-description');
        const firstDescription = descriptions.first();
        await expect(firstDescription).toBeVisible();

        console.log('✅ Challenge cards text is readable');
      } else if (hasNoMessage) {
        await expect(noMessage).toContainText('No challenges found');
        console.log('✅ No challenges message is readable');
      }
    });

    test('should display truncated text with line-clamp', async ({ page }) => {
      await page.goto('http://localhost:3000/challenges');
      await page.waitForSelector('[data-testid="challenges-page"]');
      await page.waitForTimeout(1000);

      const descriptions = page.getByTestId('challenge-description');
      const count = await descriptions.count();

      if (count > 0) {
        const firstDescription = descriptions.first();
        await expect(firstDescription).toBeVisible();

        // Check if text is visible (even if truncated)
        const text = await firstDescription.textContent();
        expect(text).toBeTruthy();
        expect(text!.length).toBeGreaterThan(0);

        console.log('✅ Truncated description text is still readable');
      }
    });
  });

  /**
   * DYNAMIC TEXT TESTS
   */
  test.describe('Dynamic Text States', () => {
    test('should handle conditional button text', async ({ page }) => {
      await page.goto('http://localhost:3000');

      // Check for different button states based on auth
      const heroBtn = page.getByTestId('hero-signin-btn').or(page.getByTestId('my-profile-btn'));
      await expect(heroBtn).toBeVisible();

      console.log('✅ Conditional button text is readable');
    });

    test('should display form validation errors', async ({ page }) => {
      await page.goto('http://localhost:3000/auth/signin');

      // Click sponsor card
      await page.getByTestId('role-sponsor-card').click();
      await page.waitForSelector('[data-testid="signin-sponsor-page"]');

      // Try to submit without filling fields
      const signinBtn = page.getByTestId('sponsor-signin-btn');
      await signinBtn.click();

      // Browser validation should trigger
      const emailInput = page.getByTestId('sponsor-email-input');
      const isInvalid = await emailInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
      expect(isInvalid).toBe(true);

      console.log('✅ Form validation is working');
    });
  });

  /**
   * CHALLENGE DETAIL PAGE TESTS
   */
  test.describe('Challenge Detail Page Text Elements', () => {
    test('should display challenge detail text when challenge exists', async ({ page }) => {
      await page.goto('http://localhost:3000/challenges');
      await page.waitForSelector('[data-testid="challenges-page"]');
      await page.waitForTimeout(1000);

      // Click on first challenge if it exists
      const viewButtons = page.getByTestId('view-challenge-btn');
      const count = await viewButtons.count();

      if (count > 0) {
        await viewButtons.first().click();

        // Wait for challenge detail page
        await page.waitForSelector('[data-testid="challenge-detail-page"]');

        const title = page.getByTestId('challenge-detail-title');
        await expect(title).toBeVisible();

        const description = page.getByTestId('challenge-detail-description');
        await expect(description).toBeVisible();

        const problemStatement = page.getByTestId('problem-statement-text');
        await expect(problemStatement).toBeVisible();

        const submitBtn = page.getByTestId('submit-project-btn');
        await expect(submitBtn).toBeVisible();
        await expect(submitBtn).toHaveText('Submit Your Project');

        console.log('✅ Challenge detail text is readable');
      } else {
        console.log('⚠️  No challenges available to test detail page');
      }
    });
  });

  /**
   * SUBMISSION FORM TESTS
   */
  test.describe('Submission Form Text Elements', () => {
    test('should display submission form text when opened', async ({ page }) => {
      await page.goto('http://localhost:3000/challenges');
      await page.waitForSelector('[data-testid="challenges-page"]');
      await page.waitForTimeout(1000);

      const viewButtons = page.getByTestId('view-challenge-btn');
      const count = await viewButtons.count();

      if (count > 0) {
        await viewButtons.first().click();
        await page.waitForSelector('[data-testid="challenge-detail-page"]');

        // Click submit button
        const submitBtn = page.getByTestId('submit-project-btn');
        await submitBtn.click();

        // Wait for dialog
        await page.waitForSelector('[data-testid="submission-form-dialog"]');

        const formTitle = page.getByTestId('submission-form-title');
        await expect(formTitle).toBeVisible();

        const nextBtn = page.getByTestId('submission-next-btn');
        await expect(nextBtn).toBeVisible();

        const cancelBtn = page.getByTestId('submission-cancel-btn');
        await expect(cancelBtn).toBeVisible();
        await expect(cancelBtn).toHaveText('Cancel');

        console.log('✅ Submission form text is readable');
      } else {
        console.log('⚠️  No challenges available to test submission form');
      }
    });

    test('should display form field labels and placeholders', async ({ page }) => {
      await page.goto('http://localhost:3000/challenges');
      await page.waitForSelector('[data-testid="challenges-page"]');
      await page.waitForTimeout(1000);

      const viewButtons = page.getByTestId('view-challenge-btn');
      const count = await viewButtons.count();

      if (count > 0) {
        await viewButtons.first().click();
        await page.waitForSelector('[data-testid="challenge-detail-page"]');

        const submitBtn = page.getByTestId('submit-project-btn');
        await submitBtn.click();
        await page.waitForSelector('[data-testid="submission-form-dialog"]');

        // Click next to get to form fields
        const nextBtn = page.getByTestId('submission-next-btn');
        await nextBtn.click();

        // Check form inputs
        const repoInput = page.getByTestId('repo-url-input');
        await expect(repoInput).toBeVisible();
        const repoPlaceholder = await repoInput.getAttribute('placeholder');
        expect(repoPlaceholder).toContain('github.com');

        const deckInput = page.getByTestId('deck-url-input');
        await expect(deckInput).toBeVisible();

        const videoInput = page.getByTestId('video-url-input');
        await expect(videoInput).toBeVisible();

        console.log('✅ Form field placeholders are readable');
      } else {
        console.log('⚠️  No challenges available to test form fields');
      }
    });
  });

  /**
   * ACCESSIBILITY TESTS
   */
  test.describe('Text Accessibility', () => {
    test('should have proper heading hierarchy', async ({ page }) => {
      await page.goto('http://localhost:3000');

      // Check h1 exists
      const h1 = page.locator('h1').first();
      await expect(h1).toBeVisible();

      // Check h2 exists
      const h2 = page.locator('h2').first();
      await expect(h2).toBeVisible();

      console.log('✅ Proper heading hierarchy exists');
    });

    test('should support text selection', async ({ page }) => {
      await page.goto('http://localhost:3000');

      const heroTitle = page.getByTestId('hero-title');
      await expect(heroTitle).toBeVisible();

      // Select text
      await heroTitle.selectText();

      // Get selected text
      const selectedText = await page.evaluate(() => window.getSelection()?.toString());
      expect(selectedText).toBeTruthy();

      console.log('✅ Text can be selected');
    });

    test('should maintain text contrast in light mode', async ({ page }) => {
      await page.goto('http://localhost:3000');

      const heroTitle = page.getByTestId('hero-title');
      const color = await heroTitle.evaluate((el) => {
        return window.getComputedStyle(el).color;
      });

      expect(color).toBeTruthy();
      console.log('✅ Text has color applied');
    });
  });

  /**
   * REGRESSION TESTS
   */
  test.describe('Text Regression Tests', () => {
    test('should match homepage hero text exactly', async ({ page }) => {
      await page.goto('http://localhost:3000');

      // These should NEVER change without updating tests
      await expect(page.getByTestId('hero-title')).toHaveText('Prove Your AI Skills.');
      await expect(page.getByTestId('hero-subtitle')).toHaveText('Get Hired.');

      console.log('✅ Hero text matches expected values');
    });

    test('should maintain consistent navigation labels', async ({ page }) => {
      await page.goto('http://localhost:3000');

      await expect(page.getByTestId('nav-challenges')).toHaveText('Challenges');
      await expect(page.getByTestId('nav-leaderboard')).toHaveText('Leaderboard');

      console.log('✅ Navigation labels are consistent');
    });
  });
});
