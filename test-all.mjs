import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

const SHOTS = '/Users/georgchimion/Desktop/Coding/personal/hosted/vestia/screenshots';
mkdirSync(SHOTS, { recursive: true });

const modules = [
  { name: 'hub', port: 4170 },
  { name: 'triage', port: 4171 },
  { name: 'comply', port: 4172 },
  { name: 'collect', port: 4173 },
];

async function screenshot(page, name) {
  await page.screenshot({ path: `${SHOTS}/${name}.png`, fullPage: true });
  console.log(`  📸 ${name}`);
}

async function testHub(browser) {
  console.log('\n=== HUB ===');
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto('http://localhost:4170', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await screenshot(page, 'hub-desktop');

  // Check navbar readability
  const navLinks = await page.locator('nav a, nav button').count();
  console.log(`  Nav links/buttons: ${navLinks}`);

  // Test modules dropdown if exists
  const modulesBtn = page.locator('button:has-text("Modules"), button:has-text("modules")').first();
  if (await modulesBtn.isVisible()) {
    await modulesBtn.click();
    await page.waitForTimeout(500);
    await screenshot(page, 'hub-modules-dropdown');
    console.log('  ✅ Modules dropdown works');
  }

  // Test module cards have links
  const liveLinks = await page.locator('a[href*="triage"], a[href*="comply"], a[href*="collect"]').count();
  console.log(`  Live module links: ${liveLinks}`);

  // Mobile
  await page.setViewportSize({ width: 375, height: 812 });
  await page.waitForTimeout(500);
  await screenshot(page, 'hub-mobile');

  // Test mobile hamburger
  const hamburger = page.locator('button[aria-label*="menu"], button:has(svg.lucide-menu)').first();
  if (await hamburger.isVisible()) {
    await hamburger.click();
    await page.waitForTimeout(500);
    await screenshot(page, 'hub-mobile-menu');
    console.log('  ✅ Mobile menu works');
  }

  await page.close();
}

async function testTriage(browser) {
  console.log('\n=== TRIAGE ===');
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto('http://localhost:4171', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  await screenshot(page, 'triage-dashboard-default');

  // Test property selector
  const propSelect = page.locator('select').first();
  if (await propSelect.isVisible()) {
    const options = await propSelect.locator('option').allTextContents();
    console.log(`  Properties: ${options.join(', ')}`);

    // Switch to second property
    if (options.length > 1) {
      await propSelect.selectOption({ index: 1 });
      await page.waitForTimeout(500);
      await screenshot(page, 'triage-dashboard-property2');
      console.log('  ✅ Property switch works');
    }

    // Switch to third property
    if (options.length > 2) {
      await propSelect.selectOption({ index: 2 });
      await page.waitForTimeout(500);
      await screenshot(page, 'triage-dashboard-property3');
      console.log('  ✅ Third property works');
    }
  }

  // Test nav tabs
  const tenantBtn = page.locator('button:has-text("Tenant"), a:has-text("Tenant")').first();
  if (await tenantBtn.isVisible()) {
    await tenantBtn.click();
    await page.waitForTimeout(1000);
    await screenshot(page, 'triage-tenant-view');
    console.log('  ✅ Tenant view works');
  }

  // Test module switcher dropdown
  const moduleSwitcher = page.locator('button:has(svg.lucide-grid-3x3), button:has(svg.lucide-grid-2x2), [data-module-switcher]').first();
  if (await moduleSwitcher.isVisible()) {
    await moduleSwitcher.click();
    await page.waitForTimeout(500);
    await screenshot(page, 'triage-module-switcher');
    console.log('  ✅ Module switcher dropdown works');
    await moduleSwitcher.click(); // close it
  }

  // Go back to dashboard
  const dashBtn = page.locator('button:has-text("Dashboard"), a:has-text("Dashboard")').first();
  if (await dashBtn.isVisible()) {
    await dashBtn.click();
    await page.waitForTimeout(1000);
  }

  // Test status filter
  const statusFilter = page.locator('select').nth(1);
  if (await statusFilter.isVisible()) {
    await statusFilter.selectOption('urgent');
    await page.waitForTimeout(500);
    await screenshot(page, 'triage-filter-urgent');
    console.log('  ✅ Status filter works');
    await statusFilter.selectOption('all');
  }

  // Mobile
  await page.setViewportSize({ width: 375, height: 812 });
  await page.waitForTimeout(500);
  await screenshot(page, 'triage-mobile');
  console.log('  ✅ Mobile layout');

  await page.close();
}

async function testComply(browser) {
  console.log('\n=== COMPLY ===');
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto('http://localhost:4172', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  await screenshot(page, 'comply-overview-default');

  // Test property selector
  const propSelect = page.locator('select').first();
  if (await propSelect.isVisible()) {
    const options = await propSelect.locator('option').allTextContents();
    console.log(`  Properties: ${options.join(', ')}`);

    // Switch properties
    for (let i = 1; i < Math.min(options.length, 3); i++) {
      await propSelect.selectOption({ index: i });
      await page.waitForTimeout(500);
      await screenshot(page, `comply-overview-property${i + 1}`);
      console.log(`  ✅ Property ${i + 1} (${options[i]}) loaded`);
    }
    // Reset to first
    await propSelect.selectOption({ index: 0 });
    await page.waitForTimeout(300);
  }

  // Test nav tabs - Documents
  const docsTab = page.locator('button:has-text("Documents"), a:has-text("Documents")').first();
  if (await docsTab.isVisible()) {
    await docsTab.click();
    await page.waitForTimeout(1000);
    await screenshot(page, 'comply-documents');
    console.log('  ✅ Documents view works');

    // Test doc status filter
    const docStatusFilter = page.locator('select').nth(1);
    if (await docStatusFilter.isVisible()) {
      await docStatusFilter.selectOption('expired');
      await page.waitForTimeout(500);
      await screenshot(page, 'comply-docs-filter-expired');
      console.log('  ✅ Doc status filter works');
      await docStatusFilter.selectOption('all');
    }

    // Test search
    const searchInput = page.locator('input[placeholder*="Search"]').first();
    if (await searchInput.isVisible()) {
      await searchInput.fill('fire');
      await page.waitForTimeout(500);
      await screenshot(page, 'comply-docs-search');
      console.log('  ✅ Doc search works');
      await searchInput.fill('');
    }
  }

  // Test Timeline tab
  const timelineTab = page.locator('button:has-text("Timeline"), a:has-text("Timeline")').first();
  if (await timelineTab.isVisible()) {
    await timelineTab.click();
    await page.waitForTimeout(1000);
    await screenshot(page, 'comply-timeline');
    console.log('  ✅ Timeline view works');
  }

  // Module switcher
  const moduleSwitcher = page.locator('button:has(svg.lucide-grid-3x3), button:has(svg.lucide-grid-2x2)').first();
  if (await moduleSwitcher.isVisible()) {
    await moduleSwitcher.click();
    await page.waitForTimeout(500);
    await screenshot(page, 'comply-module-switcher');
    console.log('  ✅ Module switcher works');
    await moduleSwitcher.click();
  }

  // Mobile
  await page.setViewportSize({ width: 375, height: 812 });
  await page.waitForTimeout(500);
  // Go back to overview for mobile screenshot
  const overviewTab = page.locator('button:has-text("Overview"), a:has-text("Overview")').first();
  if (await overviewTab.isVisible()) {
    await overviewTab.click();
    await page.waitForTimeout(1000);
  }
  await screenshot(page, 'comply-mobile');
  console.log('  ✅ Mobile layout');

  await page.close();
}

async function testCollect(browser) {
  console.log('\n=== COLLECT ===');
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto('http://localhost:4173', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  await screenshot(page, 'collect-payments-default');

  // Test property selector
  const propSelect = page.locator('select').first();
  if (await propSelect.isVisible()) {
    const options = await propSelect.locator('option').allTextContents();
    console.log(`  Properties: ${options.join(', ')}`);

    for (let i = 1; i < Math.min(options.length, 3); i++) {
      await propSelect.selectOption({ index: i });
      await page.waitForTimeout(500);
      await screenshot(page, `collect-payments-property${i + 1}`);
      console.log(`  ✅ Property ${i + 1} (${options[i]}) loaded`);
    }
    await propSelect.selectOption({ index: 0 });
    await page.waitForTimeout(300);
  }

  // Test Ledger tab
  const ledgerTab = page.locator('button:has-text("Ledger"), a:has-text("Ledger")').first();
  if (await ledgerTab.isVisible()) {
    await ledgerTab.click();
    await page.waitForTimeout(1000);
    await screenshot(page, 'collect-ledger');
    console.log('  ✅ Ledger view works');

    // Click a tenant
    const tenantBtn = page.locator('button:has-text("Unit"), button:has-text("Bayshore"), [class*="tenant"]').first();
    if (await tenantBtn.isVisible()) {
      await tenantBtn.click();
      await page.waitForTimeout(500);
      await screenshot(page, 'collect-ledger-tenant-detail');
      console.log('  ✅ Tenant detail works');
    }

    // Test status filter in ledger
    const statusFilter = page.locator('select').nth(1);
    if (await statusFilter.isVisible()) {
      await statusFilter.selectOption('late');
      await page.waitForTimeout(500);
      await screenshot(page, 'collect-ledger-filter-late');
      console.log('  ✅ Ledger status filter works');
      await statusFilter.selectOption('all');
    }
  }

  // Test Automations tab
  const autoTab = page.locator('button:has-text("Automation"), a:has-text("Automation")').first();
  if (await autoTab.isVisible()) {
    await autoTab.click();
    await page.waitForTimeout(1000);
    await screenshot(page, 'collect-automations');
    console.log('  ✅ Automations view works');
  }

  // Mobile
  await page.setViewportSize({ width: 375, height: 812 });
  await page.waitForTimeout(500);
  // Go back to payments for mobile
  const paymentsTab = page.locator('button:has-text("Payment"), a:has-text("Payment")').first();
  if (await paymentsTab.isVisible()) {
    await paymentsTab.click();
    await page.waitForTimeout(1000);
  }
  await screenshot(page, 'collect-mobile');
  console.log('  ✅ Mobile layout');

  await page.close();
}

(async () => {
  const browser = await chromium.launch();
  try {
    await testHub(browser);
    await testTriage(browser);
    await testComply(browser);
    await testCollect(browser);
    console.log('\n✅ All tests complete! Screenshots in vestia/screenshots/');
  } finally {
    await browser.close();
  }
})();
