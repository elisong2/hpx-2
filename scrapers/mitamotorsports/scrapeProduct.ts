import { Page } from 'playwright';
import { SELECTORS } from './selectors';

export interface ScrapedProduct {
  name: string;
  price: number | null;
  imageUrl?: string;
  productUrl: string;
}

export async function scrapeProduct(
  page: Page,
  productUrl: string
): Promise<ScrapedProduct> {
  await page.goto(productUrl, {
    waitUntil: 'domcontentloaded',
    timeout: 30000,
  });

  // Elementor-wrapped product title
  await page.waitForSelector(SELECTORS.productTitle, { timeout: 10000 });

  const name = await page.$eval(
    SELECTORS.productTitle,
    (el) => el.textContent?.trim() || '',
  );

  // Price — page has multiple .woocommerce-Price-amount elements,
  // some are $0.00 (variant placeholders). Grab first non-zero price.
  const allPriceTexts = await page
    .$$eval(SELECTORS.price, (els) =>
      els.map((el) => el.textContent?.trim() || ''),
    )
    .catch(() => [] as string[]);

  let price: number | null = null;
  for (const text of allPriceTexts) {
    const match = text.match(/[\d,]+\.\d{2}/);
    if (match) {
      const parsed = parseFloat(match[0].replace(/,/g, ''));
      if (parsed > 0) {
        price = parsed;
        break;
      }
    }
  }

  // Product gallery image
  const imageUrl = await page
    .$eval(
      SELECTORS.image,
      (el) => (el as HTMLImageElement).src,
    )
    .catch(() => undefined);

  return {
    name,
    price,
    imageUrl,
    productUrl,
  };
}
