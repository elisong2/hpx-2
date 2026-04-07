Currently in development. This is HPX-2, intended to be the PCPartPicker for cars. Akin to PCPartPicker, you will be able to view aggregated lists of available parts on the market and filter them according to what is compatible with your vehicle, projects of other users, and guides. Be sure to visit again!

Visit current design at: https://hpx2.vercel.app/

Stack:

- Typescript, Next.js, React, Tailwind, Supabase/Postgres, Playwright, Vercel

Current goals:

- comments section for posts
- Adding parts support for more car models
- Adding more guides/resources (buyer's guides, repair guides, shops, forums)

Current cars supported:

- NA1/NA2 NSX
- E46 M3
- ND Miata

Future cars:

- Golf GTI/R
- Civic
- Skyline GTR
- S chassis
- Z chassis
- Mk5 Supra
- E36/E30
- JZX100 Chaser

Features:

- User sign in
- Parts aggregation and price comparison
- Completed builds gallery
- Forums
- Guides

Limitations:

- Many car parts retailers don't seem to have a dev friendly API to collect prices so web scraping tools will be utilized, slowing down number of support retailers
- Prices may not always be up to date. Will have to schedule scraping to remedy this
- The site relies on image storage, so for now capacity will be quickly reached on free Supabase
