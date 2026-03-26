import { chromium } from 'playwright';

const browser = await chromium.launch();
const sections = ['hero', 'problem', 'modules', 'howitworks', 'market', 'compliance', 'social', 'cta', 'footer'];

for (const [label, port] of [['lovable', 8080], ['rebuild', 8082]]) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`http://localhost:${port}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  // Scroll through entire page to trigger all reveals
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 300) {
      window.scrollTo(0, y);
      await new Promise(r => setTimeout(r, 100));
    }
    window.scrollTo(0, 0);
    await new Promise(r => setTimeout(r, 500));
  });

  // Hero (top of page)
  await page.screenshot({ path: `/tmp/${label}-hero.png`, clip: { x: 0, y: 0, width: 1440, height: 900 } });
  
  // Scroll to each section and screenshot
  const height = await page.evaluate(() => document.body.scrollHeight);
  const step = Math.floor(height / 9);
  
  for (let i = 1; i < sections.length; i++) {
    await page.evaluate((y) => window.scrollTo(0, y), step * i);
    await page.waitForTimeout(300);
    await page.screenshot({ path: `/tmp/${label}-${sections[i]}.png`, clip: { x: 0, y: 0, width: 1440, height: 900 } });
  }
}

await browser.close();
console.log('Section screenshots done');
