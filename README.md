# EQWorks data visualization exercise
My work for the EQWorks Application Development Track assignment. [See demo](https://eqw-appdev-sol.vercel.app)

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-t3-app`](https://create.t3.gg).
Includes React, tRPC and Prisma.

What has been done:
- ⚡️ Migrated EQWorks API from Express to tRPC using Prisma.
- 🧿 Wrote custom middleware for rate limiting API routes using LRU cache.
- 📱 Built a responsive UI with ability to add and remove charts for comparison.
- 💾 Set up automatic saving of user workspaces in local storage.
- 📈 Created interactive data visualizations using line charts from Chart.js.
- 📊 Implemented chart axes synchronization between multiple charts for ease of comparison.
- 🏎 Implemented lazy loading and deferred rendering for all components

# To run the app locally

Clone the repository, then run:
```bash
npm run dev
```
