import { config } from 'dotenv';
config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';
import { BASE_URL, MAKE, MODEL, VENDOR_NAME, ND_COLLECTIONS } from './collections';

// ---- Supabase client ----
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
);

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ---- Types ----
type ShopifyProduct = {
  id: number;
  title: string;
  handle: string;
  vendor: string;
  product_type: string;
  tags: string[];
  variants: {
    id: number;
    title: string;
    sku: string;
    price: string;
    available: boolean;
  }[];
  images: {
    id: number;
    src: string;
  }[];
};

// ---- Fetch all products from a Shopify collection via JSON API ----
async function fetchCollection(handle: string): Promise<ShopifyProduct[]> {
  const allProducts: ShopifyProduct[] = [];
  let page = 1;

  while (true) {
    const url = `${BASE_URL}/collections/${handle}/products.json?limit=250&page=${page}`;
    const res = await fetch(url);

    if (!res.ok) {
      console.warn(`  ✗ HTTP ${res.status} for ${handle} page ${page}`);
      break;
    }

    const data = await res.json();
    const products: ShopifyProduct[] = data.products || [];

    if (products.length === 0) break;

    allProducts.push(...products);
    page++;

    // Polite delay between pages
    await delay(500);
  }

  return allProducts;
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

// ---- Upsert a product into the parts table ----
async function upsertPart(
  product: ShopifyProduct,
  vendorId: string,
  category: string,
): Promise<void> {
  const variant = product.variants[0];
  const price = variant ? parseFloat(variant.price) : null;
  const sku = variant?.sku || null;
  const inStock = variant?.available ?? false;
  const imageUrl = product.images[0]?.src || null;
  const productUrl = `${BASE_URL}/products/${product.handle}`;

  const { error } = await supabase
    .from('parts')
    .upsert(
      {
        vendor_id: vendorId,
        name: product.title,
        brand: product.vendor || null,
        part_number: sku,
        category,
        make: MAKE,
        model: MODEL,
        product_url: productUrl,
        image_url: imageUrl,
        price: price && price > 0 ? price : null,
        currency: 'USD',
        in_stock: inStock,
        scraped_at: new Date().toISOString(),
      },
      { onConflict: 'product_url' },
    );

  if (error) {
    console.error(`  ✗ DB error for "${product.title}": ${error.message}`);
  }
}

// ---- Main runner ----
async function run() {
  console.log('Connecting to Supabase...');
  const vendorId = await getOrCreateVendorId();
  console.log(`Vendor "${VENDOR_NAME}" id: ${vendorId}\n`);

  let totalScraped = 0;
  let totalSaved = 0;
  const seenUrls = new Set<string>();

  for (const collection of ND_COLLECTIONS) {
    console.log(`\n--- ${collection.handle} → [${collection.category}] ---`);

    const products = await fetchCollection(collection.handle);
    console.log(`  Fetched ${products.length} products`);

    let collectionNew = 0;
    for (const product of products) {
      const productUrl = `${BASE_URL}/products/${product.handle}`;

      // Skip duplicates across collections
      if (seenUrls.has(productUrl)) continue;
      seenUrls.add(productUrl);

      totalScraped++;
      collectionNew++;

      const variant = product.variants[0];
      const price = variant ? parseFloat(variant.price) : null;
      console.log(`  ${product.title} — $${price ?? 'N/A'} (${variant?.sku || 'no sku'})`);

      await upsertPart(product, vendorId, collection.category);
      totalSaved++;
    }

    console.log(`  → ${collectionNew} new unique products`);

    // Polite delay between collections
    await delay(1000 + Math.random() * 1000);
  }

  console.log(`\n=== Done. Scraped ${totalScraped} unique products, saved ${totalSaved} to Supabase. ===`);
}

run();
