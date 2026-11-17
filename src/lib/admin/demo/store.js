export const RESERVED = ["Pending", "Approved", "Processing"];
export const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format((value || 0) / 100);
export const dateLabel = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";
export function balance(state, walletId) {
  const posted = state.entries
    .filter((e) => e.walletId === walletId && e.status === "Posted")
    .reduce((n, e) => n + e.amount, 0);
  const requests = state.withdrawals.filter((w) => w.walletId === walletId);
  const reserved = requests
    .filter((w) => RESERVED.includes(w.status))
    .reduce((n, w) => n + w.amount, 0);
  const paid = requests
    .filter((w) => w.status === "Paid")
    .reduce((n, w) => n + w.amount, 0);
  const promotional = state.cashback
    .filter((c) => c.walletId === walletId && c.status === "Earned")
    .reduce((n, c) => n + c.amount, 0);
  return {
    posted,
    available: posted - reserved - paid,
    reserved,
    paid,
    promotional,
  };
}
export function financeTotals(state) {
  const collections = state.payments
    .filter((p) => p.status === "Paid")
    .reduce((n, p) => n + p.amount, 0);
  const refunds = state.refunds
    .filter((r) => r.status === "Completed")
    .reduce((n, r) => n + r.amount, 0);
  const expenses = state.expenses.reduce((n, e) => n + e.amount, 0);
  const payouts = state.withdrawals
    .filter((w) => w.status === "Paid")
    .reduce((n, w) => n + w.amount, 0);
  return {
    collections,
    refunds,
    expenses,
    payouts,
    netCollections: collections - refunds,
  };
}
export function canManage(role, entity) {
  if (role === "Super admin") return true;
  if (role === "Finance")
    return [
      "withdrawals",
      "refunds",
      "adjustments",
      "topups",
      "cashback",
      "settlements",
      "expenses",
      "payments",
      "accounts",
      "entries",
    ].includes(entity);
  return ["tickets", "messages", "reviews", "notifications"].includes(entity);
}
export function paise(value) {
  if (!/^\d+(\.\d{1,2})?$/.test(String(value)))
    throw new Error("Enter a positive amount with up to two decimal places.");
  const amount = Math.round(Number(value) * 100);
  if (!Number.isSafeInteger(amount) || amount <= 0 || amount > 10000000000)
    throw new Error(
      "Amount must be greater than zero and no more than ₹10 crore.",
    );
  return amount;
}
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};
const required = (value, name) => {
  assert(
    typeof value === "string" && value.trim().length > 0,
    `${name} is required.`,
  );
  return value.trim();
};
const record = (state, entity, id) => {
  const item = state[entity]?.find((r) => r.id === id);
  assert(item, "This record no longer exists.");
  return item;
};
export function mutateDemo(previous, action) {
  if (action.key && previous.processedActions.includes(action.key))
    return previous;
  const state = structuredClone(previous);
  const now = action.now || new Date().toISOString();
  const id = (prefix) => `${prefix}-${++state.sequence}`;
  const { type, entity, payload = {} } = action;
  if (type === "role") {
    assert(
      ["Super admin", "Finance", "Support"].includes(payload.role),
      "Unknown role.",
    );
    state.role = payload.role;
    return state;
  }
  assert(
    canManage(state.role, entity),
    "Your preview role cannot perform this action. Switch to an authorized demo role.",
  );
  const ledger = (walletId, amount, kind, sourceId, name) => {
    assert(
      !state.entries.some((e) => e.sourceId === sourceId && e.kind === kind),
      "This transaction has already been posted.",
    );
    state.entries.unshift({
      id: id("LED"),
      walletId,
      amount,
      kind,
      sourceId,
      name,
      status: "Posted",
      createdAt: now,
    });
  };
  const activeWallet = (walletId, ownerType) => {
    const wallet = record(state, "accounts", walletId);
    assert(wallet.status === "Active", "This wallet is frozen.");
    if (ownerType)
      assert(
        wallet.type === ownerType,
        `Select a ${ownerType.toLowerCase()} wallet.`,
      );
    return wallet;
  };
  const refundable = (paymentId, exceptId) => {
    const payment = record(state, "payments", paymentId);
    assert(
      payment.status === "Paid",
      "Only paid transactions can be refunded.",
    );
    return (
      payment.amount -
      state.refunds
        .filter(
          (r) =>
            r.paymentId === paymentId &&
            r.id !== exceptId &&
            r.status !== "Rejected",
        )
        .reduce((n, r) => n + r.amount, 0)
    );
  };
  let subject = action.id || entity;
  let reason = payload.reason || type;
  if (type === "createWithdrawal") {
    activeWallet(payload.walletId, "Vendor");
    const amount = paise(payload.amount);
    assert(
      amount >= state.settings.withdrawalMinimum &&
        amount <= state.settings.withdrawalMaximum,
      "Amount is outside the configured withdrawal limits.",
    );
    assert(
      amount <= balance(state, payload.walletId).available,
      "Insufficient available balance.",
    );
    assert(
      /^[a-zA-Z0-9._-]{2,}@[a-zA-Z]{2,}$/.test(payload.destination || ""),
      "Enter a valid demo UPI destination.",
    );
    subject = id("WD");
    state.withdrawals.unshift({
      id: subject,
      name: "Vendor withdrawal",
      walletId: payload.walletId,
      amount,
      destination: payload.destination,
      status: "Pending",
      createdAt: now,
      history: [{ status: "Pending", note: "Funds reserved", createdAt: now }],
    });
  } else if (type === "transitionWithdrawal") {
    const item = record(state, "withdrawals", action.id);
    const allowed = {
      Pending: ["Approved", "Rejected"],
      Approved: ["Processing", "Rejected"],
      Processing: ["Paid", "Failed"],
    };
    assert(
      allowed[item.status]?.includes(payload.status),
      "This withdrawal has changed or the transition is not allowed.",
    );
    reason = required(payload.reason, "Review note");
    if (payload.status === "Processing") activeWallet(item.walletId, "Vendor");
    item.status = payload.status;
    item.reason = reason;
    if (item.status === "Paid") item.reference = `DEMO-UTR-${id("PAY")}`;
    item.history.push({ status: item.status, note: reason, createdAt: now });
  } else if (type === "createRefund") {
    const payment = record(state, "payments", payload.paymentId);
    const amount = paise(payload.amount);
    assert(
      amount <= refundable(payment.id),
      "Amount exceeds the remaining refundable amount, including pending requests.",
    );
    assert(
      ["Wallet", "Original payment"].includes(payload.destination),
      "Choose a refund destination.",
    );
    const wallet = state.accounts.find(
      (a) => a.ownerId === payment.customerId && a.type === "Customer",
    );
    assert(wallet, "Customer wallet not found.");
    reason = required(payload.reason, "Refund reason");
    subject = id("REF");
    state.refunds.unshift({
      id: subject,
      name: `Refund for ${payment.sourceId}`,
      paymentId: payment.id,
      walletId: wallet.id,
      amount,
      destination: payload.destination,
      reason,
      status: "Pending",
      createdAt: now,
    });
  } else if (type === "resolveRefund") {
    const item = record(state, "refunds", action.id);
    assert(item.status === "Pending", "This refund was already reviewed.");
    assert(
      ["Completed", "Rejected"].includes(payload.status),
      "Invalid refund outcome.",
    );
    reason = required(payload.reason, "Review note");
    assert(
      item.amount <= refundable(item.paymentId, item.id),
      "Refund exceeds the payment amount.",
    );
    item.status = payload.status;
    item.reviewNote = reason;
    if (item.status === "Completed" && item.destination === "Wallet")
      ledger(item.walletId, item.amount, "Refund", item.id, item.name);
  } else if (
    type === "createTopup" ||
    type === "createAdjustment" ||
    type === "createCashback"
  ) {
    activeWallet(
      payload.walletId,
      type === "createAdjustment" ? undefined : "Customer",
    );
    let amount = paise(payload.amount);
    if (type === "createAdjustment" && payload.direction === "Debit")
      amount = -amount;
    assert(
      amount >= 0 || balance(state, payload.walletId).available >= -amount,
      "Insufficient available balance.",
    );
    reason = required(payload.reason, "Reason");
    subject = id(
      type === "createTopup"
        ? "TOP"
        : type === "createAdjustment"
          ? "ADJ"
          : "CB",
    );
    state[entity].unshift({
      id: subject,
      name: reason,
      walletId: payload.walletId,
      amount,
      reason,
      actor: state.role,
      status: "Pending",
      expiresAt: "2026-12-31",
      createdAt: now,
    });
  } else if (type === "resolveCredit") {
    const item = record(state, entity, action.id);
    assert(item.status === "Pending", "This request was already reviewed.");
    const outcomes = {
      topups: ["Completed", "Failed"],
      adjustments: ["Completed", "Rejected"],
      cashback: ["Earned", "Rejected"],
    };
    assert(outcomes[entity]?.includes(payload.status), "Invalid outcome.");
    reason = required(payload.reason, "Review note");
    if (entity === "adjustments" && payload.status === "Completed")
      assert(
        item.actor !== state.role,
        "Switch to a different authorized demo reviewer to approve this adjustment.",
      );
    if (["Completed", "Earned"].includes(payload.status)) {
      activeWallet(item.walletId);
      assert(
        item.amount >= 0 ||
          balance(state, item.walletId).available >= -item.amount,
        "Insufficient available balance.",
      );
      if (entity !== "cashback")
        ledger(
          item.walletId,
          item.amount,
          entity === "topups" ? "Top-up" : "Adjustment",
          item.id,
          item.name,
        );
    }
    item.status = payload.status;
    item.reviewNote = reason;
  } else if (type === "expireCashback") {
    const item = record(state, "cashback", action.id);
    assert(item.status === "Earned", "Only earned credits can expire.");
    item.status = "Expired";
  } else if (type === "reverseEntry") {
    const item = record(state, "entries", action.id);
    assert(
      item.kind === "Adjustment",
      "Only manual adjustments can be reversed here. Use the refund workflow for purchases.",
    );
    assert(
      !state.entries.some((e) => e.sourceId === item.id),
      "This entry was already reversed.",
    );
    reason = required(payload.reason, "Reversal reason");
    assert(
      item.amount <= 0 ||
        balance(state, item.walletId).available >= item.amount,
      "Reversal would exceed available balance.",
    );
    ledger(item.walletId, -item.amount, "Reversal", item.id, reason);
  } else if (type === "freeze") {
    const item = record(state, "accounts", action.id);
    reason = required(payload.reason, "Reason");
    item.status = item.status === "Active" ? "Frozen" : "Active";
  } else if (type === "postSettlement") {
    const item = record(state, "settlements", action.id);
    assert(item.status === "Draft", "Settlement already posted.");
    assert(
      item.amount > 0 && item.orderIds.length > 0,
      "Add eligible delivered orders before posting a settlement.",
    );
    const wallet = state.accounts.find((a) => a.ownerId === item.vendorId);
    ledger(wallet.id, item.amount - item.fee, "Settlement", item.id, item.name);
    item.status = "Posted";
  } else if (type === "reply") {
    const item = record(state, "tickets", action.id);
    item.messages.push({
      text: required(payload.message, "Reply"),
      actor: state.role,
      createdAt: now,
    });
  } else if (type === "status") {
    const item = record(state, entity, action.id);
    const transitions = {
      orders: {
        Pending: ["Processing", "Cancelled"],
        Processing: ["Shipped", "Cancelled"],
        Shipped: ["Delivered"],
        Delivered: ["Returned"],
      },
      vendors: {
        Pending: ["Active", "Rejected"],
        Active: ["Suspended"],
        Suspended: ["Active"],
      },
      customers: { Active: ["Suspended"], Suspended: ["Active"] },
      tickets: { Open: ["Resolved"], Resolved: ["Open"] },
      messages: { Unread: ["Read"], Read: ["Unread"] },
      notifications: { Unread: ["Read"], Read: ["Unread"] },
      reviews: {
        Pending: ["Published", "Hidden"],
        Published: ["Hidden"],
        Hidden: ["Published"],
      },
      returns: {
        Pending: ["Approved", "Rejected"],
        Approved: ["Received"],
        Received: ["Completed"],
      },
      rationCards: { Pending: ["Approved", "Rejected"] },
      services: { Processing: ["Completed", "Failed"] },
      products: { Active: ["Archived"], Archived: ["Active"] },
      categories: { Active: ["Archived"], Archived: ["Active"] },
    };
    assert(
      transitions[entity]?.[item.status]?.includes(payload.status),
      "This status change is not allowed.",
    );
    reason = required(payload.reason, "Reason");
    if (entity === "categories" && payload.status === "Archived")
      assert(
        !state.products.some(
          (p) => p.categoryId === item.id && p.status === "Active",
        ) &&
          !state.categories.some(
            (c) => c.parentId === item.id && c.status === "Active",
          ),
        "Move or archive active products and child categories first.",
      );
    item.status = payload.status;
    item.reason = reason;
    if (item.history)
      item.history.push({ status: item.status, note: reason, createdAt: now });
  } else if (type === "matchPayment") {
    record(state, "payments", action.id).matched = true;
  } else if (type === "saveSettings") {
    if (entity === "profile")
      state.profile = {
        name: required(payload.name, "Name"),
        email: required(payload.email, "Email"),
      };
    else {
      const next = { ...state.settings };
      if (payload.name !== undefined)
        next.name = required(payload.name, "Store name");
      if (payload.email !== undefined)
        next.email = required(payload.email, "Email");
      if (payload.withdrawalMinimum !== undefined)
        next.withdrawalMinimum = paise(payload.withdrawalMinimum);
      if (payload.withdrawalMaximum !== undefined)
        next.withdrawalMaximum = paise(payload.withdrawalMaximum);
      if (payload.cashbackPercent !== undefined) {
        next.cashbackPercent = Number(payload.cashbackPercent);
        assert(
          Number.isFinite(next.cashbackPercent) &&
            next.cashbackPercent >= 0 &&
            next.cashbackPercent <= 100,
          "Cashback must be between 0 and 100%.",
        );
      }
      assert(
        next.withdrawalMinimum <= next.withdrawalMaximum,
        "Minimum cannot exceed maximum.",
      );
      state.settings = next;
    }
  } else if (type === "save") {
    const fields = {
      products: ["name", "categoryId", "vendorId", "price", "stock"],
      categories: ["name", "parentId"],
      blogs: ["name", "content", "status"],
      coupons: ["name", "discount", "limit", "expiresAt"],
      banners: ["name", "content", "status"],
      expenses: ["name", "amount"],
      policies: ["content"],
      reviews: ["name", "productId", "customerId", "rating"],
      tickets: ["name", "ownerId", "priority", "assignee"],
      returns: ["orderId", "reason"],
    };
    assert(fields[entity], "Editing is not supported for this record.");
    const existing = action.id ? record(state, entity, action.id) : null;
    const data = Object.fromEntries(
      fields[entity]
        .filter((k) => payload[k] !== undefined)
        .map((k) => [
          k,
          typeof payload[k] === "string" ? payload[k].trim() : payload[k],
        ]),
    );
    if (fields[entity].includes("name"))
      data.name = required(data.name, "Name");
    if (entity === "products") {
      record(state, "categories", data.categoryId);
      record(state, "vendors", data.vendorId);
      data.price = paise(data.price);
      data.stock = Number(data.stock);
      assert(
        Number.isInteger(data.stock) && data.stock >= 0,
        "Stock must be a non-negative whole number.",
      );
    }
    if (entity === "categories" && data.parentId) {
      let parent = record(state, "categories", data.parentId);
      let depth = 1;
      while (parent) {
        assert(parent.id !== action.id, "A category cannot contain itself.");
        if (!parent.parentId) break;
        parent = record(state, "categories", parent.parentId);
        depth++;
      }
      const childDepth = (node) =>
        Math.max(
          0,
          ...state.categories
            .filter((c) => c.parentId === node)
            .map((c) => 1 + childDepth(c.id)),
        );
      assert(
        depth + 1 + (action.id ? childDepth(action.id) : 0) <= 3,
        "Categories support up to three levels.",
      );
    }
    if (entity === "expenses") data.amount = paise(data.amount);
    if (entity === "coupons") {
      data.discount = Number(data.discount);
      data.limit = Number(data.limit);
      assert(
        data.discount > 0 &&
          data.discount <= 100 &&
          Number.isInteger(data.limit) &&
          data.limit > 0,
        "Enter a discount of 1–100% and a positive usage limit.",
      );
      assert(
        /^\d{4}-\d{2}-\d{2}$/.test(data.expiresAt),
        "Choose an expiry date.",
      );
      data.status = data.expiresAt < now.slice(0, 10) ? "Expired" : "Active";
    }
    if (entity === "reviews") {
      record(state, "products", data.productId);
      record(state, "customers", data.customerId);
      data.rating = Number(data.rating);
      assert(
        Number.isInteger(data.rating) && data.rating >= 1 && data.rating <= 5,
        "Rating must be 1–5.",
      );
    }
    if (entity === "returns") {
      const order = record(state, "orders", data.orderId);
      assert(
        ["Delivered", "Returned"].includes(order.status),
        "Returns require a delivered order.",
      );
      data.reason = required(data.reason, "Reason");
      data.name = data.reason;
    }
    if (entity === "tickets") {
      assert(
        [...state.customers, ...state.vendors].some(
          (o) => o.id === data.ownerId,
        ),
        "Choose a valid owner.",
      );
    }
    if (entity === "blogs" || entity === "banners")
      assert(
        ["Draft", "Published", "Active"].includes(data.status),
        "Choose a valid publishing state.",
      );
    if (fields[entity].includes("content"))
      data.content = required(data.content, "Content");
    subject = existing?.id || id(entity.toUpperCase());
    if (existing) Object.assign(existing, data, { updatedAt: now });
    else
      state[entity].unshift({
        id: subject,
        ...data,
        status:
          data.status ||
          (["products", "categories"].includes(entity)
            ? "Active"
            : entity === "expenses"
              ? "Recorded"
              : entity === "tickets"
                ? "Open"
                : "Pending"),
        createdAt: now,
        ...(entity === "tickets" ? { messages: [] } : {}),
        ...(entity === "products"
          ? { image: "/images/admin-demo-product.svg" }
          : {}),
      });
  } else throw new Error("Unknown demo action.");
  if (action.key) state.processedActions.push(action.key);
  state.audit.unshift({
    id: id("AUD"),
    name: `${type} · ${subject}`,
    actor: state.role,
    reason,
    status: "Recorded",
    createdAt: now,
  });
  if (entity !== "notifications")
    state.notifications.unshift({
      id: id("NTF"),
      name: `${subject}: ${payload.status || "updated"}`,
      href: "/settings/audit-log",
      status: "Unread",
      createdAt: now,
    });
  return state;
}
