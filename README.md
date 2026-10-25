This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Database

The application uses Neon PostgreSQL through Prisma. Set `DATABASE_URL` in `.env`;
MongoDB configuration and the legacy `AUTH_DATABASE` selector are not used by the app.
Mongoose is retained only as a development dependency for historical import/backup scripts.
Those scripts are never run during installation, builds, or normal application requests.

`npm install` and `npm run build` automatically generate the Prisma client. Apply saved
schema migrations with `npm run db:deploy`. Run repository checks with
`npm run test:prisma-repositories` and read-only connection checks with
`npm run db:check-neon`.

Run `npm run test:recharge-neon` to test mobile and DTH order creation, payment
verification, operator environment mappings, refunds, status polling, callbacks,
and reconciliation against a temporary schema on the configured Neon database.
The test uses the real Prisma repositories and route handlers. It substitutes
payment/provider responses, blocks unexpected external calls, and removes its
schema and test transactions afterward. No live payments or recharges are sent.
The database role needs permission to create and drop the temporary schema.

## Recharge reconciliation on Vercel

The `jonojivan_grocery` project uses Vercel Hobby. `vercel.json` schedules
`/api/recharge/reconcile` once daily at 00:00 UTC (approximately 05:30–06:29 IST,
since Hobby schedules can run anywhere within the scheduled hour).

Set `CRON_SECRET` in Vercel's **Production** environment to the generated value
in your local `.env`, then deploy this repository configuration. Vercel sends
`Authorization: Bearer <CRON_SECRET>` automatically. The route returns HTTP 401
when the header is missing or incorrect; keep the secret out of `vercel.json`.

Cron registration occurs on production deployment. Local builds do not activate
the hosted schedule. Verify the deployed job under the project's Settings →
Cron Jobs. Run `npm run test:recharge-cron` to check the configured schedule and
authentication without processing transactions.

References: [Vercel cron authentication](https://vercel.com/docs/cron-jobs/manage-cron-jobs#securing-cron-jobs),
[Vercel Hobby scheduling limits](https://vercel.com/docs/cron-jobs/usage-and-pricing#hobby-scheduling-limits).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
