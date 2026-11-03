# Bill Payments UI/UX Plan

## Objective

Expand the current **Recharge** experience into a unified **Recharge & Bill Payments** hub. The experience must make it easy to find a service, enter an account identifier, review the bill or amount, and proceed to payment. This plan covers interface and user experience only; it does not prescribe provider APIs, bill-fetch logic, payment processing, or commission calculations.

## Services to include

| Service | Card label | Identifier collected | Amount journey | Reference commission slab* |
| --- | --- | --- | --- | --- |
| Electricity | Electricity bill | Consumer / account number | Fetch bill, then review | ₹1.40 |
| FASTag | FASTag recharge | Vehicle number or wallet ID | Customer enters amount | 0.10% |
| Mobile postpaid | Mobile postpaid | 10-digit mobile number | Fetch bill, then review | ₹1.40 |
| LPG gas | LPG gas booking | Registered mobile / consumer ID | Fetch payable amount | ₹1.35 |
| EMI payment | EMI payment | Loan account number | Fetch EMI due | ₹2.00 |
| Insurance | Insurance premium | Policy number | Fetch premium due | ₹2.00 |
| Broadband | Broadband bill | Customer / landline ID | Fetch bill, then review | ₹1.55 |
| Water bill | Water bill | Consumer number | Fetch bill, then review | ₹2.00 |
| Cable TV | Cable TV bill | Subscriber / smart-card ID | Fetch bill, then review | ₹2.00 |

\*The slab values are kept as internal operational reference from the supplied image. They should not be presented as a customer discount, cashback, or guaranteed price saving unless a separately approved commercial rule supports that claim.

## Information architecture

### Navigation

- Rename the primary entry to **Recharge & Bills** while preserving existing `/recharge` links.
- On the hub, lead with two top-level tabs: **Mobile recharge** and **Bill payments**.
- Add a visible **All services** grid and a **Recent & saved bills** strip below it.
- Keep DTH available as a service card under recharge, alongside mobile recharge, instead of hiding it in a secondary route.

### Service discovery

The bill-payment grid should use recognisable icons, a concise label, and a supporting verb:

- Electricity — Pay electricity bill
- FASTag — Recharge your FASTag
- Postpaid — Pay mobile postpaid bill
- LPG gas — Book and pay for LPG
- EMI payment — Pay loan EMI
- Insurance — Pay insurance premium
- Broadband — Pay broadband bill
- Water bill — Pay water bill
- Cable TV — Pay cable TV bill

Order the first row around high-frequency use: Electricity, FASTag, Postpaid, LPG. On small screens use a two-column grid; on desktop use four columns. The full card—not just the icon—must be tappable.

## Core journey

Every bill service should follow the same predictable sequence:

```text
Choose service → choose provider → enter account detail → fetch / enter amount
→ confirm bill details → pay → status and receipt
```

### 1. Hub

- Header: “Recharge & Bill Payments” and subtext “Pay everyday bills in a few taps.”
- A prominent search field: “Search electricity, FASTag, broadband…”
- Quick actions for the last three successful payments.
- Service grid, then a small trust row: secure checkout, payment status updates, and help.

### 2. Service setup

Use a reusable page shell for all services:

- Breadcrumb: Home / Recharge & Bills / `{Service}`.
- Service icon, name, and short reassuring description.
- Provider picker first, with search when the provider list is long.
- One clearly labelled identifier field with a contextual example and inline validation.
- Secondary fields only when required by the selected provider or circle.
- A full-width primary CTA: **Fetch bill** or **Continue** for amount-entry services.

Do not ask users to select a provider before they understand what identifier is needed. Show a one-line hint under the chosen provider, such as “Find your consumer number on the top-right of your bill.”

### 3. Bill / amount review

For fetched bills, show a clean summary card:

- Provider logo and name
- Account holder name, when available
- Masked account identifier
- Bill amount, due date, and bill period where supplied
- “Bill details” disclosure for optional fields

For FASTag or other recharge-style services, provide a segmented amount picker with common values and an **Other amount** option. Keep the selected amount visually persistent in the sticky action area.

The primary CTA reads **Pay ₹{amount}**. Beneath it, show a plain-language note: “Please check the account details. Payments cannot be moved after completion.”

### 4. Confirmation, progress, and receipt

- Reuse the existing status-page visual language.
- States: **Payment successful**, **Processing**, **Payment failed**, **Bill already paid**, and **Unable to fetch bill**.
- A successful state includes payment reference, paid-to provider, masked identifier, amount, date/time, and actions for **Download receipt**, **Pay another bill**, and **Back to Recharge & Bills**.
- Processing must explain that no repeat payment is needed and show when status will refresh.

## Reusable UI components

Build the bill-payment area from a small component set so future services stay consistent:

- `BillServiceCard` — icon, title, supporting text, optional “Popular” badge.
- `ServiceIcon` — consistent rounded icon tile; never depend on provider logos alone for recognition.
- `ProviderPicker` — searchable provider grid/list with selected state.
- `AccountField` — label, example, help link, validation, and privacy-safe masking.
- `BillSummaryCard` — provider, account, amount, due date, and expandable details.
- `AmountPicker` — suggested values plus custom amount input.
- `SavedBillCard` — nickname, provider, masked account, and repeat-pay action.
- `PaymentStatusCard` — shared success, pending, failure, and retry states.

## Visual direction

- Continue the current brand’s deep-blue recharge palette, white cards, warm yellow highlights, and rounded corners; avoid reproducing the supplied promotional artwork’s dense text-and-icon layout.
- Use one focused hero on the hub; individual service pages should be quieter and form-led.
- Use real service-specific line icons in a consistent stroke style: bolt, tag/car, phone, gas cylinder, calendar/rupee, shield, router, faucet, and TV.
- Emphasise the customer’s payable amount; do not display internal commission slabs in customer-facing screens.
- Reserve yellow for selections, due-date attention, and the primary payment action—not every label.

## Responsive and accessibility requirements

- Mobile first: 44 × 44 px minimum targets, sticky bottom CTA, and no horizontally clipped provider choices.
- Desktop: content max-width around 1200 px, with the setup form and contextual help in a two-column layout only at large breakpoints.
- Every icon must have adjacent text; colour cannot be the only status indicator.
- Inputs need programmatic labels, error text connected through `aria-describedby`, numeric keyboards where suitable, visible focus rings, and readable contrast.
- Preserve entered account details when switching provider only if that identifier format remains valid; otherwise ask before clearing it.

## Important UX states

- **New visitor:** no saved accounts; show all services and short onboarding hints.
- **Returning visitor:** show recent/saved bill cards above the grid; sensitive numbers remain masked until edit.
- **Provider unavailable:** disable the provider with a clear reason and offer another provider or return to the service grid.
- **Invalid identifier:** validate format early but do not imply the account exists until the bill is fetched.
- **No bill due / already paid:** explain the result, retain provider/account details, and offer another payment.
- **Fetch timeout:** retain entries and provide a single retry action; do not make the user retype information.
- **Payment pending:** lock duplicate payment attempts and make the support/reference path easy to find.

## Delivery sequence (UI/UX only)

1. Create the Recharge & Bills hub, tab switcher, service grid, search, and responsive layout.
2. Design the shared service setup shell and implement static variants for all nine services.
3. Add provider selection, identifier-field variants, bill summary, amount picker, and review components using mock data.
4. Add saved/recent bill cards and the complete status/receipt visual states.
5. Run mobile, keyboard, contrast, empty-state, and error-state review before connecting any live service.

## UI acceptance criteria

- All nine services listed above are visible, searchable, and have a distinct icon and setup route/state.
- A user can complete the interface journey from service selection through receipt using mock data, without needing backend integration.
- Each service explicitly tells the user which account detail is required before data entry.
- Mobile users can complete the journey one-handed with a persistent, non-obscuring CTA.
- Success, pending, failure, no-bill, and retry states are designed for every service.
- Commission information remains internal and is not surfaced to customers by default.
