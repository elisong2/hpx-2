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
    waitUntil: 'networkidle',
  });

  await page.waitForSelector(SELECTORS.productTitle);

  const name = await page.$eval(
    SELECTORS.productTitle,
    el => el.textContent?.trim() || ''
  );

  const priceText = await page
    .$eval(SELECTORS.price, el => el.textContent)
    .catch(() => null);

  const price = priceText
    ? parseFloat(priceText.replace(/[^0-9.]/g, ''))
    : null;

  const imageUrl = await page
    .$eval(SELECTORS.image, el => (el as HTMLImageElement).src)
    .catch(() => undefined);

  return {
    name,
    price,
    imageUrl,
    productUrl,
  };
}
