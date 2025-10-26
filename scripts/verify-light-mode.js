const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  console.log('🔍 Verifying Default Theme...\n');

  // Don't set any theme - let it use the default
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(2000);

  // Check what theme is active
  const themeInfo = await page.evaluate(() => {
    const html = document.documentElement;
    const hasDarkClass = html.classList.contains('dark');
    const hasLightClass = html.classList.contains('light');
    const theme = localStorage.getItem('theme');
    const bodyBg = window.getComputedStyle(document.body).backgroundColor;

    return {
      hasDarkClass,
      hasLightClass,
      localStorageTheme: theme,
      bodyBackground: bodyBg,
      classList: Array.from(html.classList)
    };
  });

  console.log('📊 Theme Analysis:');
  console.log('  Dark class present:', themeInfo.hasDarkClass);
  console.log('  Light class present:', themeInfo.hasLightClass);
  console.log('  localStorage theme:', themeInfo.localStorageTheme);
  console.log('  Body background:', themeInfo.bodyBackground);
  console.log('  HTML classes:', themeInfo.classList.join(', '));

  // Take screenshot
  await page.screenshot({
    path: 'screenshots/default-theme-check.png',
    fullPage: true
  });
  console.log('\n📸 Screenshot saved: screenshots/default-theme-check.png');

  // Check if it's actually dark mode
  if (themeInfo.hasDarkClass || themeInfo.bodyBackground.includes('0, 0, 0')) {
    console.log('\n❌ ISSUE: App is loading in DARK mode (should be LIGHT)');
  } else {
    console.log('\n✅ SUCCESS: App is loading in LIGHT mode');
  }

  await browser.close();
})();
