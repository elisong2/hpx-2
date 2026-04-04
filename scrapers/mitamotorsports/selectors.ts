export const BASE_URL = 'https://www.mitamotorsports.com';

// WooCommerce product-category URL paths
export const ALL_CATEGORY_URLS = [
  // NSX
  '/product-category/nsx/exterior/',
  '/product-category/nsx/interior/',
  '/product-category/nsx/seals/',
  '/product-category/nsx/stability/',
  '/product-category/nsx/exhausts/',
  '/product-category/nsx/maintenance/',
  '/product-category/nsx/upgrade-kits/',
  '/product-category/nsx/accessories/',
  // S2000
  '/product-category/s2000/exterior-s2000/',
  '/product-category/s2000/interior-s2000/',
  '/product-category/s2000/seals-s2000/',
  '/product-category/s2000/stability-s2000/',
  '/product-category/s2000/exhausts-s2000/',
  '/product-category/s2000/maintenance-s2000/',
  '/product-category/s2000/upgrade-kits-s2000/',
  '/product-category/s2000/accessories-s2000/',
  // Integra
  '/product-category/integra/exterior-integra/',
  '/product-category/integra/interior-integra/',
  '/product-category/integra/seals-integra/',
  '/product-category/integra/emblems-integra/',
  // Wheels
  '/product-category/wheels/accessories-wheels/',
];

// NSX only for now — swap to ALL_CATEGORY_URLS for full site scrape
export const CATEGORY_URLS = [
  '/product-category/nsx/exterior/',
  '/product-category/nsx/interior/',
  '/product-category/nsx/seals/',
  '/product-category/nsx/stability/',
  '/product-category/nsx/exhausts/',
  '/product-category/nsx/maintenance/',
  '/product-category/nsx/upgrade-kits/',
  '/product-category/nsx/accessories/',
];

// WooCommerce + Elementor selectors
export const SELECTORS = {
  // Category / listing page
  productCard: 'li.product',
  productLink: 'a',
  productListTitle: 'h2.woocommerce-loop-product__title',
  productListPrice: 'span.price',
  productListImage: 'img.attachment-woocommerce_thumbnail',

  // Single product detail page (Elementor-wrapped)
  productTitle: '.elementor-heading-title',
  price: '.woocommerce-Price-amount.amount',
  image: 'img.attachment-medium_large, img.attachment-large.size-large.wp-post-image',
};

// Rotate user agents to reduce 503s
export const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:126.0) Gecko/20100101 Firefox/126.0',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
];
