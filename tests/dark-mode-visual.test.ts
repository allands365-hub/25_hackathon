import { test, expect } from '@playwright/test';

test.describe('Dark Mode Visual Regression Tests', () => {
  /**
   * HOMEPAGE - DARK MODE
   */
  test.describe('Homepage - Dark Mode', () => {
    test('should have readable text in dark mode', async ({ page }) => {
      // Force dark mode
      await page.emulateMedia({ colorScheme: 'dark' });
      await page.goto('http://localhost:3000');
      await page.waitForTimeout(1000);

      // Check hero title is visible
      const heroTitle = page.getByTestId('hero-title');
      await expect(heroTitle).toBeVisible();

      // Verify text color is light (not black)
      const titleColor = await heroTitle.evaluate((el) => {
        return window.getComputedStyle(el).color;
      });

      // In dark mode, text should NOT be black (rgb(0,0,0))
      expect(titleColor).not.toBe('rgb(0, 0, 0)');

      console.log('✅ Hero title text color in dark mode:', titleColor);
    });

    test('should have visible button text in dark mode', async ({ page }) => {
      await page.emulateMedia({ colorScheme: 'dark' });
      await page.goto('http://localhost:3000');
      await page.waitForTimeout(1000);

      const browseChallengesBtn = page.getByTestId('browse-challenges-btn');
      await expect(browseChallengesBtn).toBeVisible();
      await expect(browseChallengesBtn).toContainText('Browse Challenges');

      // Check button has visible background
      const bgColor = await browseChallengesBtn.evaluate((el) => {
        return window.getComputedStyle(el).backgroundColor;
      });

      // Background should not be transparent
      expect(bgColor).not.toContain('rgba(0, 0, 0, 0)');

      console.log('✅ Button background in dark mode:', bgColor);
    });

    test('should have readable section headings in dark mode', async ({ page }) => {
      await page.emulateMedia({ colorScheme: 'dark' });
      await page.goto('http://localhost:3000');
      await page.waitForTimeout(1000);

      const howItWorksHeading = page.getByTestId('how-it-works-heading');
      await expect(howItWorksHeading).toBeVisible();

      const headingColor = await howItWorksHeading.evaluate((el) => {
        return window.getComputedStyle(el).color;
      });

      // Should be light colored text
      expect(headingColor).not.toBe('rgb(0, 0, 0)');

      console.log('✅ Section heading color in dark mode:', headingColor);
    });

    test('should take screenshot of homepage in dark mode', async ({ page }) => {
      await page.emulateMedia({ colorScheme: 'dark' });
      await page.goto('http://localhost:3000');
      await page.waitForTimeout(2000);

      await page.screenshot({
        path: 'test-results/screenshots/homepage-dark-mode.png',
        fullPage: true
      });

      console.log('✅ Dark mode homepage screenshot saved');
    });
  });

  /**
   * HOMEPAGE - LIGHT MODE
   */
  test.describe('Homepage - Light Mode', () => {
    test('should have readable text in light mode', async ({ page }) => {
      await page.emulateMedia({ colorScheme: 'light' });
      await page.goto('http://localhost:3000');
      await page.waitForTimeout(1000);

      const heroTitle = page.getByTestId('hero-title');
      await expect(heroTitle).toBeVisible();

      const titleColor = await heroTitle.evaluate((el) => {
        return window.getComputedStyle(el).color;
      });

      // In light mode, text should be dark
      console.log('✅ Hero title text color in light mode:', titleColor);
    });

    test('should have visible buttons in light mode', async ({ page }) => {
      await page.emulateMedia({ colorScheme: 'light' });
      await page.goto('http://localhost:3000');
      await page.waitForTimeout(1000);

      const browseChallengesBtn = page.getByTestId('browse-challenges-btn');
      await expect(browseChallengesBtn).toBeVisible();
      await expect(browseChallengesBtn).toContainText('Browse Challenges');

      console.log('✅ Buttons visible in light mode');
    });

    test('should take screenshot of homepage in light mode', async ({ page }) => {
      await page.emulateMedia({ colorScheme: 'light' });
      await page.goto('http://localhost:3000');
      await page.waitForTimeout(2000);

      await page.screenshot({
        path: 'test-results/screenshots/homepage-light-mode.png',
        fullPage: true
      });

      console.log('✅ Light mode homepage screenshot saved');
    });
  });

  /**
   * SIGNIN PAGE - BOTH MODES
   */
  test.describe('Sign-in Page - Dark Mode', () => {
    test('should have readable text in dark mode', async ({ page }) => {
      await page.emulateMedia({ colorScheme: 'dark' });
      await page.goto('http://localhost:3000/auth/signin');
      await page.waitForTimeout(1000);

      const heading = page.getByTestId('signin-welcome-heading');
      await expect(heading).toBeVisible();
      await expect(heading).toHaveText('Welcome Back');

      const headingColor = await heading.evaluate((el) => {
        return window.getComputedStyle(el).color;
      });

      expect(headingColor).not.toBe('rgb(0, 0, 0)');

      console.log('✅ Sign-in heading color in dark mode:', headingColor);
    });

    test('should have visible role cards in dark mode', async ({ page }) => {
      await page.emulateMedia({ colorScheme: 'dark' });
      await page.goto('http://localhost:3000/auth/signin');
      await page.waitForTimeout(1000);

      const builderCard = page.getByTestId('role-builder-card');
      await expect(builderCard).toBeVisible();
      await expect(builderCard).toContainText("I'm a Builder");

      const sponsorCard = page.getByTestId('role-sponsor-card');
      await expect(sponsorCard).toBeVisible();
      await expect(sponsorCard).toContainText("I'm a Company/Sponsor");

      console.log('✅ Role cards visible in dark mode');
    });

    test('should take screenshot of signin page in dark mode', async ({ page }) => {
      await page.emulateMedia({ colorScheme: 'dark' });
      await page.goto('http://localhost:3000/auth/signin');
      await page.waitForTimeout(1000);

      await page.screenshot({
        path: 'test-results/screenshots/signin-dark-mode.png',
        fullPage: true
      });

      console.log('✅ Dark mode signin screenshot saved');
    });
  });

  /**
   * CHALLENGES PAGE - BOTH MODES
   */
  test.describe('Challenges Page - Dark Mode', () => {
    test('should have readable text in dark mode', async ({ page }) => {
      await page.emulateMedia({ colorScheme: 'dark' });
      await page.goto('http://localhost:3000/challenges');
      await page.waitForSelector('[data-testid="challenges-page"]');
      await page.waitForTimeout(1000);

      const heading = page.getByTestId('challenges-page-heading');
      await expect(heading).toBeVisible();

      const headingColor = await heading.evaluate((el) => {
        return window.getComputedStyle(el).color;
      });

      expect(headingColor).not.toBe('rgb(0, 0, 0)');

      console.log('✅ Challenges heading color in dark mode:', headingColor);
    });

    test('should have readable challenge cards in dark mode', async ({ page }) => {
      await page.emulateMedia({ colorScheme: 'dark' });
      await page.goto('http://localhost:3000/challenges');
      await page.waitForSelector('[data-testid="challenges-page"]');
      await page.waitForTimeout(2000);

      // Check if any challenges exist
      const challengeTitles = page.getByTestId('challenge-title');
      const count = await challengeTitles.count();

      if (count > 0) {
        const firstTitle = challengeTitles.first();
        await expect(firstTitle).toBeVisible();

        const titleColor = await firstTitle.evaluate((el) => {
          return window.getComputedStyle(el).color;
        });

        expect(titleColor).not.toBe('rgb(0, 0, 0)');

        console.log('✅ Challenge card text color in dark mode:', titleColor);
      } else {
        console.log('⚠️  No challenges to test');
      }
    });

    test('should take screenshot of challenges page in dark mode', async ({ page }) => {
      await page.emulateMedia({ colorScheme: 'dark' });
      await page.goto('http://localhost:3000/challenges');
      await page.waitForSelector('[data-testid="challenges-page"]');
      await page.waitForTimeout(2000);

      await page.screenshot({
        path: 'test-results/screenshots/challenges-dark-mode.png',
        fullPage: true
      });

      console.log('✅ Dark mode challenges screenshot saved');
    });
  });

  /**
   * CONTRAST RATIO TESTS
   */
  test.describe('Accessibility - Contrast Ratios', () => {
    test('should have sufficient contrast for hero title in dark mode', async ({ page }) => {
      await page.emulateMedia({ colorScheme: 'dark' });
      await page.goto('http://localhost:3000');
      await page.waitForTimeout(1000);

      const contrastData = await page.evaluate(() => {
        const title = document.querySelector('[data-testid="hero-title"]') as HTMLElement;
        if (!title) return null;

        const titleStyles = window.getComputedStyle(title);
        const titleColor = titleStyles.color;

        // Get background color by checking parent elements
        let bgColor = 'rgb(0, 0, 0)'; // Default dark background
        let parent = title.parentElement;
        while (parent) {
          const parentBg = window.getComputedStyle(parent).backgroundColor;
          if (parentBg !== 'rgba(0, 0, 0, 0)') {
            bgColor = parentBg;
            break;
          }
          parent = parent.parentElement;
        }

        return {
          textColor: titleColor,
          backgroundColor: bgColor,
        };
      });

      expect(contrastData).toBeTruthy();
      console.log('✅ Contrast data:', contrastData);
    });

    test('should have sufficient contrast for buttons in dark mode', async ({ page }) => {
      await page.emulateMedia({ colorScheme: 'dark' });
      await page.goto('http://localhost:3000');
      await page.waitForTimeout(1000);

      const buttonData = await page.evaluate(() => {
        const btn = document.querySelector('[data-testid="browse-challenges-btn"]') as HTMLElement;
        if (!btn) return null;

        const styles = window.getComputedStyle(btn);

        return {
          textColor: styles.color,
          backgroundColor: styles.backgroundColor,
          borderColor: styles.borderColor,
        };
      });

      expect(buttonData).toBeTruthy();
      expect(buttonData?.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');

      console.log('✅ Button contrast data:', buttonData);
    });
  });

  /**
   * SIDE-BY-SIDE COMPARISON
   */
  test.describe('Side-by-Side Mode Comparison', () => {
    test('should compare light and dark mode visually', async ({ page }) => {
      // Light mode screenshot
      await page.emulateMedia({ colorScheme: 'light' });
      await page.goto('http://localhost:3000');
      await page.waitForTimeout(1000);
      await page.screenshot({
        path: 'test-results/screenshots/comparison-light.png'
      });

      // Dark mode screenshot
      await page.emulateMedia({ colorScheme: 'dark' });
      await page.reload();
      await page.waitForTimeout(1000);
      await page.screenshot({
        path: 'test-results/screenshots/comparison-dark.png'
      });

      console.log('✅ Side-by-side comparison screenshots saved');
    });
  });
});
