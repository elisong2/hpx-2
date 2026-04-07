import { config } from 'dotenv';
config({ path: '.env.local' });
import { chromium } from 'playwright';
import { createClient } from '@supabase/supabase-js';
import { VEHICLE_PAGES, USER_AGENTS, BASE_URL } from './selectors';
import { scrapePage, ScrapedProduct } from './scrapePage';

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 5000;
const VENDOR_NAME = 'FCP Euro';

// ---- Supabase client ----
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
);

function randomUA(): string {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function withRetry<T>(
  fn: () => Promise<T>,
  label: string,
  retries = MAX_RETRIES,
): Promise<T | null> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      console.warn(
        `[Attempt ${attempt}/${retries}] Failed: ${label}`,
        (err as Error).message,
      );
      if (attempt < retries) {
        await delay(RETRY_DELAY_MS * attempt);
      }
    }
  }
  console.error(`Giving up on: ${label}`);
  return null;
}

// ---- Category detection from product name ----
// Standard categories defined in scrapers/categories.ts
// FCPEuro doesn't expose category in the listing, so we infer via keywords.
const CATEGORY_KEYWORDS: [string[], string][] = [
  [['strut', 'shock', 'spring', 'coilover', 'sway bar', 'bushing', 'control arm', 'ball joint', 'tie rod', 'end link', 'subframe', 'camber', 'trailing arm', 'monoball', 'mount kit', 'lowering'], 'Suspension'],
  [['brake', 'rotor', 'caliper', 'pad', 'brake line', 'brake fluid'], 'Brakes'],
  [['oil', 'filter', 'spark plug', 'thermostat', 'coolant', 'radiator', 'water pump', 'timing', 'valve cover', 'chain', 'sprocket', 'guide rail', 'vanos', 'connecting rod'], 'Engine'],
  [['exhaust', 'muffler', 'catalytic', 'downpipe', 'header'], 'Exhaust'],
  [['intake', 'air filter', 'throttle', 'maf', 'intercooler', 'turbo', 'supercharger', 'cold air'], 'Intake'],
  [['clutch', 'flywheel', 'transmission', 'shift', 'diff', 'driveshaft', 'axle', 'cv joint', 'differential'], 'Drivetrain'],
  [['headlight', 'taillight', 'bulb', 'fog light', 'turn signal', 'mirror', 'bumper', 'fender', 'hood', 'grille', 'spoiler', 'lip', 'body'], 'Exterior'],
  [['seat', 'carpet', 'trim', 'dash', 'steering wheel', 'gauge', 'pedal'], 'Interior'],
  [['wheel', 'tire', 'lug', 'spacer', 'hub'], 'Wheels & Tires'],
  [['wiper', 'window', 'regulator', 'sensor', 'relay', 'fuse', 'battery', 'alternator', 'starter'], 'Electrical'],
  [['gasket', 'seal', 'o-ring', 'weatherstrip'], 'Seals & Gaskets'],
];

function inferCategory(productName: string): string {
  const lower = productName.toLowerCase();
  for (const [keywords, category] of CATEGORY_KEYWORDS) {
    if (keywords.some((kw) => lower.includes(kw))) {
      return category;
    }
  }
  return 'Accessories & Other';
}

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

// ---- Upsert a scraped product ----
async function upsertPart(
  product: ScrapedProduct,
  vendorId: string,
  make: string,
  model: string,
): Promise<void> {
  const category = inferCategory(product.name);

  const { error } = await supabase
    .from('parts')
    .upsert(
      {
        vendor_id: vendorId,
        name: product.name,
        brand: product.brand,
        part_number: product.sku,
        category,
        make,
        model,
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

// ---- Main runner ----
async function run() {
  console.log('Connecting to Supabase...');
  const vendorId = await getOrCreateVendorId();
  console.log(`Vendor "${VENDOR_NAME}" id: ${vendorId}\n`);

  const browser = await chromium.launch({ headless: true });
  let totalScraped = 0;
  let totalSaved = 0;

  for (const vehicle of VEHICLE_PAGES) {
    console.log(`\n=== Scraping: ${vehicle.make} ${vehicle.model} ===`);
    console.log(`    URL: ${vehicle.url}`);

    const context = await browser.newContext({ userAgent: randomUA() });
    const page = await context.newPage();

    const products = await withRetry(
      () => scrapePage(page, vehicle.url),
      vehicle.url,
    );

    if (!products || products.length === 0) {
      console.log('  No products found, skipping.');
      await context.close();
      continue;
    }

    console.log(`  Found ${products.length} unique products\n`);

    for (const product of products) {
      totalScraped++;
      const category = inferCategory(product.name);
      console.log(`  [${category}] ${product.name} — $${product.price ?? 'N/A'} (${product.sku})`);

      await upsertPart(product, vendorId, vehicle.make, vehicle.model);
      totalSaved++;
    }

    await context.close();

    // Polite delay between vehicle pages
    await delay(3000 + Math.random() * 3000);
  }

  await browser.close();

  console.log(`\n=== Done. Scraped ${totalScraped} products, saved ${totalSaved} to Supabase. ===`);
}

run();
