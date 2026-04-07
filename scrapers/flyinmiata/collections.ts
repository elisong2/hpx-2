/**
 * Flyin' Miata ND (2016+) Shopify collections and category mapping.
 * Using the leaf-level subcollections to avoid duplicate products from parent collections.
 */

import type { StandardCategory } from '../categories';

export const BASE_URL = 'https://www.flyinmiata.com';
export const MAKE = 'Mazda';
export const MODEL = 'ND Miata';
export const VENDOR_NAME = "Flyin' Miata";

type CollectionEntry = {
  handle: string;
  category: StandardCategory;
};

// Map each ND subcollection to our standard categories
export const ND_COLLECTIONS: CollectionEntry[] = [
  // Body
  { handle: 'nd-body-aerodynamics', category: 'Exterior' },
  { handle: 'nd-body-interior', category: 'Interior' },
  { handle: 'nd-body-lighting', category: 'Electrical' },
  { handle: 'nd-body-miscellaneous', category: 'Accessories & Other' },
  { handle: 'nd-body-towing', category: 'Accessories & Other' },

  // Brakes
  { handle: 'nd-brakes-brake-components', category: 'Brakes' },
  { handle: 'nd-brakes-brake-packages', category: 'Brakes' },

  // Handling
  { handle: 'nd-handling-bracing', category: 'Suspension' },
  { handle: 'nd-handling-bushings', category: 'Suspension' },
  { handle: 'nd-handling-coilovers', category: 'Suspension' },
  { handle: 'nd-handling-handling-packages', category: 'Suspension' },
  { handle: 'nd-handling-springs-shocks-swaybars', category: 'Suspension' },
  { handle: 'nd-handling-suspension-components', category: 'Suspension' },

  // Maintenance
  { handle: 'nd-maintenance-books', category: 'Accessories & Other' },
  { handle: 'nd-maintenance-lubrication', category: 'Engine' },
  { handle: 'nd-maintenance-parts', category: 'Engine' },
  { handle: 'nd-maintenance-tools', category: 'Accessories & Other' },

  // Powertrain
  { handle: 'nd-powertrain-clutch-and-transmission', category: 'Drivetrain' },
  { handle: 'nd-powertrain-cooling', category: 'Engine' },
  { handle: 'nd-powertrain-electrical', category: 'Electrical' },
  { handle: 'nd-powertrain-exhaust', category: 'Exhaust' },
  { handle: 'nd-powertrain-intake', category: 'Intake' },
  { handle: 'nd-powertrain-turbo-systems', category: 'Intake' },

  // Safety
  { handle: 'nd-safety', category: 'Interior' },

  // Wheels
  { handle: 'nd-wheels', category: 'Wheels & Tires' },
];
