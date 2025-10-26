const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  console.log('🔍 Comprehensive Light Mode Check...\n');

  // Force light mode
  await page.emulateMedia({ colorScheme: 'light' });
  await page.addInitScript(() => {
    localStorage.setItem('theme', 'light');
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
  });

  const pages = [
    { name: 'Homepage', url: 'http://localhost:3000' },
    { name: 'Signin', url: 'http://localhost:3000/auth/signin' },
    { name: 'Challenges', url: 'http://localhost:3000/challenges' },
  ];

  for (const pageInfo of pages) {
    console.log(`\n📄 Testing ${pageInfo.name}...`);

    await page.goto(pageInfo.url);
    await page.waitForTimeout(2000);

    // Take screenshot
    await page.screenshot({
      path: `screenshots/light-${pageInfo.name.toLowerCase()}.png`,
      fullPage: true
    });

    // Analyze
    const analysis = await page.evaluate(() => {
      const issues = [];

      // Check all visible text elements
      const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, button, a, label, div');

      elements.forEach(el => {
        if (el.offsetWidth === 0 || el.offsetHeight === 0) return;

        const text = el.textContent?.trim();
        if (!text || text.length === 0) return;

        const styles = window.getComputedStyle(el);
        const color = styles.color;
        const bgColor = styles.backgroundColor;

        // Check for white/very light text (problematic in light mode)
        const isLightText =
          color.includes('255, 255, 255') ||
          color.includes('rgb(255, 255, 255)') ||
          color.includes('oklch(0.9') ||
          color.includes('oklch(1 ');

        if (isLightText && !bgColor.includes('rgba(0, 0, 0, 0)')) {
          issues.push({
            tag: el.tagName,
            text: text.substring(0, 50),
            color: color,
            background: bgColor,
            testid: el.getAttribute('data-testid')
          });
        }
      });

      return {
        totalIssues: issues.length,
        issues: issues.slice(0, 10) // First 10 issues
      };
    });

    console.log(`  Issues found: ${analysis.totalIssues}`);
    if (analysis.issues.length > 0) {
      console.log('  Sample issues:');
      analysis.issues.forEach((issue, i) => {
        console.log(`    ${i + 1}. ${issue.tag}: "${issue.text}" (${issue.color})`);
      });
    }
  }

  await browser.close();
  console.log('\n✅ All screenshots saved to screenshots/');
})();
