const { chromium } = require('playwright');

async function takeScreenshots() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  // Focus on the pages that had issues
  const pages = [
    { url: 'http://localhost:3002/sponsor', name: 'sponsor-AFTER' },
    { url: 'http://localhost:3002/sponsor/challenges', name: 'sponsor-challenges-AFTER' },
  ];

  console.log('Taking AFTER-FIX screenshots...\n');

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
  console.log('\nAfter-fix screenshots complete!');
}

takeScreenshots();
