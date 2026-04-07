import type { Page } from 'playwright';
import { SELECTORS, BASE_URL } from './selectors';

export type ScrapedProduct = {
  name: string;
  price: number | null;
  sku: string | null;
  brand: string | null;
  imageUrl: string | null;
  productUrl: string;
};

/**
 * Scrape all products from a single FCPEuro vehicle parts page.
 * The page is one long scrollable list — no pagination needed.
 * Product data is extracted from data-* attributes on div.hit__add elements.
 */
export async function scrapePage(page: Page, url: string): Promise<ScrapedProduct[]> {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

  // Wait for product cards to render (they may load via JS)
  await page.waitForSelector(SELECTORS.productDataElement, { timeout: 30000 });

  // Scroll to bottom to trigger any lazy-loaded sections
  await autoScroll(page);

  // Small wait for any final renders
  await page.waitForTimeout(2000);

  // Extract product data from data attributes
  const products = await page.$$eval(
    SELECTORS.productDataElement,
    (elements, baseUrl) => {
      return elements.map((el) => {
        const name = el.getAttribute('data-name') || 'Unknown';
        const priceStr = el.getAttribute('data-price');
        const price = priceStr ? parseFloat(priceStr) : null;
        const sku = el.getAttribute('data-sku') || null;
        const brand = el.getAttribute('data-brand') || null;
        const imageRaw = el.getAttribute('data-image') || null;
        const imageUrl = imageRaw
          ? imageRaw.startsWith('http')
            ? imageRaw
            : `${baseUrl}${imageRaw}`
          : null;

        // Find the product URL from the nearest ancestor card
        const card = el.closest('.suggestedPart') || el.closest('.card');
        const linkEl = card?.querySelector('a[href*="/products/"]');
        const href = linkEl?.getAttribute('href') || '';
        const productUrl = href.startsWith('http')
          ? href
          : `${baseUrl}${href}`;

        return { name, price, sku, brand, imageUrl, productUrl };
      });
    },
    BASE_URL,
  );

  // Deduplicate by product URL
  const seen = new Set<string>();
  const unique: ScrapedProduct[] = [];
  for (const p of products) {
    if (p.productUrl && !seen.has(p.productUrl)) {
      seen.add(p.productUrl);
      unique.push(p);
    }
  }

  return unique;
}

/**
 * Scroll to the bottom of the page incrementally to trigger lazy loading.
 */
async function autoScroll(page: Page): Promise<void> {
  await page.evaluate(async () => {
    await new Promise<void>((resolve) => {
      let totalHeight = 0;
      const distance = 800;
      const timer = setInterval(() => {
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= document.body.scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 200);
    });
  });
}
