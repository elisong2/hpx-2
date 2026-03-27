Currently in development. This is HPX-2, intended to be the PCPartPicker for cars. Akin to PCPartPicker, you will be able to view aggregated lists of available parts on the market and filter them according to what is compatible with your vehicle, projects of other users, and guides. Be sure to visit again!

Current goals:

- UI styling
- web scraping algorithm

Notes:

- User auth and image storage/gallery are complete.

Stack:

- Typescript, Next.js, React, Tailwind, Supabase/Postgres, Playwright, Vercel

Features:

- Parts aggregation and price comparison
- Completed builds gallery
- Forums
- Guides

Limitations:

- Many car parts retailers don't seem to have a dev friendly API to collect prices so web scraping tools will be utilized, slowing down number of support retailers
- The site relies on image storage, so for now capacity will be quickly reached on free Supabase
