/**
 * MAPerformance 11th Gen Honda Civic Si — Shopify collection + category mapping.
 * Single collection handle, categories mapped via product_type field.
 */

import type { StandardCategory } from '../categories';

export const BASE_URL = 'https://www.maperformance.com';
export const MAKE = 'Honda';
export const MODEL = 'Civic Si (11th Gen)';
export const VENDOR_NAME = 'MAPerformance';

// Main collection for 11th Gen Civic Si
export const COLLECTION_HANDLE = '11th-gen-honda-civic-si-performance-parts';

// Map Shopify product_type → our standard categories
export const PRODUCT_TYPE_MAP: Record<string, StandardCategory> = {
  // Intake
  'air intakes, filters, & accessories': 'Intake',
  'blow off valves': 'Intake',
  'intercooler system components': 'Intake',
  // Engine
  'oiling system components': 'Engine',
  'oil system components': 'Engine',
  'cooling system components': 'Engine',
  'engine internals & components': 'Engine',
  'turbocharger kits & components': 'Engine',
  'turbochargers, kits & accessories': 'Engine',
  'fuel system components': 'Engine',
  'fuel system packages': 'Engine',
  'fuel pumps & surge tanks': 'Engine',
  'engine mounts': 'Engine',
  'motor mounts': 'Engine',
  'engine dress-up': 'Engine',
  'engine management & tuning components': 'Electrical',
  // Exhaust
  'exhaust components': 'Exhaust',
  'exhaust systems': 'Exhaust',
  'catalytic converters & test pipes': 'Exhaust',
  'downpipes': 'Exhaust',
  // Drivetrain
  'clutch kits, flywheels & accessories': 'Drivetrain',
  'drivetrain': 'Drivetrain',
  'drivetrain fluids': 'Drivetrain',
  'shifter components': 'Drivetrain',
  'shifters & accessories': 'Drivetrain',
  // Suspension
  'suspension': 'Suspension',
  'suspension components': 'Suspension',
  'coilovers & springs': 'Suspension',
  'sway bars & end links': 'Suspension',
  'swaybars': 'Suspension',
  'alignment components': 'Suspension',
  // Brakes
  'brake pads': 'Brakes',
  'brake kits & components': 'Brakes',
  'brake system components': 'Brakes',
  'brakes': 'Brakes',
  // Wheels & Tires
  'wheels': 'Wheels & Tires',
  'wheels & tires': 'Wheels & Tires',
  'wheels, tires & accessories': 'Wheels & Tires',
  // Exterior
  'exterior': 'Exterior',
  'exterior styling accessories': 'Exterior',
  'body kits & aero': 'Exterior',
  'lighting': 'Exterior',
  // Interior
  'interior': 'Interior',
  'interior accessories': 'Interior',
  'gauges & electronics': 'Interior',
  // Electrical
  'electrical': 'Electrical',
  'ecu tuning & electronics': 'Electrical',
  'batteries & mounting kits': 'Electrical',
  // Catchall
  'accessories': 'Accessories & Other',
};
