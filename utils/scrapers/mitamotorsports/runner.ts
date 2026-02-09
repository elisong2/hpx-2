import { chromium } from 'playwright';
import { CATEGORY_URLS } from './selectors';
import { scrapeCategory } from './scrapeCategory';
import { scrapeProduct } from './scrapeProduct';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
  });

  const page = await context.newPage();

  for (const category of CATEGORY_URLS) {
    console.log(`Scraping category: ${category}`);
    const productUrls = await scrapeCategory(page, category);

    for (const url of productUrls) {
      console.log(`→ Scraping product: ${url}`);
      const product = await scrapeProduct(page, url);

      console.log(product);

      await page.waitForTimeout(
        1000 + Math.random() * 1500
      );
    }
  }

  await browser.close();
}

run();
