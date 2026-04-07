/**
 * Shared normalized category set across all scrapers.
 * Every retailer maps its own category names into these standard values.
 */
export const STANDARD_CATEGORIES = [
  'Engine',
  'Intake',
  'Exhaust',
  'Drivetrain',
  'Suspension',
  'Brakes',
  'Wheels & Tires',
  'Exterior',
  'Interior',
  'Electrical',
  'Seals & Gaskets',
  'Accessories & Other',
] as const;

export type StandardCategory = (typeof STANDARD_CATEGORIES)[number];
