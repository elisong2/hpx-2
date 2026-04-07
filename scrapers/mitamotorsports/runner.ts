import { config } from 'dotenv';
config({ path: '.env.local' });
import { chromium } from 'playwright';
import { createClient } from '@supabase/supabase-js';
import { CATEGORY_URLS, USER_AGENTS, BASE_URL } from './selectors';
import { scrapeCategory } from './scrapeCategory';
import { scrapeProduct, ScrapedProduct } from './scrapeProduct';

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 5000;

const VENDOR_NAME = 'Mita Motorsports';

// ---- Supabase client (standalone, not SSR) ----
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

// Map URL path segments to make/model
const MODEL_MAP: Record<string, { make: string; model: string } | null> = {
  nsx: { make: 'Honda', model: 'NSX' },
  s2000: { make: 'Honda', model: 'S2000' },
  integra: { make: 'Acura', model: 'Integra' },
  wheels: null, // generic, no specific make/model
};

// Normalized category mapping — Mita's names → standard categories (see scrapers/categories.ts)
const CATEGORY_MAP: Record<string, string> = {
  'exterior': 'Exterior',
  'interior': 'Interior',
  'seals': 'Seals & Gaskets',
  'stability': 'Suspension',
  'exhausts': 'Exhaust',
  'maintenance': 'Engine',
  'upgrade kits': 'Accessories & Other',
  'accessories': 'Accessories & Other',
  'emblems': 'Exterior',
};

// Extract category from URL path, e.g. "/product-category/nsx/exterior/" → "Exterior"
function extractCategory(categoryPath: string): string {
  const segments = categoryPath.split('/').filter(Boolean);
  const raw = segments[segments.length - 1] || 'unknown';
  const cleaned = raw
    .replace(/-(s2000|integra|wheels)$/, '')
    .replace(/-/g, ' ');
  return CATEGORY_MAP[cleaned] || cleaned;
}

// Extract make/model from URL path, e.g. "/product-category/nsx/exterior/" → { make: "Honda", model: "NSX" }
function extractMakeModel(categoryPath: string): { make: string | null; model: string | null } {
  const segments = categoryPath.split('/').filter(Boolean);
  // segments[1] is the car identifier (nsx, s2000, integra, wheels)
  const carSegment = segments[1] || '';
  const match = MODEL_MAP[carSegment];
  return match ? match : { make: null, model: null };
}

// Ensure vendor row exists and return its id
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

// Upsert a scraped product into the parts table
async function upsertPart(
  product: ScrapedProduct,
  vendorId: string,
  category: string,
  make: string | null,
  model: string | null,
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
        make,
        model,
        product_url: product.productUrl,
        image_url: product.imageUrl ?? null,
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

async function run() {
  console.log('Connecting to Supabase...');
  const vendorId = await getOrCreateVendorId();
  console.log(`Vendor "${VENDOR_NAME}" id: ${vendorId}\n`);

  const browser = await chromium.launch({ headless: true });
  let totalScraped = 0;
  let totalSaved = 0;

  for (const categoryPath of CATEGORY_URLS) {
    const category = extractCategory(categoryPath);
    const { make, model } = extractMakeModel(categoryPath);
    const context = await browser.newContext({ userAgent: randomUA() });
    const page = await context.newPage();

    console.log(`\n--- Scraping category: ${categoryPath} (${category}) ---`);

    const productUrls = await withRetry(
      () => scrapeCategory(page, categoryPath),
      categoryPath,
    );

    if (!productUrls || productUrls.length === 0) {
      console.log(`  No products found, skipping.`);
      await context.close();
      continue;
    }

    console.log(`  Found ${productUrls.length} products`);

    for (const url of productUrls) {
      console.log(`  → ${url}`);

      const product = await withRetry(
        () => scrapeProduct(page, url),
        url,
      );

      if (product) {
        totalScraped++;
        console.log(`    ✓ ${product.name} — $${product.price ?? 'N/A'}`);

        await upsertPart(product, vendorId, category, make, model);
        totalSaved++;
      }

      // Polite delay between requests (1.5–3.5s)
      await delay(1500 + Math.random() * 2000);
    }

    await context.close();

    // Polite delay between categories (3–6s)
    await delay(3000 + Math.random() * 3000);
  }

  await browser.close();

  console.log(`\n=== Done. Scraped ${totalScraped} products, saved ${totalSaved} to Supabase. ===`);
}

run();
