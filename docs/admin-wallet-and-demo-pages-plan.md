# Admin panel: wallet, complete pages, and connected demo data

Date: 18 November 2026
Status: implemented as a connected browser-local admin demo. See [usage and verification](admin-demo-guide.md) and the [route matrix](admin-demo-route-matrix.md). Production money movement remains separate integration work.

## 1. Scope and outcome

Build a complete, navigable admin demo in which every listed page has realistic data and working preview actions. Prioritize wallet operations and finance, then complete commerce, users, vendors, services, content, support, and settings. Customer and vendor storefront redesigns are outside this plan; their records appear in admin management views.

Assumption: “wallet” includes vendor earnings administration and customer store-credit administration. Customer top-ups and cashback are simulated extensions; vendor withdrawals build on the existing implementation. Peer-to-peer transfers, customer cash withdrawals, and actual payment/payout execution are excluded from the demo release.

## 2. Existing implementation to reuse

- Next.js App Router, React, Tailwind, Prisma/PostgreSQL.
- Admin shell, navigation, shared page layouts, demo list/form components, loading/error/not-found states already exist.
- Existing admin finance pages: overview, transactions, refunds, settlements, expenses, reports. Demo records currently live in `src/lib/adminDemoData.js`.
- Existing admin routes cover orders, products, category hierarchy, users, ration cards, blogs, reviews, policies, profile, and settings. Route existence does not establish that every action is complete; audit these during phase 1.
- Vendor wallet already has overview, transactions, withdrawal UI, and workspace API. `VendorLedgerEntry` and `VendorWithdrawal` are present in Prisma. Withdrawals reserve funds; a database advisory lock protects the balance check.
- Current vendor balance calculation subtracts pending and paid withdrawals from signed settlement entries. Any future ledger migration must avoid subtracting paid withdrawals twice.
- Admin wallet management routes do not currently appear in the inspected admin page inventory.

Preserve existing URLs, including legacy spellings. Work with existing uncommitted changes; do not replace working layouts or vendor wallet logic wholesale.

## 3. Navigation and page inventory

All routes below are relative to `/admin/dashboard`. “Existing” means a page or dynamic section is present, not that its full proposed behavior exists. Each detail route must be reachable from its list and support a direct browser refresh.

### Wallet — new section

| Route | Screen and features | Demo coverage |
| --- | --- | --- |
| `/wallet` | Overview: customer credits, vendor available earnings, held withdrawals, credits/debits over time, pending actions | Calculated totals and 30-day chart |
| `/wallet/accounts` | Customer/vendor tabs, search, status and balance filters | Active, frozen, zero-balance accounts |
| `/wallet/accounts/[walletId]` | Owner, balance breakdown, ledger, related orders, holds, freeze/unfreeze with reason | Customer and vendor accounts with linked activity |
| `/wallet/transactions` | Searchable ledger; owner, type, status, date filters; CSV export | Credits, debits, refunds, earnings, reversals |
| `/wallet/transactions/[transactionId]` | Reference, amount, source, timeline, linked order/payout, receipt | Posted, pending, failed, reversed examples |
| `/wallet/topups` | Simulated customer top-up requests and payment references | Successful, pending, failed attempts |
| `/wallet/withdrawals` | Vendor request queue, destination preview, approve/reject, payout simulation | Pending, approved, processing, paid, rejected, failed |
| `/wallet/withdrawals/[withdrawalId]` | Request details, review history, reason, payout attempt/reference | Successful and failed payout timelines |
| `/wallet/refunds` | Eligible wallet refund requests, partial/full amount, review and source linkage | Partial, full, rejected, completed refunds |
| `/wallet/adjustments` | Credit/debit proposal, required reason, review, linked reversal | Correction, goodwill credit, rejected debit |
| `/wallet/cashback` | Demo cashback rules and credit history | Earned, pending, expired promotional credits |
| `/wallet/reports` | Balances by owner type, liability, activity, withdrawals, reconciliation exceptions | Reports derived from the ledger |
| `/wallet/settings` | Demo withdrawal limits, cashback rules, approval policy | Validation and saved demo configuration |

### Finance — extend existing pages

| Route | Status | Features |
| --- | --- | --- |
| `/finance` | Existing | Collections, refunds, fees, expenses, payouts; linked breakdowns |
| `/finance/transactions` | Existing | All payment methods; link wallet entries instead of duplicating them |
| `/finance/refunds` | Existing | Original-payment and wallet destinations, shared refund records |
| `/finance/settlements` | Existing | Vendor earning batches, gross/fee/net breakdown; link withdrawal records |
| `/finance/expenses` | Existing | Add/edit demo expenses, categories, dates, notes |
| `/finance/reports` | Existing | Date range, revenue/expense summaries, CSV export |
| `/finance/settlements/[settlementId]` | New | Included orders, fees, adjustments, posting history |
| `/finance/reconciliation` | New | Matched/unmatched payments, duplicate references, discrepancy review |

Finance collections are not wallet liabilities or vendor profit. Define each metric explicitly and avoid counting internal wallet movements as new sales.

### Complete remaining admin sections

| Area | Existing routes to complete | New routes | Features and fixtures |
| --- | --- | --- | --- |
| Dashboard | `/` | — | Derived KPIs, sales trend, recent orders, low stock, pending withdrawals, support queue |
| Orders | `/orders`, `/orders/searchOrders`, `/orders/[orderNo]` | `/orders/returns`, `/orders/returns/[returnId]` | Search, fulfillment timeline, payment summary, invoice, cancellations, returns and refund links |
| Products | `/product/allProduct`, `/product/addProduct` | `/product/[productId]`, `/product/[productId]/edit`, `/inventory` | Product CRUD preview, images, prices, stock, availability, low-stock alerts |
| Categories | `/category/allCategory`, `/category/addCategory`, `/category/addSubCategory`, `/category/addSubSubCatgeory` | `/category/[categoryId]/edit` | Three-level hierarchy, edit/archive, prevent orphaned product categories |
| Customers | `/users`, `/user/search` | `/users/[userId]` | Customer profile, addresses, orders, wallet link, account status |
| Vendors | — | `/vendors`, `/vendors/[vendorId]` | Approval/status, business details, products, orders, earnings, wallet and support links |
| Ration cards | `/rationCards` | `/rationCards/[cardId]` | Application detail, masked identifiers, approve/reject reason |
| Recharge and bills | — | `/services`, `/services/recharges`, `/services/bills`, `/services/transactions/[transactionId]` | Mobile, DTH and bill activity; provider references, processing/failure/reversal timelines |
| Promotions | — | `/promotions/coupons`, `/promotions/banners` | Demo create/edit, validity, limits, expired/active states; cashback links to wallet rules |
| Blogs | `/blog/allBlog`, `/blog/addBlog` | `/blog/[blogId]/edit` | Draft/published states, preview, categories, cover images |
| Reviews | `/review/addReview` | `/reviews` | Review queue, rating filters, approve/hide actions; retain existing route |
| Support | — | `/support/tickets`, `/support/tickets/[ticketId]`, `/support/messages` | Customer/vendor tickets, conversation, priority, assignment, status and demo replies |
| Policies | `/policy/privacyPolicy`, `/policy/returnPolicy`, `/policy/shippingPolicy`, `/policy/termsAndCondition` | — | Demo editing, preview, saved version and updated date |
| Notifications | — | `/notifications` | Wallet, order, vendor and support alerts; read/unread; linked destinations |
| Account and settings | `/profile`, `/settings` | `/settings/roles`, `/settings/audit-log` | Profile, store/contact settings, role matrix, actor/action/reason/time audit events |

Admin authentication remains at `/admin/auth`. Include demo sign-in errors and expired-session handling without weakening real authentication. Unknown routes must continue to show a real 404.

## 4. Wallet behavior and rules

1. **Overview:** separate customer funds, promotional credit, vendor earnings, reserved withdrawals, and cumulative payouts. Never show their sum as spendable platform cash.
2. **Ledger:** retain immutable posted transactions. Corrections create linked reversals; never edit/delete a posted amount. Store integer paise in demo calculations; format INR only for display.
3. **Withdrawals:** `PENDING → APPROVED → PROCESSING → PAID`. Rejection before processing releases the hold. Provider failure releases funds only when failure is final; unknown outcomes stay pending reconciliation. Retrying uses the same business request and cannot reserve funds twice.
4. **Approval versus payment:** approving a request does not mark it paid. Demo controls separately simulate payment success, failure, and timeout.
5. **Refunds:** link to the original successful payment; cumulative refunds cannot exceed the refundable amount. Enforce partial-refund arithmetic and one destination per refund. Prevent refunding both to wallet and original payment for the same amount.
6. **Adjustments:** require owner, amount, reason, and reference. Reject insufficient-balance debits. Record proposer and reviewer; roles can demonstrate maker/reviewer separation.
7. **Top-ups:** simulated confirmation credits funds once. Pending/failed payments do not increase balance; duplicate callbacks do not add another credit.
8. **Cashback:** keep promotional balance separate, model eligibility and expiry, and never treat expired credit as withdrawable earnings.
9. **Freeze:** stop new spending/withdrawals while allowing history and review. Define refund handling independently; freezing must not silently prevent correcting an erroneous charge.
10. **Audit:** every mutation records actor, timestamp, reason, related record, and status change. Mask payout destinations in lists.

Demo scenarios must include repeated submission, insufficient funds, refund limit exceeded, failed payout, expired cashback, frozen account, permission denied, and unknown reference.

## 5. One connected demo dataset

Replace disconnected page constants incrementally with a normalized demo store. Suggested organization:

```text
src/lib/admin/demo/
  fixtures.js       # Stable IDs and related records
  store.js          # Versioned persistence, actions, reset
  selectors.js      # Shared balance, report and dashboard calculations
  scenarios.js      # Success, empty, pending, failed and permission states
  validation.js     # Money, relationships and status transition rules
src/components/adminPanel/wallet/
src/components/adminPanel/shared/
```

Use the existing `adminDemoData.js` exports as a temporary compatibility adapter. All new screens consume the same store/selectors; no per-page random balances.

### Fixture targets

| Entity | Initial target | Required variety |
| --- | ---: | --- |
| Customers / vendors | 20 / 6 | Repeat/new customers, approved/pending/suspended vendors |
| Categories / products | 8 top-level / 40 products | Subcategory hierarchy, images, low/out-of-stock products |
| Orders | 40 | Pending, processing, shipped, delivered, cancelled, returned |
| Wallet accounts | 26 | Customer and vendor accounts; active, frozen and empty |
| Wallet ledger entries | 100+ | Linked credits, debits, refunds, settlements and reversals |
| Withdrawals / refunds | 12 / 10 | All supported statuses, partial refunds, final failures |
| Settlements / expenses | 8 / 12 | Draft/posted batches, varied expense categories |
| Recharge/bill transactions | 20 | Success, processing, failure and refund linkage |
| Tickets / reviews | 12 / 20 | Open/resolved conversations, rating and moderation states |
| Blogs / coupons / banners | 6 / 6 / 4 | Draft/published, active/expired states |
| Ration applications / contact messages | 8 / 8 | Pending, approved, rejected and unread/read |
| Policies / admin roles | 4 / 3 | Complete policy content; super admin, finance, support |

Use synthetic names, `example.com` emails, placeholder identifiers, and local/product placeholder images. Use stable IDs, ISO timestamps, INR formatting and Asia/Kolkata display times. Anchor sample dates to a documented demo date so date filters give predictable results.

### Reconciliation example

- Vendor opening earnings: ₹12,000; new posted settlement: ₹3,000.
- Pending withdrawal: ₹2,000; already paid withdrawal: ₹4,000.
- Available: ₹9,000; reserved: ₹2,000; cumulative paid out: ₹4,000.
- Reject the pending withdrawal: available becomes ₹11,000, reserved becomes ₹0.
- Pay it instead: available remains ₹9,000, reserved becomes ₹0, cumulative paid out becomes ₹6,000.

For the existing vendor calculation, do not also post a payout debit and subtract the same paid withdrawal. If adopting a ledger-only payout model later, migrate the calculation and records together.

Customer example: ₹1,000 top-up − ₹350 purchase + ₹100 partial refund = ₹750 cash balance. A separate ₹50 promotional credit must not silently change cash balance to ₹800.

## 6. Demo interaction architecture

- Provide a clearly marked admin demo mode and a persistent “Demo data — no real payments” indicator.
- Select the demo data adapter explicitly. Do not silently fall back to fake data when a real API fails.
- Demo actions update only the demo store. Disable calls to real order, refund, payout, messaging and policy-write APIs from demo screens.
- Persist versioned demo state in browser storage after hydration; reset restores the original fixtures. Provide reset confirmation and migration/reset behavior for stale fixture versions.
- Deep links load from stable IDs. Invalid IDs show not-found; fixture records must never trigger real database lookups.
- Forms create/update records, validate inputs and show success/error messages. New records appear in lists and related detail pages immediately.
- Search, filters, sorting and pagination work together. Filters reset pagination. CSV exports use the current filtered results and escape cells correctly.
- Dashboard totals, wallet totals, reports and notifications update from the same action results.
- Role switching is a demo preview only. Production permissions remain enforced by server authentication and authorization.

## 7. Shared UI requirements

Reuse `AdminShell`, `AdminPage`, existing table/form conventions and admin theme tokens. Add reusable money cards, status badges, filter bars, date ranges, paginated tables, detail timelines, reason dialogs, confirmation dialogs, receipts, and empty/error states.

Every page needs a heading, breadcrumb, primary action when applicable, demo label, useful data, loading/empty/error states, and a clear route back. Match existing light/dark themes. On mobile, use readable cards or contained table scrolling. Support keyboard navigation, visible focus, labelled inputs and status text beyond color.

Avoid generic placeholder pages or buttons that only show “coming soon.” Where a feature is intentionally unavailable, label it explicitly and explain why in context.

## 8. Implementation phases and completion gates

| Phase | Deliverables | Gate |
| --- | --- | --- |
| 1. Inventory and foundation | Route checklist, action/API audit, shared fixtures, demo adapter, persistence/reset, sidebar grouping | Existing demo pages load from one dataset; demo mutations cannot reach live APIs |
| 2. Wallet core | Overview, accounts/detail, ledger/detail, filters and exports | All totals reconcile; direct links and invalid IDs work |
| 3. Wallet operations | Withdrawals/detail, refunds, adjustments, top-ups, cashback, settings, reports | Success/failure/retry scenarios update related pages exactly once |
| 4. Finance integration | Shared payments/refunds/payouts, settlement detail, expenses, reconciliation | No duplicate financial records or double-counted dashboard amounts |
| 5. Commerce and people | Complete order/product/category/customer pages; add inventory, returns and vendors | CRUD preview and cross-record navigation work end to end |
| 6. Remaining sections | Services, promotions, content, ration cards, support, notifications, roles/audit | Every inventory page has linked fixtures and functional demo actions |
| 7. QA and handover | Responsive/accessibility review, scenario checks, route coverage report, demo walkthrough | No dead sidebar links, broken detail links or unexplained empty pages |

Phases 1–4 form the wallet-first review milestone. Phases 5–7 complete the full admin demo. Estimate effort after phase 1 identifies which existing actions are already functional.

## 9. Verification and definition of done

- Maintain a route/action matrix recording route, fixture IDs, expected result, tested status and remaining gaps.
- Walk through: vendor settlement → withdrawal → review → payout → report; customer purchase → partial refund → wallet detail; product creation → inventory → order detail; support ticket → reply → notification.
- Validate referenced owners/orders/transactions exist and every dashboard aggregate matches its underlying rows.
- Test insufficient balance, duplicate mutation, over-refund, invalid status transition and reversed transactions using focused store/domain tests.
- Verify reset and browser refresh; test empty/filter-no-results, loading, error, denied and unknown-record states.
- Check desktop/mobile and light/dark rendering. Verify forms and dialogs by keyboard.
- Inspect network activity during demo mutation flows: no live financial or business mutations.
- Run the project build and relevant existing checks after implementation. This planning change itself does not require application tests.

Complete means every route in this plan is implemented or explicitly deferred in the route matrix, with any deferral surfaced before calling the full admin demo finished. All displayed amounts must be explainable from fixtures, and every visible action must work in demo mode or be clearly disabled with a reason.

## 10. Later production integration

After demo acceptance, implement server-backed admin wallet services with role checks, transactional updates, idempotency keys, audit records and reconciliation. Review existing vendor model/status compatibility before schema changes. Preserve existing records and test migration arithmetic. Customer wallet storage, top-up/payment verification and payout integrations require separate production implementation; the demo does not establish that these services are live.

Keep the same UI contracts so the demo adapter can be replaced module by module. Validate production permissions on the server, verify provider confirmations, and test concurrent spending/withdrawals before enabling actual money movement.
