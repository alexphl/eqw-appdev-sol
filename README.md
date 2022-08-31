# EQWorks data visualization exercise
My work for the EQWorks Application Development Track assignment. [See demo](https://eqw-appdev-sol.vercel.app)

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-t3-app`](https://create.t3.gg).
Includes React, tRPC and Prisma.

What has been done:
- Migrated EQWorks API from Express to tRPC using Prisma.
- Implemented custom middleware for rate limiting API routes using LRU cache.
- Responsive UI with ability to add and remove charts for comparison.
- Automatic saving of user workspaces in local storage.
- Interactive data visualizations using line charts from Chart.js.
- Dynamic chart axis for consistency when displaying multiple charts.

# To run the app locally

Clone the repository, then run:
```bash
npm run dev
```
