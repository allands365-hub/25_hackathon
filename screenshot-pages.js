const { chromium } = require('playwright');

async function takeScreenshots() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  const pages = [
    { url: 'http://localhost:3008', name: 'home' },
    { url: 'http://localhost:3008/about', name: 'about' },
    { url: 'http://localhost:3008/auth/signin', name: 'signin' },
    { url: 'http://localhost:3008/auth/signup', name: 'signup' },
    { url: 'http://localhost:3008/challenges', name: 'challenges' },
    { url: 'http://localhost:3008/leaderboard', name: 'leaderboard' },
    { url: 'http://localhost:3008/profile', name: 'profile' },
    { url: 'http://localhost:3008/sponsor', name: 'sponsor' },
    { url: 'http://localhost:3008/sponsor/challenges', name: 'sponsor-challenges' },
  ];

  console.log('Taking screenshots...\n');

  for (const pageInfo of pages) {
    try {
      console.log(`Navigating to ${pageInfo.url}...`);
      await page.goto(pageInfo.url, { waitUntil: 'networkidle', timeout: 10000 });
      await page.waitForTimeout(1000); // Wait for any animations

      const screenshotPath = `F:/Claude_Files/25_Hackathon/screenshots/${pageInfo.name}.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true });
      console.log(`✓ Screenshot saved: ${pageInfo.name}.png`);
    } catch (error) {
      console.log(`✗ Error capturing ${pageInfo.name}: ${error.message}`);
    }
  }

  await browser.close();
  console.log('\nScreenshots complete!');
}

takeScreenshots();
