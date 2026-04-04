import { Page } from 'playwright';
import { BASE_URL, SELECTORS } from './selectors';

export async function scrapeCategory(
  page: Page,
  categoryPath: string
): Promise<string[]> {
  await page.goto(`${BASE_URL}${categoryPath}`, {
    waitUntil: 'domcontentloaded',
    timeout: 30000,
  });

  // Wait for WooCommerce product grid to render
  await page.waitForSelector(SELECTORS.productCard, { timeout: 10000 });

  // Each li.product contains an <a> as its first child linking to the product
  const productUrls = await page.$$eval(
    SELECTORS.productCard,
    (cards) =>
      cards
        .map((card) => {
          const link = card.querySelector('a');
          return link?.getAttribute('href') ?? null;
        })
        .filter((href): href is string => href !== null),
  );

  // Deduplicate — WooCommerce cards can have multiple <a> tags per product
  const unique = [...new Set(productUrls)];

  // WooCommerce typically returns absolute URLs, but handle relative just in case
  return unique.map((url) =>
    url.startsWith('http') ? url : `${BASE_URL}${url}`,
  );
}
