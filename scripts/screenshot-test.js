const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  console.log('📸 Taking screenshots of the app...');

  // Homepage
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'screenshots/homepage-fullpage.png', fullPage: true });
  console.log('✅ Homepage screenshot saved');

  // Homepage - light mode
  await page.emulateMedia({ colorScheme: 'light' });
  await page.screenshot({ path: 'screenshots/homepage-light.png', fullPage: true });
  console.log('✅ Homepage (light mode) screenshot saved');

  // Homepage - dark mode
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.screenshot({ path: 'screenshots/homepage-dark.png', fullPage: true });
  console.log('✅ Homepage (dark mode) screenshot saved');

  // Sign-in page
  await page.goto('http://localhost:3000/auth/signin');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'screenshots/signin-page.png', fullPage: true });
  console.log('✅ Sign-in page screenshot saved');

  // Challenges page
  await page.goto('http://localhost:3000/challenges');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'screenshots/challenges-page.png', fullPage: true });
  console.log('✅ Challenges page screenshot saved');

  // Check for contrast issues
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(1000);

  // Get computed styles of key elements
  const heroTitleStyles = await page.evaluate(() => {
    const element = document.querySelector('[data-testid="hero-title"]');
    if (!element) return null;
    const styles = window.getComputedStyle(element);
    return {
      color: styles.color,
      backgroundColor: styles.backgroundColor,
      fontSize: styles.fontSize,
      fontWeight: styles.fontWeight,
    };
  });

  const heroSubtitleStyles = await page.evaluate(() => {
    const element = document.querySelector('[data-testid="hero-subtitle"]');
    if (!element) return null;
    const styles = window.getComputedStyle(element);
    return {
      color: styles.color,
      backgroundColor: styles.backgroundColor,
      backgroundImage: styles.backgroundImage,
      webkitBackgroundClip: styles.webkitBackgroundClip,
      webkitTextFillColor: styles.webkitTextFillColor,
    };
  });

  console.log('\n📊 Hero Title Styles:', JSON.stringify(heroTitleStyles, null, 2));
  console.log('\n📊 Hero Subtitle Styles:', JSON.stringify(heroSubtitleStyles, null, 2));

  // Check body background
  const bodyStyles = await page.evaluate(() => {
    const body = document.body;
    const styles = window.getComputedStyle(body);
    return {
      backgroundColor: styles.backgroundColor,
      color: styles.color,
    };
  });

  console.log('\n📊 Body Styles:', JSON.stringify(bodyStyles, null, 2));

  // Check if dark mode is active
  const isDarkMode = await page.evaluate(() => {
    return document.documentElement.classList.contains('dark');
  });

  console.log('\n🌓 Dark mode active:', isDarkMode);

  await browser.close();
  console.log('\n✅ All screenshots saved to screenshots/ folder');
})();
