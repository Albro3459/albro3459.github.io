import { chromium } from 'playwright';

const browser = await chromium.launch({ channel: 'chrome', headless: false });
const page = await browser.newPage();
for (const width of [320, 390, 768, 1000]) {
  await page.setViewportSize({ width, height: 900 });
  await page.goto('http://127.0.0.1:4321/', { waitUntil: 'networkidle' });
  await page.evaluate(async () => { await document.fonts.ready; });
  console.log(JSON.stringify(await page.evaluate(() => ({
    width: innerWidth, scrollWidth: document.documentElement.scrollWidth,
    elements: [...document.querySelectorAll('body *')].filter(element => {
      const box = element.getBoundingClientRect();
      return box.right > innerWidth + 1 && getComputedStyle(element).position !== 'absolute';
    }).map(element => ({ tag: element.tagName, class: element.className, text: element.textContent?.slice(0, 100), parent: element.parentElement?.className, parentText: element.parentElement?.textContent?.slice(0, 100), fontSize: getComputedStyle(element).fontSize, right: element.getBoundingClientRect().right })),
  })), null, 2));
}
await browser.close();
