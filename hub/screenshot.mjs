import { chromium } from 'playwright';

const browser = await chromium.launch();

// Lovable reference
const p1 = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await p1.goto('http://localhost:8080', { waitUntil: 'networkidle' });
await p1.waitForTimeout(2000);
await p1.screenshot({ path: '/tmp/lovable-desktop.png', fullPage: true });
await p1.setViewportSize({ width: 375, height: 812 });
await p1.waitForTimeout(500);
await p1.screenshot({ path: '/tmp/lovable-mobile.png', fullPage: true });

// Our rebuild
const p2 = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await p2.goto('http://localhost:8082', { waitUntil: 'networkidle' });
await p2.waitForTimeout(2000);
await p2.screenshot({ path: '/tmp/rebuild-desktop.png', fullPage: true });
await p2.setViewportSize({ width: 375, height: 812 });
await p2.waitForTimeout(500);
await p2.screenshot({ path: '/tmp/rebuild-mobile.png', fullPage: true });

await browser.close();
console.log('Done — screenshots at /tmp/lovable-*.png and /tmp/rebuild-*.png');
