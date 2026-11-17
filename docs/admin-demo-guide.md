# Connected admin demo workspace

The admin panel now opens in **Demo workspace** after normal admin sign-in. It uses synthetic records in browser storage and does not call business APIs for demo actions. Existing authentication remains required.

## Using the demo

1. Open `/admin/dashboard` or `/admin/dashboard/wallet` after signing in.
2. Use the sidebar to browse wallet, commerce, people, finance, services, promotions, support, policies, and workspace settings.
3. Add or edit records, review withdrawals/refunds, and follow links to related accounts and transactions. Changes persist after refresh in the same browser.
4. Use **Roles & permissions** to preview Super admin, Finance, or Support. These are demo capabilities, not changes to the authenticated account.
5. Use **Preview page state** to inspect normal, empty, loading, error, or access-denied states without deleting saved records.
6. Use **Reset demo** to restore fixtures after confirmation.
7. **Exit demo** returns to the existing admin pages. These existing pages can use live APIs. New demo-only pages explain how to re-enter the demo. The selected workspace mode lasts for the browser session.

The dataset includes 20 customers, 6 vendors, 26 wallet accounts, 40 products, 40 orders, over 100 ledger entries, and linked payments, refunds, withdrawals, settlements, services, content, support, and audit records. Sample history is anchored to November 2026; newly created records use their creation timestamp. Dates are displayed in Asia/Kolkata and currency in INR.

## Wallet walkthrough

- **Withdrawals:** add a vendor request, approve it, start payout, then simulate paid or final failure. The request reserves funds immediately. Approval alone does not transfer funds. A final failure or rejection releases the reserve. Processing requests remain reserved until a final outcome.
- **Refunds:** select a paid transaction and a destination. Pending requests count toward the refundable limit. Completing a wallet refund adds one ledger credit. Original-payment refunds stay in the finance history without increasing wallet balance.
- **Adjustments:** create a reasoned credit or debit. Switch to a different authorized demo role before approving it. A posted adjustment can be reversed once, creating a separate immutable ledger entry.
- **Top-ups:** only simulated successful confirmation credits the wallet.
- **Cashback:** award and expire promotional credit separately from cash balances. The saved default percentage is a demo rule setting; credits are issued explicitly.
- **Accounts:** inspect cash, reserves, paid withdrawals and promotional credit; freeze/unfreeze with an audit reason.
- **Reports:** export the currently filtered records. Financial summaries separate collections, refunds, expenses and payouts; internal transfers and top-ups are not sales.

Wallet amounts use integer paise. The existing vendor accounting convention is retained: paid withdrawals are deducted separately from ledger credits, so payout confirmation does not also create a duplicate debit.

## Implementation map

- `src/lib/admin/demo/fixtures.js`: versioned synthetic records and relationships.
- `src/lib/admin/demo/store.js`: pure mutations, balance calculations, permissions, validation and audit events.
- `src/lib/admin/demo/routes.js`: navigation, route definitions and detail links.
- `src/components/adminPanel/demo/`: provider, forms, actions, tables, reports, detail pages and shared demo UI.
- `AdminShell.jsx`: explicitly selects demo rendering or the existing page children. Existing live page components remain available; they are not mounted in demo mode.
- New App Router pages reuse `DemoOnlyPage` as the non-demo explanation. The shell renders the corresponding connected demo page. Unknown page paths still render the 404 page (Next.js may stream that response with HTTP 200); unknown browser-stored record IDs show a record-not-found state.

Storage is browser-local, versioned, and resettable. Unavailable storage produces a visible message rather than silently claiming persistence. This is not multi-user storage, a real wallet provider, or a production payout integration.

## Verification

Run `npm run test:admin-demo` for fixture integrity, payout reservation arithmetic, duplicate submission protection, refund caps, reviewer separation, reversals, permissions, category validation, and route coverage. The tests use no database or external services.

Run `npm run build` for the production build. Development uses `.next-dev`, while production build/start use `.next`, so they can run concurrently. For a separate browser-test production build, you can additionally select an isolated output directory:

```sh
NEXT_BUILD_DIR=.next-admin-demo-test npm run build
NEXT_BUILD_DIR=.next-admin-demo-test npm run start -- -p 3100
```

The isolated output directory is ignored by Git. The default application build directory remains `.next`.

## Production boundary

Demo mutations never submit orders, payouts, refunds, emails, policy changes or support messages to live services. Production money movement, server-backed customer wallets, provider reconciliation and durable audit permissions remain separate integration work. The existing vendor wallet API and schema are preserved.

## Completed checks

- Production build succeeded using the isolated Next.js output directory.
- Ten domain-test groups passed, covering fixture relationships, money arithmetic, duplicate actions, refund limits, role restrictions and route coverage.
- Chromium visited all 52 static demo destinations and 14 representative detail destinations, plus edit routes.
- Browser workflows exercised withdrawal creation/approval/payout, persistence after refresh, product creation/search, support replies, wallet refunds and linked ledger credits, profile/header updates, page-state previews, filtered CSV exports, missing records, mobile menu keyboard dismissal, light/dark themes, and reset.
- The browser run recorded zero page errors and zero calls to `/api/` during demo workflows.

The demo includes all sections in the route matrix. Changes are intentionally local to the browser; live financial integrations are not enabled by this work.
