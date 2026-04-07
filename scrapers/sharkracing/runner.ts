import { config } from 'dotenv';
config({ path: '.env.local' });
import { chromium } from 'playwright';
import { createClient } from '@supabase/supabase-js';
import type { StandardCategory } from '../categories';

const BASE_URL = 'https://sharkracing.com';
const CATEGORY_URL = '/elantra-2021-cn7/';
const TOTAL_PAGES = 6;
const MAKE = 'Hyundai';
const MODEL = 'Elantra N';
const VENDOR_NAME = 'Shark Racing';

// ---- Supabase client ----
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
);

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ---- Category inference from product name ----
const CATEGORY_KEYWORDS: [string[], StandardCategory][] = [
  [['brake', 'rotor', 'caliper', 'pad', 'monoblock'], 'Brakes'],
  [['coilover', 'spring', 'shock', 'sway bar', 'bushing', 'strut', 'brace', 'subframe', 'chassis'], 'Suspension'],
  [['downpipe', 'exhaust', 'muffler', 'catback', 'flex pipe', 'resonator'], 'Exhaust'],
  [['intake', 'air filter', 'induction', 'big mouth'], 'Intake'],
  [['turbo', 'intercooler', 'blow off', 'bov', 'wastegate', 'oil cooler', 'catch can', 'pulley', 'crank', 'engine', 'oil filter', 'map sensor', 'methanol'], 'Engine'],
  [['clutch', 'flywheel', 'transmission', 'shifter', 'shift', 'differential', 'lsd', 'motor mount', 'driveshaft', 'gear knob'], 'Drivetrain'],
  [['lip', 'spoiler', 'diffuser', 'canard', 'wing', 'body kit', 'side skirt', 'fender', 'bumper', 'grille', 'mirror', 'fuel door', 'emblem', 'decal', 'tail light', 'fog light', 'duct', 'aero', 'roof spoiler', 'fin extension', 'mud flap'], 'Exterior'],
  [['seat', 'steering', 'pedal', 'console', 'dashboard', 'door sill', 'door catch', 'interior', 'alcantara', 'soundproofing', 'floor'], 'Interior'],
  [['led', 'light', 'headlight', 'drl', 'bulb', 'wiring'], 'Electrical'],
  [['wheel', 'tire', 'lug', 'spacer'], 'Wheels & Tires'],
  [['gasket', 'seal', 'o-ring'], 'Seals & Gaskets'],
];

function inferCategory(productName: string): StandardCategory {
  const lower = productName.toLowerCase();
  for (const [keywords, category] of CATEGORY_KEYWORDS) {
    if (keywords.some((kw) => lower.includes(kw))) {
      return category;
    }
  }
  return 'Accessories & Other';
}

// ---- Types ----
type ScrapedProduct = {
  name: string;
  price: number | null;
  productUrl: string;
  imageUrl: string | null;
};

// ---- Vendor upsert ----
async function getOrCreateVendorId(): Promise<string> {
  const { data: existing } = await supabase
    .from('vendors')
    .select('id')
    .eq('name', VENDOR_NAME)
    .single();

  if (existing) return existing.id;

  const { data: created, error } = await supabase
    .from('vendors')
    .insert({ name: VENDOR_NAME, base_url: BASE_URL })
    .select('id')
    .single();

  if (error) throw new Error(`Failed to create vendor: ${error.message}`);
  return created!.id;
}

// ---- Upsert a product ----
async function upsertPart(
  product: ScrapedProduct,
  vendorId: string,
  category: StandardCategory,
): Promise<void> {
  const { error } = await supabase
    .from('parts')
    .upsert(
      {
        vendor_id: vendorId,
        name: product.name,
        brand: null,
        part_number: null,
        category,
        make: MAKE,
        model: MODEL,
        product_url: product.productUrl,
        image_url: product.imageUrl,
        price: product.price,
        currency: 'USD',
        in_stock: product.price !== null,
        scraped_at: new Date().toISOString(),
      },
      { onConflict: 'product_url' },
    );

  if (error) {
    console.error(`  ✗ DB error for "${product.name}": ${error.message}`);
  }
}

// ---- Scrape one page of products ----
async function scrapePage(page: any, pageNum: number): Promise<ScrapedProduct[]> {
  const url = `${BASE_URL}${CATEGORY_URL}?sort=featured&page=${pageNum}`;
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

  // Wait for product list to load
  await page.waitForSelector('li strong a', { timeout: 15000 });

  // Extract products from the listing
  const products: ScrapedProduct[] = await page.$$eval(
    'ul.ProductList li',
    (items: Element[], baseUrl: string) => {
      return items
        .map((li) => {
          const nameEl = li.querySelector('strong a');
          const name = nameEl?.textContent?.trim() || '';
          const href = nameEl?.getAttribute('href') || '';
          const productUrl = href.startsWith('http') ? href : `${baseUrl}${href}`;

          const priceEl = li.querySelector('em');
          const priceText = priceEl?.textContent?.trim() || '';
          const priceMatch = priceText.replace(/[^0-9.]/g, '');
          const price = priceMatch ? parseFloat(priceMatch) : null;

          const imgEl = li.querySelector('img');
          const imgSrc = imgEl?.getAttribute('src') || null;
          const imageUrl = imgSrc
            ? imgSrc.startsWith('http')
              ? imgSrc
              : `${baseUrl}${imgSrc}`
            : null;

          return { name, price, productUrl, imageUrl };
        })
        .filter((p) => p.name.length > 0);
    },
    BASE_URL,
  );

  return products;
}

// ---- Main runner ----
async function run() {
  console.log('Connecting to Supabase...');
  const vendorId = await getOrCreateVendorId();
  console.log(`Vendor "${VENDOR_NAME}" id: ${vendorId}\n`);

  console.log(`=== Scraping: ${MAKE} ${MODEL} from ${VENDOR_NAME} ===\n`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
  });
  const page = await context.newPage();

  let totalSaved = 0;
  const seenUrls = new Set<string>();

  for (let pageNum = 1; pageNum <= TOTAL_PAGES; pageNum++) {
    console.log(`--- Page ${pageNum}/${TOTAL_PAGES} ---`);

    const products = await scrapePage(page, pageNum);
    console.log(`  Found ${products.length} products`);

    for (const product of products) {
      if (seenUrls.has(product.productUrl)) continue;
      seenUrls.add(product.productUrl);

      const category = inferCategory(product.name);
      console.log(`  [${category}] ${product.name} — $${product.price ?? 'N/A'}`);

      await upsertPart(product, vendorId, category);
      totalSaved++;
    }

    // Polite delay between pages
    await delay(2000 + Math.random() * 2000);
  }

  await browser.close();

  console.log(`\n=== Done. Scraped ${totalSaved} unique products, saved to Supabase. ===`);
}

run();
