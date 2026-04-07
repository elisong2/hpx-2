/**
 * Whoosh Motorsports Focus ST Shopify collections and category mapping.
 * The subcollection handles return empty, so we use the main collection
 * and map categories from the product_type field.
 */

import type { StandardCategory } from '../categories';

export const BASE_URL = 'https://whooshmotorsports.com';
export const MAKE = 'Ford';
export const MODEL = 'Focus ST';
export const VENDOR_NAME = 'Whoosh Motorsports';

// Main collection containing all Focus ST products
export const COLLECTION_HANDLE = '2013-ford-focus-st';

// Map Shopify product_type → our standard categories
export const PRODUCT_TYPE_MAP: Record<string, StandardCategory> = {
  'drivetrain': 'Drivetrain',
  'engine': 'Engine',
  'exhaust': 'Exhaust',
  'intake': 'Intake',
  'suspension': 'Suspension',
  'brakes': 'Brakes',
  'cooling': 'Engine',
  'interior': 'Interior',
  'exterior': 'Exterior',
  'accessories': 'Accessories & Other',
};
