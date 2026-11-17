import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { createFixtures } from "../src/lib/admin/demo/fixtures";
import {
  balance,
  mutateDemo,
  paise,
  financeTotals,
} from "../src/lib/admin/demo/store";
import {
  routes,
  navigation,
  resolveRoute,
  BASE,
  detailHref,
} from "../src/lib/admin/demo/routes";
let count = 0;
function check(name: string, test: () => void) {
  test();
  count++;
  console.log(`PASS ${name}`);
}
check("fixture relationships and money reconcile", () => {
  const s = createFixtures();
  for (const order of s.orders) {
    const p = s.products.find((p) => p.id === order.productId)!;
    assert.equal(order.amount, p.price * order.quantity);
    assert(s.customers.some((c) => c.id === order.customerId));
    assert(s.vendors.some((v) => v.id === order.vendorId));
  }
  const settled = new Set();
  for (const batch of s.settlements) {
    assert.equal(
      batch.amount,
      batch.orderIds.reduce(
        (n, id) => n + s.orders.find((o) => o.id === id)!.amount,
        0,
      ),
    );
    for (const id of batch.orderIds) {
      assert(!settled.has(id));
      settled.add(id);
    }
  }
  for (const p of s.payments)
    assert(
      [...s.orders, ...s.services].some(
        (o) => o.id === p.sourceId && o.amount === p.amount,
      ),
    );
  for (const wallet of s.accounts) assert(balance(s, wallet.id).available >= 0);
  for (const refund of s.refunds)
    assert(s.payments.some((p) => p.id === refund.paymentId));
  assert(s.entries.length >= 100);
});
check(
  "withdrawal reserves once, approval does not pay, payment does not double debit",
  () => {
    let s = createFixtures();
    const walletId = "WAL-V1";
    const before = balance(s, walletId);
    const request = {
      type: "createWithdrawal",
      entity: "withdrawals",
      key: "request-1",
      payload: { walletId, amount: "500", destination: "demo@example" },
    };
    s = mutateDemo(s, request);
    const row = s.withdrawals[0];
    assert.equal(balance(s, walletId).available, before.available - 50000);
    assert.equal(balance(s, walletId).reserved, before.reserved + 50000);
    assert.deepEqual(mutateDemo(s, request), s);
    for (const status of ["Approved", "Processing", "Paid"]) {
      s = mutateDemo(s, {
        type: "transitionWithdrawal",
        entity: "withdrawals",
        id: row.id,
        payload: { status, reason: "Test review" },
      });
      assert.equal(balance(s, walletId).available, before.available - 50000);
    }
    assert.equal(balance(s, walletId).reserved, before.reserved);
    assert.equal(balance(s, walletId).paid, before.paid + 50000);
    assert.throws(() =>
      mutateDemo(s, {
        type: "transitionWithdrawal",
        entity: "withdrawals",
        id: row.id,
        payload: { status: "Paid", reason: "Duplicate" },
      }),
    );
  },
);
check("rejection and final payout failure release holds", () => {
  for (const status of ["Rejected", "Failed"]) {
    let s = createFixtures();
    const before = balance(s, "WAL-V1").available;
    s = mutateDemo(s, {
      type: "createWithdrawal",
      entity: "withdrawals",
      payload: {
        walletId: "WAL-V1",
        amount: "100",
        destination: "demo@example",
      },
    });
    const id = s.withdrawals[0].id;
    if (status === "Failed")
      for (const next of ["Approved", "Processing"])
        s = mutateDemo(s, {
          type: "transitionWithdrawal",
          entity: "withdrawals",
          id,
          payload: { status: next, reason: "Review" },
        });
    s = mutateDemo(s, {
      type: "transitionWithdrawal",
      entity: "withdrawals",
      id,
      payload: { status, reason: "Final outcome" },
    });
    assert.equal(balance(s, "WAL-V1").available, before);
  }
});
check(
  "insufficient balance, frozen account and invalid money rejected without mutation",
  () => {
    const s = createFixtures();
    const copy = structuredClone(s);
    assert.throws(() =>
      mutateDemo(s, {
        type: "createWithdrawal",
        entity: "withdrawals",
        payload: {
          walletId: "WAL-V1",
          amount: "999999",
          destination: "demo@example",
        },
      }),
    );
    assert.throws(() =>
      mutateDemo(s, {
        type: "createTopup",
        entity: "topups",
        payload: { walletId: "WAL-C20", amount: "10", reason: "Frozen" },
      }),
    );
    for (const value of ["-10", "1.001", "NaN", "0", "1e5"])
      assert.throws(() => paise(value));
    assert.deepEqual(s, copy);
  },
);
check(
  "refund caps include pending requests and completion posts only once",
  () => {
    let s = createFixtures();
    const payment = s.payments.find(
      (p) => !s.refunds.some((r) => r.paymentId === p.id),
    )!;
    const wallet = s.accounts.find((a) => a.ownerId === payment.customerId)!;
    const before = balance(s, wallet.id).available;
    s = mutateDemo(s, {
      type: "createRefund",
      entity: "refunds",
      payload: {
        paymentId: payment.id,
        amount: String(payment.amount / 100),
        destination: "Wallet",
        reason: "Return",
      },
    });
    const id = s.refunds[0].id;
    assert.throws(() =>
      mutateDemo(s, {
        type: "createRefund",
        entity: "refunds",
        payload: {
          paymentId: payment.id,
          amount: "0.01",
          destination: "Original payment",
          reason: "Duplicate",
        },
      }),
    );
    s = mutateDemo(s, {
      type: "resolveRefund",
      entity: "refunds",
      id,
      payload: { status: "Completed", reason: "Approved" },
    });
    assert.equal(balance(s, wallet.id).available, before + payment.amount);
    assert.throws(() =>
      mutateDemo(s, {
        type: "resolveRefund",
        entity: "refunds",
        id,
        payload: { status: "Completed", reason: "Duplicate" },
      }),
    );
  },
);
check(
  "adjustment reviewer separation, immutable reversal and promotional balance",
  () => {
    let s = createFixtures();
    s = mutateDemo(s, {
      type: "createAdjustment",
      entity: "adjustments",
      payload: {
        walletId: "WAL-C1",
        amount: "20",
        direction: "Credit",
        reason: "Goodwill",
      },
    });
    const id = s.adjustments[0].id;
    assert.throws(() =>
      mutateDemo(s, {
        type: "resolveCredit",
        entity: "adjustments",
        id,
        payload: { status: "Completed", reason: "Self approval" },
      }),
    );
    s = mutateDemo(s, { type: "role", payload: { role: "Finance" } });
    s = mutateDemo(s, {
      type: "resolveCredit",
      entity: "adjustments",
      id,
      payload: { status: "Completed", reason: "Independent review" },
    });
    const entry = s.entries[0];
    const amount = balance(s, "WAL-C1").available;
    s = mutateDemo(s, {
      type: "reverseEntry",
      entity: "entries",
      id: entry.id,
      payload: { reason: "Correction" },
    });
    assert.equal(balance(s, "WAL-C1").available, amount - 2000);
    assert.equal(s.entries.find((e) => e.id === entry.id)!.amount, 2000);
    assert.throws(() =>
      mutateDemo(s, {
        type: "reverseEntry",
        entity: "entries",
        id: entry.id,
        payload: { reason: "Duplicate" },
      }),
    );
    const before = balance(s, "WAL-C1").available;
    s = mutateDemo(s, {
      type: "resolveCredit",
      entity: "cashback",
      id: "CB-1",
      payload: { status: "Earned", reason: "Award" },
    });
    assert.equal(balance(s, "WAL-C1").available, before);
    assert.equal(balance(s, "WAL-C1").promotional, 5000);
  },
);
check("top-up failures do not credit; success is posted once", () => {
  let s = createFixtures();
  const before = balance(s, "WAL-C1").available;
  s = mutateDemo(s, {
    type: "resolveCredit",
    entity: "topups",
    id: "TOP-PENDING",
    payload: { status: "Completed", reason: "Confirmed" },
  });
  assert.equal(balance(s, "WAL-C1").available, before + 50000);
  assert.throws(() =>
    mutateDemo(s, {
      type: "resolveCredit",
      entity: "topups",
      id: "TOP-PENDING",
      payload: { status: "Completed", reason: "Duplicate" },
    }),
  );
  assert.throws(() =>
    mutateDemo(s, {
      type: "resolveCredit",
      entity: "topups",
      id: "TOP-FAILED",
      payload: { status: "Completed", reason: "Failed payment" },
    }),
  );
});
check("role restrictions, catalog validation and linked editing", () => {
  let s = createFixtures();
  s = mutateDemo(s, { type: "role", payload: { role: "Support" } });
  assert.throws(() =>
    mutateDemo(s, {
      type: "createWithdrawal",
      entity: "withdrawals",
      payload: {},
    }),
  );
  s = mutateDemo(s, {
    type: "reply",
    entity: "tickets",
    id: "TKT-1",
    payload: { message: "We are reviewing your request." },
  });
  assert.equal(s.tickets[0].messages.length, 2);
  s = mutateDemo(s, { type: "role", payload: { role: "Super admin" } });
  assert.throws(() =>
    mutateDemo(s, {
      type: "save",
      entity: "categories",
      id: "CAT-1",
      payload: { name: "Cycle", parentId: "CAT-10" },
    }),
  );
  assert.throws(() =>
    mutateDemo(s, {
      type: "status",
      entity: "categories",
      id: "CAT-1",
      payload: { status: "Archived", reason: "Still referenced" },
    }),
  );
  s = mutateDemo(s, {
    type: "save",
    entity: "products",
    id: "PRD-1",
    payload: {
      name: "Updated rice",
      categoryId: "CAT-3",
      vendorId: "VEN-1",
      price: "123.45",
      stock: "8",
    },
  });
  assert.equal(s.products[0].price, 12345);
  assert.equal(s.products[0].stock, 8);
  assert(s.audit.length > 1 && s.notifications.length > 2);
});
check("finance totals exclude top-ups and internal settlements", () => {
  let s = createFixtures();
  const before = financeTotals(s);
  s = mutateDemo(s, {
    type: "resolveCredit",
    entity: "topups",
    id: "TOP-PENDING",
    payload: { status: "Completed", reason: "Confirmed" },
  });
  assert.deepEqual(financeTotals(s), before);
});
check("all planned static pages, navigation and detail routes resolve", () => {
  for (const [path, route] of Object.entries(routes)) {
    assert(resolveRoute(BASE + path));
    const exact = `src/app/(AdminPanel)/admin/dashboard${path}/page.jsx`;
    assert(existsSync(exact) || path.startsWith("/finance/"), exact);
  }
  for (const [, items] of navigation)
    for (const [, path] of items) assert(resolveRoute(BASE + path), path);
  const s = createFixtures();
  for (const entity of [
    "accounts",
    "entries",
    "withdrawals",
    "settlements",
    "orders",
    "returns",
    "products",
    "categories",
    "customers",
    "vendors",
    "rationCards",
    "services",
    "blogs",
    "tickets",
  ]) {
    const href = detailHref(entity, s[entity][0].id)!;
    assert.equal(resolveRoute(href)!.id, s[entity][0].id);
  }
  assert.equal(resolveRoute(BASE + "/not-a-page"), null);
});
console.log(
  `\n${count} admin demo domain checks passed. No database or external services used.`,
);
