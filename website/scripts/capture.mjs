import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

await mkdir('artifacts/screenshots', { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: false });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
const page = await context.newPage();
async function reviewWholePage() {
  await page.evaluate(async () => { await document.fonts.ready; });
  for (let y = 0; y < await page.locator('body').evaluate(element => element.scrollHeight); y += 600) {
    await page.evaluate(value => window.scrollTo(0, value), y);
    await page.waitForTimeout(120);
  }
  await page.evaluate(() => { window.scrollTo(0, 0); if (document.activeElement instanceof HTMLElement) document.activeElement.blur(); });
  await page.waitForTimeout(750);
}
const issues = [];
page.on('pageerror', error => issues.push(error.message));
page.on('response', response => { if (response.status() >= 400 && response.url().startsWith('http://127.0.0.1:4321')) issues.push(`${response.status()} ${response.url()}`); });
await page.goto('http://127.0.0.1:4321/', { waitUntil: 'networkidle' });
await page.evaluate(async () => { await document.fonts.ready; });
for (let y = 0; y < await page.locator('body').evaluate(element => element.scrollHeight); y += 700) {
  await page.evaluate(value => window.scrollTo(0, value), y);
  await page.waitForTimeout(100);
}
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(750);
await page.screenshot({ path: 'artifacts/screenshots/desktop.png', fullPage: true });
const screenshot = sharp('artifacts/screenshots/desktop.png');
const dimensions = await screenshot.metadata();
await screenshot.extract({ left: 0, top: 0, width: dimensions.width, height: Math.min(dimensions.height, Math.round(dimensions.width * 1.25)) }).resize({ width: 1000 }).png().toFile('artifacts/screenshots/portfolio-preview.png');
const previewImage = await sharp('artifacts/screenshots/portfolio-preview.png').webp({ quality: 82 }).toBuffer();
await writeFile('artifacts/preview.html', `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body{margin:0;padding:0;background:transparent}img{display:block;width:100%;height:auto;border-radius:var(--radius,8px)}</style></head><body><img src="data:image/webp;base64,${previewImage.toString('base64')}" width="1000" height="1250" alt="Alex Brodsky portfolio homepage, with professional experience, projects, and resume links"></body></html>`);
await page.getByRole('button', { name: 'Applications', exact: true }).click();
const applications = await page.locator('[data-category]:visible').count();
await page.getByRole('button', { name: 'Developer tools', exact: true }).click();
const tools = await page.locator('[data-category]:visible').count();
await page.getByRole('button', { name: 'All projects' }).click();
await page.getByRole('button', { name: 'Switch to dark theme' }).click();
await page.waitForTimeout(350);
await page.screenshot({ path: 'artifacts/screenshots/desktop-dark.png', fullPage: true });
await page.reload({ waitUntil: 'networkidle' });
const savedTheme = await page.locator('html').getAttribute('data-theme');
await page.getByRole('button', { name: 'Switch to light theme' }).click();
await page.getByRole('button', { name: 'Copy email address' }).click();
const copyResult = await page.getByRole('status').textContent();
await page.locator('.experience-item').nth(2).locator('summary').click();
const experienceExpanded = await page.locator('.experience-item').nth(2).getAttribute('open');
const pages = ['cloudgateway', 'streamtrack', 'clipboard-history', 'codelaunch', 'br0wser', 't3-thread'];
const pageDetails = [];
for (const slug of pages) {
  await page.goto(`http://127.0.0.1:4321/projects/${slug}/`, { waitUntil: 'networkidle' });
  await reviewWholePage();
  const broken = await page.locator('img[src]').evaluateAll(images => images.filter(image => !image.complete || image.naturalWidth === 0).map(image => image.getAttribute('src')));
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
  pageDetails.push({ slug, broken, overflow });
  if (slug === 'cloudgateway' || slug === 'streamtrack') {
    await page.locator('.gallery-trigger').first().click();
    const dialogVisible = await page.locator('dialog').isVisible();
    await page.keyboard.press('Escape');
    await page.evaluate(() => { if (document.activeElement instanceof HTMLElement) document.activeElement.blur(); window.scrollTo(0, 0); });
    await page.locator('h1').click();
    pageDetails.at(-1).dialogVisible = dialogVisible;
    await page.screenshot({ path: `artifacts/screenshots/${slug}-desktop.png`, fullPage: true });
  }
}
await page.setViewportSize({ width: 390, height: 844 });
await page.goto('http://127.0.0.1:4321/', { waitUntil: 'networkidle' });
for (let y = 0; y < await page.locator('body').evaluate(element => element.scrollHeight); y += 600) {
  await page.evaluate(value => window.scrollTo(0, value), y);
  await page.waitForTimeout(100);
}
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(750);
await page.screenshot({ path: 'artifacts/screenshots/mobile.png', fullPage: true });
const mobileOverflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
await page.getByRole('button', { name: 'Developer tools', exact: true }).click();
const mobileFilterCount = await page.locator('[data-category]:visible').count();
await page.goto('http://127.0.0.1:4321/projects/streamtrack/', { waitUntil: 'networkidle' });
await reviewWholePage();
await page.screenshot({ path: 'artifacts/screenshots/streamtrack-mobile.png', fullPage: true });
const mobileCaseOverflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
await page.setViewportSize({ width: 320, height: 740 });
await page.goto('http://127.0.0.1:4321/', { waitUntil: 'networkidle' });
const smallMobileOverflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
const smallOverflowElements = await page.locator('body *').evaluateAll(elements => elements.filter(element => { const rect = element.getBoundingClientRect(); return rect.right > innerWidth + 1 && getComputedStyle(element).position !== 'absolute'; }).map(element => ({ tag: element.tagName, class: element.className, right: element.getBoundingClientRect().right })));
const smallCaseOverflows = [];
for (const slug of pages) {
  await page.goto(`http://127.0.0.1:4321/projects/${slug}/`, { waitUntil: 'networkidle' });
  if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)) smallCaseOverflows.push(slug);
}
await page.setViewportSize({ width: 768, height: 1024 });
await page.goto('http://127.0.0.1:4321/', { waitUntil: 'networkidle' });
const tabletOverflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
const noJsContext = await browser.newContext({ javaScriptEnabled: false });
const noJsPage = await noJsContext.newPage();
await noJsPage.goto('http://127.0.0.1:4321/');
const noJsProjectCount = await noJsPage.locator('.project-card:visible').count();
await noJsContext.close();
await context.close();
await browser.close();
const result = { applications, tools, savedTheme, copyResult, experienceExpanded, mobileOverflow, mobileCaseOverflow, smallMobileOverflow, smallOverflowElements, smallCaseOverflows, tabletOverflow, noJsProjectCount, mobileFilterCount, pageDetails, issues };
await writeFile('artifacts/browser-review.json', `${JSON.stringify(result, null, 2)}\n`);
console.log(JSON.stringify(result, null, 2));
