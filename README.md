This is HPX-2, intended to be the PCPartPicker for cars. Currently in development. Major focuses are UI and a web scraping pipeline to aggregate products. User auth and image storage/gallery are complete. Be sure to visit again!

Current goals:

- UI styling
- web scraping algorithm

Stack:

- Typescript, Next.js, React, Tailwind, Supabase/Postgres, Playwright, Vercel

Limitations:

- Many car parts retailers don't seem to have a dev friendly API to collect prices so web scraping tools will be utilized, slowing down number of support retailers
- The site relies on image storage, so for now capacity will be quickly reached on free Supabase
