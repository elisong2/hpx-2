import { config } from 'dotenv';
config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';
import { BASE_URL, MAKE, MODEL, VENDOR_NAME, COLLECTION_HANDLE, PRODUCT_TYPE_MAP } from './collections';
import type { StandardCategory } from '../categories';

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
    sku: string | null;
    price: string;
    available: boolean;
  }[];
  images: {
    id: number;
    src: string;
  }[];
};

// ---- Fetch all products from a Shopify collection ----
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
    await delay(500);
  }

  return allProducts;
}

// ---- Map product_type to standard category ----
function mapCategory(productType: string): StandardCategory {
  const lower = productType.toLowerCase().trim();
  return PRODUCT_TYPE_MAP[lower] || 'Accessories & Other';
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

// ---- Upsert a product ----
async function upsertPart(
  product: ShopifyProduct,
  vendorId: string,
  category: StandardCategory,
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

  console.log(`=== Scraping: ${MAKE} ${MODEL} ===`);
  console.log(`    Collection: ${COLLECTION_HANDLE}\n`);

  const products = await fetchCollection(COLLECTION_HANDLE);

  if (products.length === 0) {
    console.log('No products found.');
    return;
  }

  console.log(`Found ${products.length} products\n`);

  let totalSaved = 0;
  const seenUrls = new Set<string>();

  for (const product of products) {
    const productUrl = `${BASE_URL}/products/${product.handle}`;
    if (seenUrls.has(productUrl)) continue;
    seenUrls.add(productUrl);

    const category = mapCategory(product.product_type);
    const variant = product.variants[0];
    const price = variant ? parseFloat(variant.price) : null;

    console.log(`  [${category}] ${product.title} — $${price ?? 'N/A'} (${variant?.sku || 'no sku'})`);

    await upsertPart(product, vendorId, category);
    totalSaved++;
  }

  console.log(`\n=== Done. Scraped ${totalSaved} unique products, saved to Supabase. ===`);
}

run();
