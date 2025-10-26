const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  console.log('📸 Taking screenshots of all pages...\n');

  const pages = [
    { name: 'Homepage', url: 'http://localhost:3000' },
    { name: 'Signin', url: 'http://localhost:3000/auth/signin' },
    { name: 'Challenges', url: 'http://localhost:3000/challenges' },
    { name: 'Leaderboard', url: 'http://localhost:3000/leaderboard' },
  ];

  for (const pageInfo of pages) {
    console.log(`📄 ${pageInfo.name}...`);

    await page.goto(pageInfo.url);
    await page.waitForTimeout(1500);

    // Check theme
    const theme = await page.evaluate(() => {
      return {
        hasDark: document.documentElement.classList.contains('dark'),
        hasLight: document.documentElement.classList.contains('light'),
        bgColor: window.getComputedStyle(document.body).backgroundColor
      };
    });

    const filename = `screenshots/current-${pageInfo.name.toLowerCase()}.png`;
    await page.screenshot({
      path: filename,
      fullPage: true
    });

    console.log(`  ✅ ${filename}`);
    console.log(`  Theme: ${theme.hasLight ? 'LIGHT' : theme.hasDark ? 'DARK' : 'UNKNOWN'} (${theme.bgColor})`);
  }

  await browser.close();
  console.log('\n✅ All screenshots saved!');
})();
