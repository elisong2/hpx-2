import { Page } from 'playwright';
import { BASE_URL, SELECTORS } from './selectors';

export async function scrapeCategory(
  page: Page,
  categoryPath: string
): Promise<string[]> {
  await page.goto(`${BASE_URL}${categoryPath}`, {
    waitUntil: 'networkidle',
  });

  await page.waitForSelector(SELECTORS.productCard);

  const productUrls = await page.$$eval(
    SELECTORS.productCard,
    (cards, linkSelector) =>
      cards
        .map(card =>
          card.querySelector(linkSelector)?.getAttribute('href')
        )
        .filter(Boolean),
    SELECTORS.productLink
  );

  return productUrls.map(url =>
    url.startsWith('http') ? url : `${BASE_URL}${url}`
  );
}
