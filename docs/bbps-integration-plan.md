# Bharat Bill Payment System (BBPS) Integration Plan

## Goal

Turn JonoJivan’s existing bill-payment UI into a live, trusted bill-payment experience through the Bharat Bill Payment System (BBPS). The customer experience will retain the current dedicated service pages for electricity, FASTag, postpaid, LPG, EMI, insurance, broadband, water, and cable TV.

## Recommended participation model

JonoJivan should integrate through a regulated BBPS partner—typically a Customer Bharat Bill Payment Operating Unit (BBPOU), Biller Aggregator, or authorised agent institution—rather than attempting to connect directly to the BBPS central infrastructure.

This is the practical route for the product: BBPS is a tiered ecosystem in which BBPOUs handle aggregation and can onboard billers, payment gateways, agent networks, and digital customer touchpoints. NPCI describes Bharat BillPay as the consumer brand of BBPS; the system is designed for interoperable bill payments across channels. [NPCI overview](https://www.npci.org.in/who-we-are/milestone), [NPCI BBPS standards](https://www.npci.org.in/PDF/npci/bbp/notified-documents/Bharat%20Bill%20Payment%20System%20Business%20Standards%20Ver%201.1.pdf)

**Decision required before implementation:** choose a BBPS partner and complete its commercial, technical, KYC, security, settlement, and certification onboarding. Do not present JonoJivan as an authorised BBPOU unless it has that authorisation.

## Scope by service

| Existing service page | BBPS capability to enable | Customer flow |
| --- | --- | --- |
| Electricity | Biller discovery, bill fetch, payment, receipt | Select board → consumer number → fetch bill → pay |
| FASTag | Partner-confirmed availability and rules | Select issuer → vehicle / wallet ID → amount or fetch → pay |
| Postpaid | Mobile postpaid bill fetch and payment | Select operator → mobile number → fetch bill → pay |
| LPG gas | Biller-specific booking/payment support | Select provider → registered detail → fetch/pay |
| EMI payment | Lender availability through partner catalog | Select lender → loan account → fetch due → pay |
| Insurance | Insurer availability through partner catalog | Select insurer → policy number → fetch premium → pay |
| Broadband | Broadband bill fetch and payment | Select provider → customer ID → fetch bill → pay |
| Water bill | Supported water-board billers | Select board → consumer number → fetch bill → pay |
| Cable TV | Supported cable/DTH billers | Select operator → subscriber ID → fetch bill → pay |

Only expose a service/provider when it is returned as active by the chosen partner’s catalog. The homepage and navigation can still link to the service shell, but unsupported providers must show an honest unavailable state.

## Customer experience changes

### Hub and service cards

- Keep the current **Recharge & Bill Payments** hub and dedicated pages.
- Add a small, approved **Bharat BillPay / BBPS** trust treatment only after the partner confirms brand-use requirements.
- Load service availability from the partner catalog; hide or disable unavailable billers without breaking the page layout.
- Keep grocery, mobile recharge, DTH, and bill payment visually separate on the homepage as implemented.

### Shared live bill-payment flow

1. Select service and biller/operator from the live catalog.
2. Collect the biller-defined parameters (consumer number, policy number, loan account, etc.).
3. Fetch and display the bill response: account holder, masked identifier, bill period, due date, amount, and any biller messages.
4. Require an explicit customer review before payment.
5. Create payment intent/order with the server; send the customer to the approved payment method.
6. Verify payment server-to-server and submit/confirm the BBPS transaction exactly once.
7. Show success, pending, failed, already-paid, and fetch-error screens.
8. Provide a receipt, transaction reference, support route, save-biller option, and reminder option.

NPCI’s public BBPS material describes the expected consumer pattern as entering bill details, verifying them, paying, and receiving an instant BillPay receipt/confirmation. [NPCI brochure](https://www.npci.org.in/PDF/npci/knowledge-center/Corporate-Brochure-2022.pdf)

## Technical architecture

```text
JonoJivan web UI
  → JonoJivan server APIs
    → BBPS partner API (catalog, fetch, validate, pay/status)
    → payment gateway / UPI
  ← signed webhook + status reconciliation
  → transaction ledger, receipt, support/admin views
```

### Server-side modules

- `bbps/client`: partner authentication, request signing, timeouts, idempotency keys, retries.
- `bbps/catalog`: biller categories, providers, input fields, regions, availability, cached with a refresh job.
- `bbps/fetch`: parameter validation and bill fetch normalization into a stable UI response.
- `bbps/transaction`: create a local pending transaction before payment; state machine for initiated, paid, submitted, success, pending, failed, reversed, and refunded.
- `bbps/webhook`: signature verification, duplicate-event protection, audit logs, and asynchronous status updates.
- `bbps/reconcile`: scheduled reconciliation against partner reports/status endpoints; alert on unmatched or long-pending payments.
- `bbps/receipt`: immutable receipt snapshot with JonoJivan ID, partner/BBPS reference, biller, masked account, amount, timestamp, status, and complaint/support reference.

### Data model additions

- `BbpsBiller` / `BbpsBillerField`: partner catalog, service category, input schema, active status, last refresh time.
- `BillPaymentTransaction`: customer (nullable for guest flow), service, biller, masked parameters, fetch response snapshot, amount, fee/tax fields, local ID, payment gateway IDs, partner reference, status, timestamps, and idempotency key.
- `SavedBiller`: customer-owned nickname, biller, encrypted identifier or secure token according to partner policy, masked display value, consent timestamp.
- `BillPaymentEvent`: append-only webhook/status/reconciliation audit trail.
- `BillPaymentComplaint`: transaction reference, category, owner, status, resolution and partner ticket/reference.

Never store raw payment credentials. Encrypt sensitive biller identifiers at rest, mask them in logs and UI, and restrict operations access by role.

## Controls and operational requirements

- Use server-side partner credentials only; never expose partner keys, request signatures, or provider account identifiers to the browser.
- Implement idempotency for payment submission and webhook processing to prevent double bill payment.
- Treat partner callbacks as untrusted until their signature and replay protection are verified.
- Add rate limits and bot protection around bill fetch and payment initiation.
- Maintain a full transaction and reconciliation audit trail.
- Build customer-facing complaint, status, and receipt journeys before enabling production payments. BBPS materials describe centralised complaint/dispute handling as an ecosystem feature. [NPCI BBPS booklet](https://www.npci.org.in/PDF/npci/knowledge-center/NPCI%20Booklet.pdf)
- Confirm the partner’s applicable compliance, reporting, settlement, branding, retention, and grievance obligations with legal/compliance before launch.

## Delivery phases

### Phase 0 — Partner and compliance readiness

1. Shortlist BBPS-enabled partners that support the required categories and customer channel.
2. Confirm commercial model, settlement cycle, fee/commission rules, API/SLA, sandbox, webhooks, and production certification path.
3. Complete required due diligence, contracts, KYC/agent-institution onboarding, security review, legal review, and brand approval.
4. Obtain the partner’s definitive API schema and operational runbook.

### Phase 1 — Catalog and bill fetch

1. Add the catalog, biller availability, dynamic fields, and region handling.
2. Connect Electricity, Postpaid, Broadband, Water, LPG, Insurance, EMI, Cable TV, and FASTag one category at a time.
3. Replace mock provider lists and fixed amounts with partner responses.
4. Release fetch-only in staging with test billers and complete failure-state UX.

### Phase 2 — Payment and transaction integrity

1. Add local transaction ledger, payment gateway order/verification, idempotency, callback verification, and partner payment submission.
2. Build all status, receipt, retry, pending, reversal, and refund experiences.
3. Add reconciliation job, operational dashboard, alerting, and a support lookup tool.

### Phase 3 — Controlled production rollout

1. Launch one low-risk, high-demand category (normally electricity) to an internal cohort.
2. Monitor fetch success, payment success, duplicate prevention, pending ageing, complaint rate, and reconciliation mismatch rate.
3. Expand billers/categories only after the partner’s certification and JonoJivan’s support/reconciliation checks pass.
4. Enable saved billers, reminders, offers, and the BBPS trust mark only after the core transaction path is stable and approved.

## Launch acceptance criteria

- A biller catalog and input schema are sourced from the BBPS partner, not hard-coded mock data.
- A fetch response is always reviewed before a payment can be initiated.
- No payment is submitted twice for the same local transaction/idempotency key.
- Every successful, pending, failed, reversed, and refunded transaction has a searchable receipt and audit history.
- Webhook signatures, duplicate callbacks, stale responses, and reconciliation mismatches are handled safely.
- Customer support can locate a transaction by local ID, partner reference, or masked identifier.
- Production branding, disclosures, support, complaint, settlement, and compliance obligations are approved in writing.
