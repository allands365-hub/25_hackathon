const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 } // Desktop size
  });

  console.log('📸 Taking DESKTOP screenshot...\n');

  await page.goto('http://localhost:3000');
  await page.waitForTimeout(2000);

  // Check theme
  const theme = await page.evaluate(() => {
    return {
      htmlClasses: Array.from(document.documentElement.classList),
      bodyBg: window.getComputedStyle(document.body).backgroundColor,
      bodyColor: window.getComputedStyle(document.body).color,
    };
  });

  console.log('Desktop Theme:');
  console.log('  HTML classes:', theme.htmlClasses.join(', '));
  console.log('  Body background:', theme.bodyBg);
  console.log('  Body text color:', theme.bodyColor);

  await page.screenshot({
    path: 'screenshots/desktop-homepage.png',
    fullPage: true
  });

  console.log('\n✅ Screenshot saved: screenshots/desktop-homepage.png');

  await browser.close();
})();
