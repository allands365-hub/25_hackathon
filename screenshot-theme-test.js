const { chromium } = require('playwright');

async function takeScreenshots() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  const pages = [
    { url: 'http://localhost:3000', name: 'home' },
    { url: 'http://localhost:3000/about', name: 'about' },
    { url: 'http://localhost:3000/auth/signin', name: 'signin' },
    { url: 'http://localhost:3000/auth/signup', name: 'signup' },
    { url: 'http://localhost:3000/challenges', name: 'challenges' },
    { url: 'http://localhost:3000/leaderboard', name: 'leaderboard' },
    { url: 'http://localhost:3000/onboarding', name: 'onboarding' },
  ];

  console.log('Taking screenshots of themed pages...\n');

  for (const pageInfo of pages) {
    try {
      console.log(`Navigating to ${pageInfo.url}...`);
      await page.goto(pageInfo.url, { waitUntil: 'networkidle', timeout: 15000 });
      await page.waitForTimeout(2000); // Wait for fonts to load

      const screenshotPath = `F:/Claude_Files/25_Hackathon/screenshots/theme-${pageInfo.name}.png`;
      await page.screenshot({ path: screenshotPath, fullPage: false });
      console.log(`✓ Screenshot saved: theme-${pageInfo.name}.png`);
    } catch (error) {
      console.log(`✗ Error capturing ${pageInfo.name}: ${error.message}`);
    }
  }

  await browser.close();
  console.log('\nScreenshots complete!');
}

takeScreenshots();
