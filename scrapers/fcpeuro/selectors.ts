// FCPEuro E46 M3 parts page
// Single long page — no pagination, sidebar just scrolls to sections

export const BASE_URL = 'https://www.fcpeuro.com';

// Each entry is a page URL + make/model metadata
export const VEHICLE_PAGES = [
  {
    url: `${BASE_URL}/BMW-parts/e46-m3/`,
    make: 'BMW',
    model: 'E46 M3',
  },
  // Add more vehicles here as needed, e.g.:
  // { url: `${BASE_URL}/BMW-parts/e90-335i/`, make: 'BMW', model: 'E90 335i' },
];

// Selectors for extracting product data from the main parts page
export const SELECTORS = {
  // The add-to-cart button has all product data as data attributes
  productDataElement: 'div.hit__add[data-add-to-cart]',
  // Product link (closest anchor with /products/ href)
  productLink: 'a[href*="/products/"]',
  // The card container wrapping each product
  productCard: 'div.suggestedPart',
};

// Data attributes available on div.hit__add
// data-name, data-price, data-sku, data-brand, data-image

export const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:126.0) Gecko/20100101 Firefox/126.0',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
];
